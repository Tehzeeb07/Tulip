import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { usePageTransition } from "../context/PageTransitionContext";
import "./RollingTextButton.css";

const LETTER_TRANSITION = {
  duration: 0.35,
  ease: [0.33, 1, 0.68, 1],
};

function StaggeredText({ text, staggerDelay = 0.02 }) {
  const characters = text.split("");

  return (
    <span className="rolling-text-container" aria-hidden="true">
      {/* Top line of characters that rolls up and out */}
      <span className="rolling-text-line">
        {characters.map((char, i) => (
          <motion.span
            key={i}
            variants={{
              initial: { y: 0 },
              hovered: { y: "-100%" },
            }}
            transition={{
              ...LETTER_TRANSITION,
              delay: i * staggerDelay,
            }}
            className="rolling-char"
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </span>

      {/* Bottom line of characters that rolls up into view */}
      <span className="rolling-text-line rolling-text-duplicate">
        {characters.map((char, i) => (
          <motion.span
            key={i}
            variants={{
              initial: { y: "100%" },
              hovered: { y: 0 },
            }}
            transition={{
              ...LETTER_TRANSITION,
              delay: i * staggerDelay,
            }}
            className="rolling-char"
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </span>
    </span>
  );
}

export default function RollingTextButton({
  children,
  to,
  className = "",
  staggerDelay = 0.02,
  onClick,
  ...props
}) {
  const textContent = typeof children === "string" ? children : "";
  const pageTransition = usePageTransition();

  // If used with `to`, render a motion-enhanced Link
  if (to) {
    const MotionLink = motion.create(Link);

    const handleClick = (e) => {
      if (onClick) onClick(e);
      if (pageTransition?.navigateWithTransition) {
        pageTransition.navigateWithTransition(to, e);
      }
    };

    return (
      <MotionLink
        to={to}
        onClick={handleClick}
        initial="initial"
        whileHover="hovered"
        whileTap={{ scale: 0.98 }}
        className={`rolling-button ${className}`}
        aria-label={textContent || undefined}
        {...props}
      >
        <span className="sr-only">{children}</span>
        <StaggeredText text={textContent} staggerDelay={staggerDelay} />
      </MotionLink>
    );
  }

  // Otherwise render a motion button
  return (
    <motion.button
      type="button"
      initial="initial"
      whileHover="hovered"
      whileTap={{ scale: 0.98 }}
      className={`rolling-button ${className}`}
      aria-label={textContent || undefined}
      {...props}
    >
      <span className="sr-only">{children}</span>
      <StaggeredText text={textContent} staggerDelay={staggerDelay} />
    </motion.button>
  );
}
