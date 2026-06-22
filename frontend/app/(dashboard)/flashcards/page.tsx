"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import api from "@/lib/api";
import type { Note, FlashcardDeck, Flashcard } from "@/types";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import Select from "@/components/ui/Select";
import Modal from "@/components/ui/Modal";
import { formatDate, stringToColor } from "@/lib/utils";
import toast from "react-hot-toast";
import {
  HiOutlineRectangleStack,
  HiOutlineTrash,
  HiOutlineArrowLeft,
  HiOutlineArrowRight,
  HiOutlineXMark,
} from "react-icons/hi2";

function FlashcardItem({ card, isFlipped, onFlip }: { card: Flashcard; isFlipped: boolean; onFlip: () => void }) {
  return (
    <div className="flashcard-container w-full max-w-lg mx-auto" style={{ height: 320 }} onClick={onFlip}>
      <div className={`flashcard-inner w-full h-full cursor-pointer ${isFlipped ? "flipped" : ""}`}>
        {/* Front */}
        <div className="flashcard-front absolute inset-0 glass-card p-8 flex flex-col items-center justify-center text-center">
          <p className="text-xs text-text-tertiary uppercase tracking-wider mb-4">Question</p>
          <p className="text-lg font-medium text-text-primary leading-relaxed">{card.front}</p>
          <p className="text-xs text-text-tertiary mt-6">Click to reveal answer</p>
        </div>
        {/* Back */}
        <div className="flashcard-back absolute inset-0 glass-card p-8 flex flex-col items-center justify-center text-center border-accent-primary/30">
          <p className="text-xs text-accent-primary uppercase tracking-wider mb-4">Answer</p>
          <p className="text-lg font-medium text-text-primary leading-relaxed">{card.back}</p>
        </div>
      </div>
    </div>
  );
}

