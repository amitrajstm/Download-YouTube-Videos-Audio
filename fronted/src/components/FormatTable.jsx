// src/components/FormatTable.jsx
import React from "react";
import { FaMusic } from "react-icons/fa";

const VIDEO_RESOLUTIONS = ["360p", "480p", "720p", "1080p"];

export default function FormatTable({ formats, onDownload }) {
  // find the first audio format with valid size
  const audioFormat = formats.find(
    (f) => f.type === "audio" && f.size !== "N/A"
  );

  // filter MP4 video formats that include audio and have size, at desired resolutions
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
    <div className="format-table">
      <h3>
        🎵 Audio  
        {audioFormat && <FaMusic className="audio-icon" />}
      </h3>
      {audioFormat ? (
        <div className="row">
          <span>{audioFormat.quality || audioFormat.ext}</span>
          <span>{audioFormat.size}</span>
          <button
            className="download-btn"
            onClick={() => onDownload(audioFormat)}
          >
            Download
          </button>
        </div>
      ) : (
        <p>No audio format available.</p>
      )}

      <h3>🎬 Video </h3>
      {mp4WithAudio.length > 0 ? (
        mp4WithAudio.map((f, i) => (
          <div key={i} className="row">
            <span>{f.quality}</span>
            <span>{f.size}</span>
            <button className="download-btn" onClick={() => onDownload(f)}>
              Download
            </button>
          </div>
        ))
      ) : (
        <p>No combined-audio MP4 at desired resolutions.</p>
      )}
    </div>
  );
}
