import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import VideoDetails from "../components/VideoDetails";
import FormatTable from "../components/FormatTable";

// ✅ Use environment variable for backend base URL
const API_BASE = import.meta.env.VITE_API_URL || "";

export default function ResultPage() {
  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);

  const query = new URLSearchParams(useLocation().search);
  const url = query.get("url");

  useEffect(() => {
    if (!url) return;

    setData(null); // Reset previous result
    fetch(`${API_BASE}/metadata?url=${encodeURIComponent(url)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Metadata fetch failed");
        return res.json();
      })
      .then(setData)
      .catch((err) => {
        console.error("Error loading metadata:", err);
        setData(null);
      });
  }, [url]);

  const handleDownload = (format) => {
    window.open(format.url, "_blank");
    setHistory((prev) => [...prev, format]);
  };

  if (!data) {
    return (
      <div className="loader-wrapper flex justify-center items-center h-40">
        <FaSpinner className="spinner animate-spin text-3xl text-blue-500" />
      </div>
    );
  }

  return (
    <div className="result-page space-y-6 p-4 max-w-2xl mx-auto">
      <FormatTable formats={data.formats} onDownload={handleDownload} />
      <VideoDetails
        thumbnail={data.thumbnail}
        title={data.title}
        hashtags={data.hashtags}
        duration={data.duration}
      />
    </div>
  );
}