export default function FlashcardsPage() {
  const searchParams = useSearchParams();
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState(searchParams.get("noteId") || "");
  const [decks, setDecks] = useState<FlashcardDeck[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  // Review mode
  const [reviewDeck, setReviewDeck] = useState<FlashcardDeck | null>(null);
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Delete confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deckToDelete, setDeckToDelete] = useState<FlashcardDeck | null>(null);

  const fetchDecks = async () => {
    setLoading(true);
    try {
      const res = await api.get("/flashcards");
      setDecks(res.data.data || res.data || []);
    } catch (err: any) { 
      setDecks([]); 
      toast.error(err.response?.data?.message || "Failed to fetch flashcard decks");
    }
    finally { setLoading(false); }
  };

  useEffect(() => {
    api.get("/notes")
      .then((res) => setNotes(res.data.data || res.data || []))
      .catch((err) => toast.error(err.response?.data?.message || "Failed to fetch notes"));
    fetchDecks();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateFlashcards = async () => {
    if (!selectedNote) return toast.error("Please select a note");
    setGenerating(true);
    try {
      await api.post("/flashcards/generate", { noteId: selectedNote });
      toast.success("Flashcards generated!");
      fetchDecks();
    } catch (err: any) { 
      toast.error(err.response?.data?.message || "Failed to generate flashcards"); 
    }
    finally { setGenerating(false); }
  };

  const confirmDelete = async () => {
    if (!deckToDelete) return;
    try {
      await api.delete(`/flashcards/${deckToDelete._id}`);
      toast.success("Deck deleted");
      setDecks((prev) => prev.filter((d) => d._id !== deckToDelete._id));
      setShowDeleteModal(false);
      setDeckToDelete(null);
    } catch (err: any) { 
      toast.error(err.response?.data?.message || "Failed to delete deck"); 
    }
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!reviewDeck) return;
    if (e.key === "ArrowRight" && currentCard < reviewDeck.cards.length - 1) { setCurrentCard((p) => p + 1); setIsFlipped(false); }
    if (e.key === "ArrowLeft" && currentCard > 0) { setCurrentCard((p) => p - 1); setIsFlipped(false); }
    if (e.key === " ") { e.preventDefault(); setIsFlipped((p) => !p); }
  }, [reviewDeck, currentCard]);

  useEffect(() => { window.addEventListener("keydown", handleKeyDown); return () => window.removeEventListener("keydown", handleKeyDown); }, [handleKeyDown]);

  // Review Mode
  if (reviewDeck) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center min-h-[70vh] justify-center space-y-8">
        <div className="flex items-center justify-between w-full max-w-lg">
          <h2 className="text-lg font-semibold text-text-primary">{reviewDeck.title}</h2>
          <Button variant="ghost" size="sm" onClick={() => { setReviewDeck(null); setCurrentCard(0); setIsFlipped(false); }} icon={<HiOutlineXMark className="w-4 h-4" />}>Exit</Button>
        </div>

        <p className="text-sm text-text-secondary">{currentCard + 1} of {reviewDeck.cards.length}</p>
        <div className="w-full max-w-lg h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
          <div className="h-full gradient-bg rounded-full transition-all" style={{ width: `${((currentCard + 1) / reviewDeck.cards.length) * 100}%` }} />
        </div>

        <FlashcardItem card={reviewDeck.cards[currentCard]} isFlipped={isFlipped} onFlip={() => setIsFlipped((p) => !p)} />

        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => { setCurrentCard((p) => p - 1); setIsFlipped(false); }} disabled={currentCard === 0} icon={<HiOutlineArrowLeft className="w-4 h-4" />}>Previous</Button>
          <Button variant="primary" onClick={() => { setCurrentCard((p) => p + 1); setIsFlipped(false); }} disabled={currentCard === reviewDeck.cards.length - 1} icon={<HiOutlineArrowRight className="w-4 h-4" />}>Next</Button>
        </div>
        <p className="text-xs text-text-tertiary">Use arrow keys to navigate, spacebar to flip</p>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
          <HiOutlineRectangleStack className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Flashcards</h1>
          <p className="text-text-secondary text-sm">Generate and review AI-powered flashcards</p>
        </div>
      </div>

      {/* Generate */}
      <div className="glass-card p-5">
        <label className="block text-sm font-medium text-text-secondary mb-2">Generate from Note</label>
        <div className="flex flex-col sm:flex-row gap-3">
          <Select
            value={selectedNote}
            onChange={setSelectedNote}
            options={notes.map((n) => ({ value: n._id, label: n.title }))}
            placeholder="Choose a note..."
            className="flex-1"
          />
          <Button variant="primary" onClick={generateFlashcards} isLoading={generating} icon={<HiOutlineRectangleStack className="w-4 h-4" />}>Generate</Button>
        </div>
      </div>

      {/* Decks */}
      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-3">My Decks</h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => <div key={i} className="glass-card p-5 space-y-3"><div className="h-4 w-2/3 shimmer rounded" /><div className="h-3 w-1/3 shimmer rounded" /></div>)}
          </div>
        ) : decks.length === 0 ? (
          <EmptyState icon={<HiOutlineRectangleStack className="w-8 h-8" />} title="No flashcard decks" description="Generate flashcards from your notes to start studying" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {decks.map((deck) => (
              <div
                key={deck._id}
                onClick={() => {
                  setReviewDeck(deck);
                  setCurrentCard(0);
                  setIsFlipped(false);
                }}
                className="glass-card p-5 group cursor-pointer hover:border-accent-primary/30 hover:shadow-[0_0_20px_rgba(99,102,241,0.08)] transition-all duration-300 flex flex-col justify-between h-full"
              >
                <div>
                  <h3 className="font-medium text-text-primary group-hover:text-accent-primary transition-colors">{deck.title}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={stringToColor(deck.subject || "default")}>{deck.subject}</Badge>
                    <span className="text-xs text-text-tertiary">{deck.cards?.length || 0} cards</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-5 pt-3 border-t border-border-default/50">
                  <span className="text-xs text-text-tertiary">
                    {formatDate(deck.createdAt)}
                  </span>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeckToDelete(deck);
                      setShowDeleteModal(true);
                    }}
                    className="p-1.5 rounded-lg text-text-tertiary hover:text-accent-danger hover:bg-accent-danger/10 transition-colors"
                    title="Delete deck"
                  >
                    <HiOutlineTrash className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeckToDelete(null);
        }}
        title="Delete Flashcard Deck"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-text-secondary text-sm">
            Are you sure you want to delete <span className="text-text-primary font-medium">"{deckToDelete?.title}"</span>? This action cannot be undone.
          </p>
          <div className="flex flex-col gap-2 pt-2">
            <Button variant="danger" onClick={confirmDelete} className="w-full">
              Delete Deck
            </Button>
            <Button variant="secondary" onClick={() => {
              setShowDeleteModal(false);
              setDeckToDelete(null);
            }} className="w-full">
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
