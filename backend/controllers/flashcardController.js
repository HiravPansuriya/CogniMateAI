import FlashcardDeck from "../models/FlashcardDeck.js";

const getFlashcards = async (req, res) => {
  try {
    const decks = await FlashcardDeck.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json({ success: true, data: decks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteFlashcardDeck = async (req, res) => {
  try {
    const deck = await FlashcardDeck.findById(req.params.id);
    if (deck && deck.user.toString() === req.user._id.toString()) {
      await deck.deleteOne();
      res.json({ success: true, message: "Deck removed" });
    } else {
      res.status(404).json({ success: false, message: "Deck not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { getFlashcards, deleteFlashcardDeck };
