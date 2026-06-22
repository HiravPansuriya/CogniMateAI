import mongoose from "mongoose";

const flashcardSchema = new mongoose.Schema({
  front: { type: String, required: true },
  back: { type: String, required: true },
});

const flashcardDeckSchema = new mongoose.Schema(
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
    title: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    cards: [flashcardSchema],
  },
  {
    timestamps: true,
  }
);

const FlashcardDeck = mongoose.model("FlashcardDeck", flashcardDeckSchema);

export default FlashcardDeck;
