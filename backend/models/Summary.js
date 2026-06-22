import mongoose from "mongoose";

const summarySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    noteId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Note",
    },
    content: {
      type: String,
      required: true,
    },
    keyConcepts: [String],
    definitions: [String],
    examNotes: [String],
  },
  {
    timestamps: true,
  }
);

const Summary = mongoose.model("Summary", summarySchema);

export default Summary;
