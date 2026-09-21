import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { PRODUCTS } from "../data/products";
import RollingTextButton from "./RollingTextButton";
import "./FloralQuizModal.css";

const QUESTIONS = [
  {
    id: "mood",
    title: "What is the occasion or mood?",
    subtitle: "Every arrangement tells a different emotional story.",
    options: [
      { label: "Romantic & Lush", icon: "🌹", tag: "Wedding", key: "romantic" },
      { label: "Warm Celebration", icon: "🥂", tag: "Birthday", key: "celebration" },
      { label: "Quiet Solace & Comfort", icon: "🕊️", tag: "Sympathy", key: "solace" },
      { label: "Everyday Calm & Wild", icon: "🌿", tag: "Everyday", key: "everyday" },
    ],
  },
  {
    id: "space",
    title: "Where will it live?",
    subtitle: "We proportion stem height and silhouette to the space.",
    options: [
      { label: "Dining Table Centerpiece", icon: "🍽️", key: "dining" },
      { label: "Bedside Sanctuary", icon: "🕯️", key: "bedside" },
      { label: "Living Room Console", icon: "🛋️", key: "living" },
      { label: "Studio or Office Desk", icon: "🖋️", key: "desk" },
    ],
  },
  {
    id: "palette",
    title: "Which palette speaks to you?",
    subtitle: "The colors that will define the room.",
    options: [
      { label: "Cream, Blush & Pearl", icon: "🌸", key: "blush" },
      { label: "Amber, Terracotta & Gold", icon: "🍂", key: "amber" },
      { label: "Moody Plum & Midnight", icon: "🍷", key: "moody" },
      { label: "Pure Botanicals & Whites", icon: "🌱", key: "botanical" },
    ],
  },
];

function findMatch(answers) {
  const bouquets = PRODUCTS.filter((p) => p.type === "bouquet");

  // Palette priority matching
  if (answers.palette === "moody") {
    return bouquets.find((b) => b.id === "midnight-velvet") || bouquets[0];
  }
  if (answers.palette === "amber") {
    return bouquets.find((b) => b.id === "amber-field" || b.id === "golden-hour") || bouquets[1];
  }
  if (answers.palette === "blush") {
    return bouquets.find((b) => b.id === "marchesa" || b.id === "isabella") || bouquets[0];
  }
  if (answers.palette === "botanical") {
    return bouquets.find((b) => b.id === "white-sanctuary" || b.id === "quiet-grove") || bouquets[2];
  }

  // Fallback to occasion match
  const occasionMatch = bouquets.find((b) => b.occasion === answers.mood);
  return occasionMatch || bouquets[0];
}

export default function FloralQuizModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [matchedBouquet, setMatchedBouquet] = useState(null);

  if (!isOpen) return null;

  const handleSelectOption = (questionId, option) => {
    const updated = { ...answers, [questionId]: option.key };
    setAnswers(updated);

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Finished all 3 questions
      const match = findMatch(updated);
      setMatchedBouquet(match);
      setCurrentStep(QUESTIONS.length); // Result step
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setAnswers({});
    setMatchedBouquet(null);
  };

  const handleViewBouquet = () => {
    if (matchedBouquet) {
      onClose();
      navigate(`/product/${matchedBouquet.id}`);
    }
  };

  return (
    <div className="quiz-backdrop" onClick={onClose}>
      <div className="quiz-modal" onClick={(e) => e.stopPropagation()}>
        <button className="quiz-close" onClick={onClose} aria-label="Close Quiz">
          ✕
        </button>

        {currentStep < QUESTIONS.length ? (
          <div className="quiz-content">
            <div className="quiz-progress-bar">
              <div
                className="quiz-progress-fill"
                style={{ width: `${((currentStep + 1) / QUESTIONS.length) * 100}%` }}
              />
            </div>

            <div className="quiz-step-indicator">
              Question {currentStep + 1} of {QUESTIONS.length}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="quiz-question-wrap"
              >
                <h2 className="quiz-question-title">{QUESTIONS[currentStep].title}</h2>
                <p className="quiz-question-subtitle">{QUESTIONS[currentStep].subtitle}</p>

                <div className="quiz-options-grid">
                  {QUESTIONS[currentStep].options.map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      className="quiz-option-btn"
                      onClick={() => handleSelectOption(QUESTIONS[currentStep].id, opt)}
                    >
                      <span className="quiz-option-icon">{opt.icon}</span>
                      <span className="quiz-option-label">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        ) : (
          <div className="quiz-result-wrap">
            <div className="quiz-result-badge">Your Curated Match</div>
            <h2 className="quiz-result-title">{matchedBouquet?.name}</h2>
            <p className="quiz-result-desc">
              Composed to reflect your desired mood and palette. Featuring hand-selected seasonal stems.
            </p>

            {matchedBouquet && (
              <div className="quiz-result-card">
                <img
                  src={matchedBouquet.image}
                  alt={matchedBouquet.name}
                  className="quiz-result-img"
                />
                <div className="quiz-result-info">
                  <span className="quiz-result-occasion">{matchedBouquet.occasion}</span>
                  <span className="quiz-result-price">${matchedBouquet.price}</span>
                  <p className="quiz-result-flower-list">{matchedBouquet.desc}</p>
                </div>
              </div>
            )}

            <div className="quiz-result-actions">
              <button
                type="button"
                className="quiz-primary-btn"
                onClick={handleViewBouquet}
              >
                View Arrangement & Order
              </button>
              <button type="button" className="quiz-retake-btn" onClick={handleReset}>
                Retake Quiz
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
