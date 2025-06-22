// src/components/FormatTable.jsx
import React from "react";
import { FaMusic } from "react-icons/fa";

const VIDEO_RESOLUTIONS = ["360p", "480p", "720p", "1080p"];

export default function FormatTable({ formats, onDownload }) {
  const audioFormat = formats.find(
    (f) => f.type === "audio" && f.size !== "N/A"
  );

  const mp4WithAudio = formats
    .filter(
      (f) =>
        f.type === "video" &&
        f.ext === "mp4" &&
        f.acodec !== "none" &&
        f.size !== "N/A" &&
        VIDEO_RESOLUTIONS.includes(f.quality)
    )
    .sort(
      (a, b) =>
        VIDEO_RESOLUTIONS.indexOf(a.quality) -
        VIDEO_RESOLUTIONS.indexOf(b.quality)
    );

  return (
    <div className="format-table space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          🎵 Audio {audioFormat && <FaMusic className="text-blue-500" />}
        </h3>
        {audioFormat ? (
          <div className="row flex justify-between items-center bg-gray-100 p-2 rounded-lg">
            <span>{audioFormat.quality || audioFormat.ext}</span>
            <span>{audioFormat.size}</span>
            <button
              className="download-btn bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              onClick={() => onDownload(audioFormat)}
            >
              Download
            </button>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No audio format available.</p>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">🎬 Video</h3>
        {mp4WithAudio.length > 0 ? (
          mp4WithAudio.map((f, i) => (
            <div
              key={i}
              className="row flex justify-between items-center bg-gray-100 p-2 rounded-lg mb-2"
            >
              <span>{f.quality}</span>
              <span>{f.size}</span>
              <button
                className="download-btn bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                onClick={() => onDownload(f)}
              >
                Download
              </button>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">
            No combined-audio MP4 at desired resolutions.
          </p>
        )}
      </div>
    </div>
  );
}
