// src/pages/ResultPage.jsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import VideoDetails from "../components/VideoDetails";
import FormatTable from "../components/FormatTable";
import DownloadHistory from "../components/DownloadHistory";

export default function ResultPage() {
  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);
  const query = new URLSearchParams(useLocation().search);
  const url = query.get("url");

  useEffect(() => {
    setData(null); // reset when url changes
    fetch(`/metadata?url=${encodeURIComponent(url)}`)
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, [url]);

  const handleDownload = (format) => {
    window.open(format.url, "_blank");
    setHistory((h) => [...h, format]);
  };

  if (!data) {
    return (
      <div className="loader-wrapper">
        <FaSpinner className="spinner" />
      </div>
    );
  }

  return (
    <div className="result-page">
      <FormatTable formats={data.formats} onDownload={handleDownload} />
      <VideoDetails
        thumbnail={data.thumbnail}
        title={data.title}
        hashtags={data.hashtags}
        duration={data.duration}
      />
      <DownloadHistory history={history} />
    </div>
  );
}
