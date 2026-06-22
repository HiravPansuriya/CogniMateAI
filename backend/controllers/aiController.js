import Note from "../models/Note.js";
import Summary from "../models/Summary.js";
import Activity from "../models/Activity.js";
import Quiz from "../models/Quiz.js";
import QuizResult from "../models/QuizResult.js";
import FlashcardDeck from "../models/FlashcardDeck.js";
import StudyPlan from "../models/StudyPlan.js";
import Chat from "../models/Chat.js";
import { generateContent, generateEmbeddings } from "../services/gemini.js";
import { queryVectors } from "../services/pinecone.js";

const extractJSON = (text) => {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(text);
  } catch (error) {
    console.error("JSON Parsing Error:", error, "Text:", text);
    throw new Error("Failed to parse AI response");
  }
};

// @desc    Generate summary for a note
// @route   POST /api/summary/generate
// @access  Private
const generateSummary = async (req, res) => {
  const { noteId } = req.body;

  const note = await Note.findById(noteId);

  if (!note) {
    res.status(404).json({ success: false, message: "Note not found" });
    return;
  }

  const prompt = `
    Analyze the following study notes and provide a comprehensive, detailed summary. 
    Do not just list the topics; instead, for every major topic or concept found in the notes, provide a clear and thorough description based on the content.
    
    The summary should be structured such that a student can fully understand the material just by reading it.
    
    Format the response strictly as a JSON object with the following structure:
    {
      "content": "A detailed, multi-paragraph summary covering all major topics with their descriptions",
      "keyConcepts": ["Topic 1: Detailed description...", "Topic 2: Detailed description...", "etc."],
      "definitions": ["Term: Thorough definition...", "Term 2: Thorough definition...", "etc."],
      "examNotes": ["Detailed exam-focused point 1", "Detailed exam-focused point 2"]
    }

    Notes:
    ${note.content}
  `;

  try {
    const aiResponse = await generateContent(prompt);
    const summaryData = extractJSON(aiResponse);

    const summary = await Summary.create({
      user: req.user._id,
      noteId,
      ...summaryData,
    });

    await Activity.create({
      user: req.user._id,
      type: "summary",
      title: "Summary Generated",
      description: `Generated summary for note: ${note.title}`,
    });

    res.status(201).json({ success: true, data: summary });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to generate summary" });
  }
};

