require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");

const app = express();

/* ================= CONFIG ================= */

const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";

// Windows-safe paths
const YTDLP_PATH = process.env.YTDLP_PATH || "yt-dlp.exe";
const FFMPEG_PATH =
  process.env.FFMPEG_PATH ||
  "C:\\Program Files\\ffmpeg-8.0.1-full_build\\bin\\ffmpeg.exe";

/* ================= MIDDLEWARE ================= */

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

/* ================= HEALTH CHECK ================= */

app.get("/", (req, res) => {
  res.send("✅ YouTube Downloader backend is running.");
});

/* ================= DOWNLOAD PROGRESS (SSE) ================= */

app.get("/download-progress", (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).end("Missing URL");

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const ytProcess = spawn(YTDLP_PATH, [
    "-f",
    "bv*+ba/b", // best video + best audio
    "--merge-output-format",
    "mp4",
    "--ffmpeg-location",
    FFMPEG_PATH,
    "--newline",
    "--restrict-filenames",
    "-o",
    "%(title)s.%(ext)s",
    url,
  ]);

  // 🔥 yt-dlp sends progress to STDERR
  ytProcess.stderr.on("data", (data) => {
    const output = data.toString();

    const match = output.match(/(\d{1,3}\.\d+)%/);
    if (match) {
      res.write(
        `data: ${JSON.stringify({ progress: parseFloat(match[1]) })}\n\n`,
      );
    }

    if (output.includes("100%")) {
      res.write(`data: ${JSON.stringify({ complete: true })}\n\n`);
    }
  });

  ytProcess.on("close", () => res.end());

  ytProcess.on("error", (err) => {
    console.error("yt-dlp error:", err);
    res.write(`data: ${JSON.stringify({ error: true })}\n\n`);
    res.end();
  });
});

/* ================= METADATA ROUTE ================= */

app.get("/metadata", (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send("Missing URL");

  const ytProcess = spawn(YTDLP_PATH, ["-J", url]);
  let jsonData = "";

  ytProcess.stdout.on("data", (data) => {
    jsonData += data.toString();
  });

  ytProcess.on("close", () => {
    try {
      const meta = JSON.parse(jsonData);

      const formats = meta.formats
        .filter(
          (f) => f.filesize && (f.vcodec === "none" || f.acodec !== "none"), // ❌ remove video-only
        )
        .map((f) => ({
          quality: f.format_note || (f.height ? `${f.height}p` : f.format_id),
          size: `${(f.filesize / 1024 / 1024).toFixed(2)} MB`,
          url: f.url,
          type: f.vcodec === "none" ? "audio" : "video",
          ext: f.ext,
          acodec: f.acodec,
        }));

      res.json({
        title: meta.title,
        thumbnail: meta.thumbnail,
        duration: new Date(meta.duration * 1000)
          .toISOString()
          .substring(11, 19),
        hashtags: meta.tags ? "#" + meta.tags.join(" #") : "",
        formats,
      });
    } catch (err) {
      console.error("Metadata parse error:", err);
      res.status(500).send("Error parsing metadata");
    }
  });

  ytProcess.on("error", (err) => {
    console.error("yt-dlp execution failed:", err);
    res.status(500).send("yt-dlp execution failed");
  });
});

/* ================= START SERVER ================= */

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
