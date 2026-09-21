import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import "./PageCurtain.css";

const PAGE_TITLES = {
  "/": "Tulip",
  "/bouquets": "The Collection",
  "/home": "The Collection",
  "/accessories": "Accessories",
  "/occasions": "Occasions",
  "/custom-order": "Custom Order",
  "/reviews": "Reviews",
  "/blog": "Flower Care Journal",
  "/login": "Sign In",
  "/signup": "Join Tulip",
  "/profile": "My Account",
};

function getPageTitle(pathname) {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  if (pathname.startsWith("/product/")) return "Arrangement";
  if (pathname.startsWith("/occasions/")) return "Occasion";
  if (pathname.startsWith("/blog/")) return "Care Journal";
  return "Tulip";
}

export default function PageCurtain() {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayTitle, setDisplayTitle] = useState("");
  const isFirstRender = useRef(true);
  const prevPath = useRef(location.pathname);

  useEffect(() => {
    // Skip animation on initial page mount
    if (isFirstRender.current) {
      isFirstRender.current = false;
      prevPath.current = location.pathname;
      return;
    }

    // Only trigger if pathname actually changed
    if (location.pathname !== prevPath.current) {
      prevPath.current = location.pathname;
      setDisplayTitle(getPageTitle(location.pathname));
      setIsTransitioning(true);

      // Scroll to top of the page under the curtain
      window.scrollTo(0, 0);

      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 750);

      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      {isTransitioning && (
        <div className="curtain-container" aria-hidden="true">
          {/* Primary angled dark curtain panel */}
          <motion.div
            className="curtain-panel curtain-primary"
            initial={{ x: "-120%", skewX: -8 }}
            animate={{
              x: ["-120%", "0%", "0%", "120%"],
              skewX: [-8, -4, 4, 8],
            }}
            transition={{
              duration: 0.75,
              times: [0, 0.42, 0.58, 1],
              ease: [0.76, 0, 0.24, 1],
            }}
          >
            {/* Elegant Serif Page Title in Center */}
            <motion.div
              className="curtain-title-wrap"
              initial={{ opacity: 0, y: 15, scale: 0.96 }}
              animate={{
                opacity: [0, 1, 1, 0],
                y: [15, 0, 0, -15],
                scale: [0.96, 1, 1, 1.02],
              }}
              transition={{
                duration: 0.75,
                times: [0, 0.38, 0.62, 1],
                ease: "easeInOut",
              }}
            >
              <h2 className="curtain-title">{displayTitle}</h2>
              <span className="curtain-brand">T U L I P ®</span>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
