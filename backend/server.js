require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const app = express();

/* ================= CONFIG ================= */

const PORT = process.env.PORT || 5000;

// allow frontend (Vercel) + local dev
const ALLOWED_ORIGINS = [
  "https://ytdownloader-stm.vercel.app",
  "http://localhost:3000",
];

// yt-dlp binary downloaded in postinstall
const YTDLP_PATH = path.join(process.cwd(), "yt-dlp");

/* ================= MIDDLEWARE ================= */

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        cb(null, true);
      } else {
        cb(new Error("CORS not allowed"));
      }
    },
  }),
);

app.use(express.json());

/* ================= HEALTH ================= */

app.get("/", (req, res) => {
  res.send("✅ YouTube Downloader backend running");
});

/* ================= DEBUG (TEMPORARY BUT SAFE) ================= */

app.get("/debug", (req, res) => {
  res.json({
    cwd: process.cwd(),
    ytDlpExists: fs.existsSync(YTDLP_PATH),
    files: fs.readdirSync(process.cwd()),
  });
});

/* ================= METADATA ================= */

app.get("/metadata", (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "Missing URL" });

  if (!fs.existsSync(YTDLP_PATH)) {
    return res.status(500).json({ error: "yt-dlp not found on server" });
  }

  const yt = spawn(YTDLP_PATH, [
    "-J",
    "--no-playlist",
    "--user-agent",
    "Mozilla/5.0",
    url,
  ]);

  let stdout = "";
  let stderr = "";

  yt.stdout.on("data", (d) => (stdout += d.toString()));
  yt.stderr.on("data", (d) => (stderr += d.toString()));

  yt.on("close", (code) => {
    if (code !== 0) {
      console.error("❌ yt-dlp stderr:", stderr);
      return res.status(500).json({
        error: "yt-dlp failed",
        details: stderr.slice(0, 500),
      });
    }

    try {
      const meta = JSON.parse(stdout);

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
      res.status(500).json({ error: "Failed to parse metadata" });
    }
  });

  yt.on("error", (err) => {
    console.error("❌ spawn error:", err);
    res.status(500).json({ error: "yt-dlp spawn failed" });
  });
});

/* ================= START ================= */

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
