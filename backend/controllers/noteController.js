import Note from "../models/Note.js";
import Activity from "../models/Activity.js";
import { uploadToCloudinary } from "../services/cloudinary.js";
import { extractTextFromPDF } from "../services/pdfParser.js";
import { generateEmbeddings } from "../services/gemini.js";
import { upsertVectors } from "../services/pinecone.js";
import fs from "fs";

// @desc    Upload a new note
// @route   POST /api/notes/upload
// @access  Private
const uploadNote = async (req, res) => {
  try {
    const { title, subject, content: textContent } = req.body;
    let extractedText = textContent || "";
    let fileUrl = "";
    let fileType = "text";
    let pageCount = 0;

    if (req.file) {
      const cloudinaryResult = await uploadToCloudinary(req.file.path);
      fileUrl = cloudinaryResult.secure_url;
      fileType = "pdf";

      const pdfData = await extractTextFromPDF(req.file.path);
      extractedText = pdfData.text;
      pageCount = pdfData.pageCount;

      // Clean up local file
      fs.unlinkSync(req.file.path);
    }

    const note = await Note.create({
      user: req.user._id,
      title,
      subject,
      content: extractedText,
      fileUrl,
      fileType,
      pageCount,
    });

    // Create activity
    await Activity.create({
      user: req.user._id,
      type: "upload",
      title: "Note Uploaded",
      description: `Uploaded note: ${title}`,
    });

    // Generate embeddings and upsert to Pinecone for RAG in background
    // Improved chunking: split by paragraphs/sentences, max ~800 chars with overlap
    const chunkText = (text, size = 800, overlap = 100) => {
      const chunks = [];
      let i = 0;
      while (i < text.length) {
        chunks.push(text.slice(i, i + size));
        i += size - overlap;
      }
      return chunks;
    };

    const chunks = chunkText(extractedText);
    
    // Process in background to avoid timeout
    if (chunks.length > 0) {
      (async () => {
        try {
          console.log(`Starting background indexing for note: ${note._id} (${chunks.length} chunks)`);
          
          // Generate embeddings in smaller batches to respect free tier rate limits (100 RPM)
          const batchSize = 3;
          const vectors = [];

          for (let i = 0; i < chunks.length; i += batchSize) {
            const batch = chunks.slice(i, i + batchSize);
            const index = i;

            const batchPromises = batch.map(async (text, i) => {
              try {
                // Introduce a staggered delay within the batch
                await new Promise(resolve => setTimeout(resolve, i * 1000));

                const embedding = await generateEmbeddings(text);
                if (embedding && Array.isArray(embedding) && embedding.length > 0) {
                  return {
                    id: `${note._id}_${index + i}`,
                    values: embedding,
                    metadata: {
                      noteId: note._id.toString(),
                      userId: req.user._id.toString(),
                      text: text,
                    },
                  };
                }
              } catch (err) {
                console.error(`Failed to generate embedding for chunk ${index + i}:`, err.message);
              }
              return null;
            });

            const results = await Promise.all(batchPromises);
            const validResults = results.filter(v => v !== null && typeof v === 'object');

            if (validResults.length > 0) {
              await upsertVectors(validResults);
              console.log(`Upserted batch of ${validResults.length} vectors to Pinecone (${i + validResults.length}/${chunks.length})`);
            }

            // Wait longer between batches to safely stay under 100 RPM
            if (i + batchSize < chunks.length) {
              await new Promise(resolve => setTimeout(resolve, 3000));
            }
          }
          console.log(`Background indexing COMPLETED for note: ${note._id}`);
          } catch (err) {
          console.error("Background Pinecone Upsert Error:", err);
          }
      })();
    }

    res.status(201).json({
      success: true,
      data: note,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all notes for a user
// @route   GET /api/notes
// @access  Private
const getNotes = async (req, res) => {
  const notes = await Note.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, data: notes });
};

// @desc    Get a single note
// @route   GET /api/notes/:id
// @access  Private
const getNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (note) {
      if (note.user.toString() !== req.user._id.toString()) {
        res.status(401).json({ success: false, message: "User not authorized" });
        return;
      }
      res.json({ success: true, data: note });
    } else {
      res.status(404).json({ success: false, message: "Note not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a note
// @route   DELETE /api/notes/:id
// @access  Private
const deleteNote = async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (note) {
    if (note.user.toString() !== req.user._id.toString()) {
      res.status(401).json({ success: false, message: "User not authorized" });
      return;
    }

    await note.deleteOne();
    res.json({ success: true, message: "Note removed" });
  } else {
    res.status(404).json({ success: false, message: "Note not found" });
  }
};

export { uploadNote, getNotes, getNote, deleteNote };
