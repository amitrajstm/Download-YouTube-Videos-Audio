require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");
const path = require("path");

const app = express();

/* ================= CONFIG ================= */

const PORT = process.env.PORT || 5000;

// allow Vercel frontend + local dev
const CORS_ORIGIN = process.env.CORS_ORIGIN || [
  "https://ytdownloader-stm.vercel.app",
  "http://localhost:3000",
];

// yt-dlp binary downloaded in postinstall
const YTDLP_PATH = path.join(process.cwd(), "yt-dlp");

/* ================= MIDDLEWARE ================= */

app.use(
  cors({
    origin: CORS_ORIGIN,
    methods: ["GET", "POST"],
  }),
);

app.use(express.json());

/* ================= HEALTH CHECK ================= */

app.get("/", (req, res) => {
  res.send("✅ YouTube Downloader backend is running.");
});

/* ================= METADATA ROUTE ================= */

app.get("/metadata", (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "Missing URL" });
  }

  const ytProcess = spawn(YTDLP_PATH, ["-J", url]);

  let stdoutData = "";
  let stderrData = "";

  ytProcess.stdout.on("data", (data) => {
    stdoutData += data.toString();
  });

  ytProcess.stderr.on("data", (data) => {
    stderrData += data.toString();
  });

  ytProcess.on("close", (code) => {
    if (code !== 0) {
      console.error("❌ yt-dlp failed:", stderrData);
      return res.status(500).json({ error: "yt-dlp failed" });
    }

    try {
      const meta = JSON.parse(stdoutData);

      const formats = meta.formats
        .filter(
          (f) =>
            f.filesize &&
            (f.vcodec === "none" || f.acodec !== "none"),
        )
        .map((f) => ({
          quality:
            f.format_note ||
            (f.height ? `${f.height}p` : f.format_id),
          size: `${(f.filesize / 1024 / 1024).toFixed(2)} MB`,
          type: f.vcodec === "none" ? "audio" : "video",
          ext: f.ext,
        }));

      res.json({
        title: meta.title,
        thumbnail: meta.thumbnail,
        duration: meta.duration
          ? new Date(meta.duration * 1000)
              .toISOString()
              .substring(11, 19)
          : null,
        hashtags: meta.tags ? "#" + meta.tags.join(" #") : "",
        formats,
      });
    } catch (err) {
      console.error("❌ JSON parse error:", err);
      res.status(500).json({ error: "Metadata parse error" });
    }
  });

  ytProcess.on("error", (err) => {
    console.error("❌ yt-dlp spawn error:", err);
    res.status(500).json({ error: "yt-dlp execution failed" });
  });
});

/* ================= START SERVER ================= */

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
