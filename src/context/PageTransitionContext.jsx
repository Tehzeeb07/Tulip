import { createContext, useContext, useState, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const PageTransitionContext = createContext(null);

export const NAV_ORDER = {
  "/": 0,
  "/bouquets": 1,
  "/home": 1,
  "/accessories": 2,
  "/occasions": 3,
  "/custom-order": 4,
  "/reviews": 5,
  "/blog": 6,
};

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

export function getPageTitle(pathname) {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  if (pathname.startsWith("/product/")) return "Arrangement";
  if (pathname.startsWith("/occasions/")) return "Occasion";
  if (pathname.startsWith("/blog/")) return "Care Journal";
  return "Tulip";
}

export function PageTransitionProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [transitionState, setTransitionState] = useState({
    isActive: false,
    direction: "from-right", // "from-right" | "from-left"
    title: "",
  });

  const isTransitioningRef = useRef(false);

  const navigateWithTransition = useCallback(
    (to, e) => {
      // Allow user to open in new tab with Cmd/Ctrl click
      if (e && (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1)) {
        return;
      }
      if (e) {
        e.preventDefault();
      }

      if (isTransitioningRef.current) return;

      const currentPath = location.pathname;

      // Rule 1: Don't do transition if navigating to the home/landing page ("/")
      // Rule 2: Don't do transition if clicking "Explore the Collection" on landing page ("/" -> "/bouquets")
      const isNavigatingToHome = to === "/";
      const isExploreFromHome = currentPath === "/" && (to === "/bouquets" || to === "/home");

      if (isNavigatingToHome || isExploreFromHome) {
        navigate(to);
        window.scrollTo(0, 0);
        return;
      }

      // If already on the target path, do nothing
      if (currentPath === to) return;

      // Determine direction:
      // If going to a page on the right (higher index), transition comes from the right
      // If going to a page on the left (lower index), transition comes from the left
      const fromIndex = NAV_ORDER[currentPath] ?? 1;
      const toIndex = NAV_ORDER[to] ?? 1;
      const direction = toIndex >= fromIndex ? "from-right" : "from-left";

      const title = getPageTitle(to);

      isTransitioningRef.current = true;
      setTransitionState({
        isActive: true,
        direction,
        title,
      });

      // At midpoint (~320ms), curtain fully covers the screen: navigate & reset scroll
      setTimeout(() => {
        navigate(to);
        window.scrollTo(0, 0);
      }, 330);

      // At end of transition (~700ms), remove curtain
      setTimeout(() => {
        setTransitionState((prev) => ({ ...prev, isActive: false }));
        isTransitioningRef.current = false;
      }, 700);
    },
    [location.pathname, navigate]
  );

  return (
    <PageTransitionContext.Provider
      value={{
        ...transitionState,
        navigateWithTransition,
      }}
    >
      {children}
    </PageTransitionContext.Provider>
  );
}

export function usePageTransition() {
  const context = useContext(PageTransitionContext);
  if (!context) {
    throw new Error("usePageTransition must be used within a PageTransitionProvider");
  }
  return context;
}
