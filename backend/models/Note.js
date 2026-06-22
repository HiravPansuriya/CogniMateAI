import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
    },
    fileType: {
      type: String,
      enum: ["pdf", "text"],
      default: "text",
    },
    pageCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Note = mongoose.model("Note", noteSchema);

export default Note;
