// // server.js
// const express = require("express");
// const cors = require("cors");
// const { spawn } = require("child_process");

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Progress Download Route
// app.get("/download-progress", (req, res) => {
//   const { url } = req.query;
//   if (!url) return res.status(400).end("Missing URL");

//   res.setHeader("Content-Type", "text/event-stream");
//   res.setHeader("Cache-Control", "no-cache");
//   res.setHeader("Connection", "keep-alive");
//   res.flushHeaders();

//   const ytProcess = spawn("yt-dlp", [
//     "-f", "bestvideo+bestaudio",
//     "--merge-output-format", "mp4",
//     "--restrict-filenames",
//     "-o", "%(title)s.%(ext)s",
//     url,
//   ]);

//   ytProcess.stdout.on("data", (data) => {
//     const output = data.toString();
//     const match = output.match(/(\d{1,3}\.\d+)%/);
//     if (match) {
//       const progress = parseFloat(match[1]);
//       res.write(`data: ${JSON.stringify({ progress })}\n\n`);
//     }
//     if (output.includes("100%")) {
//       res.write(`data: ${JSON.stringify({ complete: true })}\n\n`);
//     }
//   });

//   ytProcess.stderr.on("data", (data) => {
//     console.error("yt-dlp stderr:", data.toString());
//   });

//   ytProcess.on("close", (code) => {
//     console.log(`Download exited with code ${code}`);
//     res.end();
//   });

//   ytProcess.on("error", (err) => {
//     console.error("yt-dlp error:", err);
//     res.write(`data: ${JSON.stringify({ error: true })}\n\n`);
//     res.end();
//   });
// });

// // Metadata Route
// app.get("/metadata", (req, res) => {
//   const { url } = req.query;
//   if (!url) return res.status(400).send("Missing URL");

//   const ytProcess = spawn("yt-dlp", ["-J", url]);
//   let jsonData = "";

//   ytProcess.stdout.on("data", (data) => {
//     jsonData += data.toString();
//   });

//   ytProcess.on("close", () => {
//     try {
//       const meta = JSON.parse(jsonData);
//       const formats = meta.formats.map((f) => ({
//         quality: f.format_note || (f.height ? `${f.height}p` : f.format_id),
//         size: f.filesize
//           ? `${(f.filesize / 1024 / 1024).toFixed(2)}M`
//           : "N/A",
//         url: f.url,
//         type: f.vcodec === "none" ? "audio" : "video",
//         ext: f.ext,            // <-- extension field added here
//       }));

//       res.json({
//         title: meta.title,
//         thumbnail: meta.thumbnail,
//         duration: new Date(meta.duration * 1000)
//           .toISOString()
//           .substr(11, 8),
//         hashtags: meta.tags ? "#" + meta.tags.join(" #") : "",
//         formats,
//       });
//     } catch (err) {
//       console.error("Error parsing metadata JSON:", err);
//       res.status(500).send("Error parsing metadata");
//     }
//   });
// });

// const PORT = 5000;
// app.listen(PORT, () =>
//   console.log(`Server running on http://localhost:${PORT}`)
// );
// server.js

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");

const app = express();

const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("✅ YouTube Downloader backend is running.");
});

// Download progress (SSE)
app.get("/download-progress", (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).end("Missing URL");

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const ytProcess = spawn("./yt-dlp", [
    "-f", "bestvideo+bestaudio",
    "--merge-output-format", "mp4",
    "--restrict-filenames",
    "-o", "%(title)s.%(ext)s",
    url,
  ]);

  ytProcess.stdout.on("data", (data) => {
    const output = data.toString();
    const match = output.match(/(\d{1,3}\.\d+)%/);
    if (match) {
      const progress = parseFloat(match[1]);
      res.write(`data: ${JSON.stringify({ progress })}\n\n`);
    }
    if (output.includes("100%")) {
      res.write(`data: ${JSON.stringify({ complete: true })}\n\n`);
    }
  });

  ytProcess.stderr.on("data", (data) => {
    console.error("yt-dlp stderr:", data.toString());
  });

  ytProcess.on("close", (code) => {
    console.log(`Download process exited with code ${code}`);
    res.end();
  });

  ytProcess.on("error", (err) => {
    console.error("yt-dlp error:", err);
    res.write(`data: ${JSON.stringify({ error: true })}\n\n`);
    res.end();
  });
});

// Metadata route
app.get("/metadata", (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send("Missing URL");

  const ytProcess = spawn("./yt-dlp", ["-J", url]);
  let jsonData = "";

  ytProcess.stdout.on("data", (data) => {
    jsonData += data.toString();
  });

  ytProcess.on("close", () => {
    try {
      const meta = JSON.parse(jsonData);

      const formats = meta.formats
        .filter((f) => f.filesize)
        .map((f) => ({
          quality: f.format_note || (f.height ? `${f.height}p` : f.format_id),
          size: `${(f.filesize / 1024 / 1024).toFixed(2)}M`,
          url: f.url,
          type: f.vcodec === "none" ? "audio" : "video",
          ext: f.ext,
        }));

      res.json({
        title: meta.title,
        thumbnail: meta.thumbnail,
        duration: new Date(meta.duration * 1000).toISOString().substr(11, 8),
        hashtags: meta.tags ? "#" + meta.tags.join(" #") : "",
        formats,
      });
    } catch (err) {
      console.error("Error parsing metadata JSON:", err);
      res.status(500).send("Error parsing metadata");
    }
  });

  ytProcess.on("error", (err) => {
    console.error("yt-dlp error:", err);
    res.status(500).send("yt-dlp execution failed");
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
