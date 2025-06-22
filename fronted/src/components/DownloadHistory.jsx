// src/components/DownloadHistory.jsx
import React from "react";
import { FaCheckCircle } from "react-icons/fa";

export default function DownloadHistory({ history }) {
  if (!history || history.length === 0) return null;

  return (
    <div className="download-bar p-4 bg-gray-100 rounded-xl mt-4">
      {history.map((item, idx) => (
        <div
          key={idx}
          className="download-item flex items-center justify-between gap-4 p-2 border-b border-gray-300"
        >
          <div className="flex items-center gap-2">
            <FaCheckCircle className="text-green-500" />
            <span className="text-sm font-medium text-gray-700">
              {item.quality} ({item.size})
            </span>
          </div>
          <a
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 hover:underline text-sm"
          >
            Open file
          </a>
        </div>
      ))}
    </div>
  );
}