// @desc    Ask a question about notes (RAG)
// @route   POST /api/chat/ask
// @access  Private
const askQuestion = async (req, res) => {
  const { noteId, question } = req.body;

  try {
    // 1. Save user question to Chat history
    await Chat.create({
      user: req.user._id,
      noteId,
      role: "user",
      content: question,
    });

    // 2. Generate embedding for the question
    const questionEmbedding = await generateEmbeddings(question);

    // 3. Query Pinecone for relevant context
    console.log(`Querying Pinecone for noteId: ${noteId}`);
    const matches = await queryVectors(questionEmbedding, 8, {
      noteId: noteId.toString(),
    });

    console.log(`Found ${matches?.length || 0} matches in Pinecone`);

    const context = matches
      .filter((m) => m.metadata && m.metadata.text)
      .map((m) => m.metadata.text)
      .join("\n\n");

    if (!context) {
      return res.json({
        success: true,
        data: {
          role: "assistant",
          content: "I couldn't find any information for this note in my database. Please try re-uploading the note to ensure it's properly indexed.",
          sources: [],
          createdAt: new Date(),
        },
      });
    }

    // 4. Generate answer using context
    const prompt = `
      You are an expert AI study assistant. Answer the student's question based on the provided context from their notes.
      
      Your goal is to provide a highly structured, detailed, and comprehensive answer that helps the student understand the topic deeply.
      
      Guidelines:
      1. Use clear headings, bullet points, and bold text for key terms to make the information easy to scan.
      2. Provide detailed explanations for concepts found in the context.
      3. Use only the provided context. If the answer is absolutely not there, say "I couldn't find specific information about this in your notes."
      4. If the context is relevant but doesn't fully answer, provide a thorough explanation of what you did find.
      5. Organize your response logically (e.g., Overview, Key Concepts, Detailed Breakdown).
      6. IMPORTANT: Use proper Markdown formatting with double newlines between paragraphs and headings to ensure correct rendering.

      Context:
      ${context}

      Question:
      ${question}
      
      Response (provide a detailed and well-structured educational answer):
    `;

    const answer = await generateContent(prompt);

    // 5. Save AI response to Chat history
    const chatResponse = await Chat.create({
      user: req.user._id,
      noteId,
      role: "assistant",
      content: answer,
      sources: matches.map((m) => m.metadata.text),
    });

    await Activity.create({
      user: req.user._id,
      type: "chat",
      title: "Chat with Notes",
      description: `Asked question: ${question}`,
    });

    res.json({
      success: true,
      data: chatResponse,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to process question" });
  }
};

// @desc    Generate quiz from a note
// @route   POST /api/quiz/generate
// @access  Private
const generateQuiz = async (req, res) => {
  const { noteId, type, count = 5 } = req.body;

  const note = await Note.findById(noteId);

  if (!note) {
    res.status(404).json({ success: false, message: "Note not found" });
    return;
  }

  const prompt = `
    TASK: Generate a ${type} quiz with ${count} questions.
    CONTENT: Use the study notes provided below.
    
    OUTPUT REQUIREMENTS:
    1. Respond ONLY with a valid JSON array of objects. No intro or outro text.
    2. Each object must have:
       - "question": string
       - "type": "${type}"
       - "options": Array of 4 objects with "label" (A, B, C, D) and "text" (for MCQ only, else empty array)
       - "correctAnswer": string (label for MCQ, "True"/"False" for T/F, or answer for fill-blanks)
       - "explanation": string (brief reason why it's correct)

    NOTES:
    ${note.content}
  `;

  try {
    const startTime = Date.now();
    console.log(`[${new Date().toISOString()}] Generating quiz for noteId: ${noteId}, type: ${type}`);
    
    const aiResponse = await generateContent(prompt);
    console.log(`[${new Date().toISOString()}] AI Response received in ${(Date.now() - startTime)/1000}s`);
    
    const questions = extractJSON(aiResponse);
    console.log(`[${new Date().toISOString()}] Extracted ${questions.length} questions`);

    // Normalize each question
    const formattedQuestions = questions.map(q => {
      let normalizedAnswer = q.correctAnswer;
      if (type === "mcq" && typeof normalizedAnswer === "string") {
        normalizedAnswer = normalizedAnswer.toUpperCase();
      }

      return {
        question: q.question,
        type: q.type || type,
        options: q.options || [],
        correctAnswer: normalizedAnswer,
        explanation: q.explanation || "No explanation provided."
      };
    });

    const quiz = await Quiz.create({
      user: req.user._id,
      noteId,
      title: `Quiz: ${note.title}`,
      type,
      questions: formattedQuestions,
    });
    console.log(`[${new Date().toISOString()}] Quiz created in DB`);

    await Activity.create({
      user: req.user._id,
      type: "quiz",
      title: "Quiz Generated",
      description: `Generated ${type} quiz for note: ${note.title}`,
    });

    res.status(201).json({ success: true, data: quiz });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Quiz Generation Error:`, error);
    res.status(500).json({ success: false, message: "Failed to generate quiz" });
  }
};

// @desc    Submit quiz answers
// @route   POST /api/quiz/submit
// @access  Private
const submitQuiz = async (req, res) => {
  const { quizId, answers } = req.body;

  const quiz = await Quiz.findById(quizId);

  if (!quiz) {
    res.status(404).json({ success: false, message: "Quiz not found" });
    return;
  }

  let score = 0;
  let unattemptedCount = 0;
  const results = quiz.questions.map((q) => {
    const userAnswer = answers[q._id];
    
    if (!userAnswer || userAnswer === "" || userAnswer === "Unattempted") {
      unattemptedCount++;
      return {
        questionId: q._id,
        userAnswer: "Unattempted",
        correctAnswer: q.correctAnswer,
        isCorrect: false,
        isSkipped: true,
        explanation: q.explanation,
      };
    }

    const isCorrect = userAnswer === q.correctAnswer;
    if (isCorrect) score++;

    return {
      questionId: q._id,
      userAnswer,
      correctAnswer: q.correctAnswer,
      isCorrect,
      isSkipped: false,
      explanation: q.explanation,
    };
  });

  const quizResult = await QuizResult.create({
    user: req.user._id,
    quizId,
    score,
    unattemptedCount,
    totalQuestions: quiz.questions.length,
    percentage: (score / quiz.questions.length) * 100,
    results,
  });

  res.status(201).json({ success: true, data: quizResult });
};

// @desc    Generate flashcards from a note
// @route   POST /api/flashcards/generate
// @access  Private
const generateFlashcards = async (req, res) => {
  const { noteId } = req.body;

  const note = await Note.findById(noteId);

  if (!note) {
    res.status(404).json({ success: false, message: "Note not found" });
    return;
  }

  const prompt = `
    Generate a deck of flashcards based on the following notes.
    Format the response strictly as a JSON array of cards:
    [
      {
        "front": "Question or Concept",
        "back": "Answer or Definition"
      }
    ]

    Notes:
    ${note.content}
  `;

  try {
    const aiResponse = await generateContent(prompt);
    const cards = extractJSON(aiResponse);

    const deck = await FlashcardDeck.create({
      user: req.user._id,
      noteId,
      title: `Flashcards: ${note.title}`,
      subject: note.subject,
      cards,
    });

    await Activity.create({
      user: req.user._id,
      type: "flashcard",
      title: "Flashcards Generated",
      description: `Generated flashcards for note: ${note.title}`,
    });

    res.status(201).json({ success: true, data: deck });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to generate flashcards" });
  }
};

// @desc    Generate study plan
// @route   POST /api/planner/generate
// @access  Private
const generateStudyPlan = async (req, res) => {
  const { subjects, examDate, hoursPerDay } = req.body;

  const prompt = `
    Generate a personalized study plan for the following subjects leading up to the exam date on ${examDate}.
    The student can study ${hoursPerDay} hours per day.
    Format the response strictly as a JSON object with the following structure:
    {
      "schedule": [
        {
          "date": "YYYY-MM-DD",
          "tasks": [
            {"subject": "Subject Name", "topic": "Topic to study", "duration": "Duration (e.g. 2h)", "completed": false}
          ],
          "totalHours": 4
        }
      ]
    }

    Subjects: ${subjects.join(", ")}
  `;

  try {
    const aiResponse = await generateContent(prompt);
    const planData = extractJSON(aiResponse);

    const studyPlan = await StudyPlan.create({
      user: req.user._id,
      subjects,
      examDate,
      hoursPerDay,
      schedule: planData.schedule,
    });

    await Activity.create({
      user: req.user._id,
      type: "planner",
      title: "Study Plan Generated",
      description: `Generated study plan for ${subjects.length} subjects`,
    });

    res.status(201).json({ success: true, data: studyPlan });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to generate study plan" });
  }
};

// @desc    Get chat history for a note
// @route   GET /api/chat/history/:noteId
// @access  Private
const getChatHistory = async (req, res) => {
  try {
    const chats = await Chat.find({
      user: req.user._id,
      noteId: req.params.noteId,
    }).sort({ createdAt: 1 });

    res.json({ success: true, data: chats });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch chat history" });
  }
};

export {
  generateSummary,
  askQuestion,
  generateQuiz,
  submitQuiz,
  generateFlashcards,
  generateStudyPlan,
  getChatHistory,
};
