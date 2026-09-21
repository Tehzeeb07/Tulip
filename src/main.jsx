import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import "./index.css";
import { ConvexReactClient } from "convex/react";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ThemeProvider } from "./context/ThemeContext.jsx";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ConvexAuthProvider client={convex}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </ConvexAuthProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);