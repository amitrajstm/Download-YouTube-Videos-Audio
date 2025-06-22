// src/components/DownloadHistory.jsx
import React from "react";
import { FaCheckCircle } from "react-icons/fa";

export default function DownloadHistory({ history }) {
  if (history.length === 0) return null;

  return (
    <div className="download-bar">
      {history.map((item, idx) => (
        <div key={idx} className="download-item">
          <FaCheckCircle className="download-icon" />
          <span className="download-text">{item.quality}</span>
          <a
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="download-link"
          >
            Open file
          </a>
        </div>
      ))}
    </div>
  );
}
