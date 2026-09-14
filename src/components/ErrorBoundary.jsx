// src/App.jsx (or wherever you render routes)
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import Profile from "./pages/Profile"; // adjust path as needed

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/profile"
          element={
            <ErrorBoundary>
              <Profile />
            </ErrorBoundary>
          }
        />
        {/* other routes */}
      </Routes>
    </BrowserRouter>
  );
}