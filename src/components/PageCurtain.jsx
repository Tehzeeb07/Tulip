import { motion, AnimatePresence } from "motion/react";
import { usePageTransition } from "../context/PageTransitionContext";
import "./PageCurtain.css";

export default function PageCurtain() {
  const { isActive, direction, title } = usePageTransition();

  const isFromRight = direction === "from-right";

  return (
    <AnimatePresence>
      {isActive && (
        <div className="curtain-container" aria-hidden="true">
          {/* Angled dark curtain panel with directional sweep */}
          <motion.div
            className="curtain-panel curtain-primary"
            initial={{
              x: isFromRight ? "130%" : "-130%",
              skewX: isFromRight ? 8 : -8,
            }}
            animate={{
              x: isFromRight
                ? ["130%", "0%", "0%", "-130%"]
                : ["-130%", "0%", "0%", "130%"],
              skewX: isFromRight
                ? [8, 0, 0, -8]
                : [-8, 0, 0, 8],
            }}
            transition={{
              duration: 0.7,
              times: [0, 0.42, 0.58, 1],
              ease: [0.76, 0, 0.24, 1],
            }}
          >
            {/* Centered Serif Destination Title */}
            <motion.div
              className="curtain-title-wrap"
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{
                opacity: [0, 1, 1, 0],
                y: [12, 0, 0, -12],
                scale: [0.96, 1, 1, 1.02],
              }}
              transition={{
                duration: 0.7,
                times: [0, 0.38, 0.62, 1],
                ease: "easeInOut",
              }}
            >
              <h2 className="curtain-title">{title}</h2>
              <span className="curtain-brand">T U L I P ®</span>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
