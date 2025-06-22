// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import ResultPage from "./pages/ResultPage";

export default function App() {
  return (
    <>
      <Navbar />
      <main className="content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/result" element={<ResultPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
