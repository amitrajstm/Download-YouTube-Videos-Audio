require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const os = require("os");

const app = express();

/* ================= CONFIG ================= */

const PORT = process.env.PORT || 8080;

const ALLOWED_ORIGINS = [
  "https://ytdownloader-stm.vercel.app",
  "http://localhost:3000",
];

const YTDLP_PATH = path.join(process.cwd(), "yt-dlp");
const COOKIES_PATH = path.join(os.tmpdir(), "yt-cookies.txt");

/* ================= COOKIES SETUP ================= */

if (process.env.YT_COOKIES) {
  fs.writeFileSync(COOKIES_PATH, process.env.YT_COOKIES);
  console.log("✅ YouTube cookies loaded");
} else {
  console.warn("⚠️ No YT_COOKIES provided");
}

/* ================= MIDDLEWARE ================= */

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        cb(null, true);
      } else {
        cb(new Error("CORS blocked"));
      }
    },
  }),
);

app.use(express.json());

/* ================= HEALTH ================= */

app.get("/", (req, res) => {
  res.send("✅ YouTube Downloader backend running");
});

/* ================= METADATA ================= */

app.get("/metadata", (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "Missing URL" });

  if (!fs.existsSync(YTDLP_PATH)) {
    return res.status(500).json({ error: "yt-dlp not found" });
  }

  const args = [
    "-J",
    "--no-playlist",
    "--js-runtimes",
    "node",
    "--user-agent",
    "Mozilla/5.0",
  ];

  if (fs.existsSync(COOKIES_PATH)) {
    args.push("--cookies", COOKIES_PATH);
  }

  args.push(url);

  const yt = spawn(YTDLP_PATH, args);

  let stdout = "";
  let stderr = "";

  yt.stdout.on("data", (d) => (stdout += d.toString()));
  yt.stderr.on("data", (d) => (stderr += d.toString()));

  yt.on("close", (code) => {
    if (code !== 0) {
      console.error("❌ yt-dlp error:", stderr);
      return res.status(500).json({
        error: "yt-dlp failed",
        details: stderr.slice(0, 600),
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
        formats,
      });
    } catch (err) {
      console.error("❌ JSON parse error:", err);
      res.status(500).json({ error: "Metadata parse failed" });
    }
  });

  yt.on("error", (err) => {
    console.error("❌ Spawn failed:", err);
    res.status(500).json({ error: "yt-dlp spawn failed" });
  });
});

/* ================= START ================= */

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

