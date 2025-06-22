# 📺 YDown - YouTube Video Downloader

**YDown** is a modern, responsive, and lightweight web application that lets users **download YouTube videos and audios** in MP4 and MP3 formats. Built with **React.js** for the frontend and **Express.js** with `yt-dlp` on the backend.

---

## 🔥 Features

- 🎞️ Download YouTube videos in high-quality (360p, 480p, 720p, 1080p)
- 🎧 Convert & download audio in MP3 format
- ✅ Filters out formats without audio or size
- 📥 Paste button + Auto-detect clipboard on focus
- ❌ Clear input button
- ⏳ Real-time download progress via SSE
- 📋 Displays download history
- 🔍 Beautiful UI with oval-shaped search, paste, clear, and search buttons
- 📱 Fully mobile responsive
- 🌐 Includes favicon and logo branding

---

## 📸 Screenshots

### ✅ Main Interface

![Main UI](https://raw.githubusercontent.com/amitrajstm/Download-YouTube-Videos-Audio/main/fronted/public/homepage.png)

### ⏳ Loader Bar Preview

![Loader](https://raw.githubusercontent.com/amitrajstm/Download-YouTube-Videos-Audio/main/fronted/public/loderBar.png)

### 🎥 Video Format Selection

![Formats](https://raw.githubusercontent.com/amitrajstm/Download-YouTube-Videos-Audio/refs/heads/main/fronted/public/VideoFormate%20.png)

---

## ⚙️ Getting Started

### 📦 Prerequisites

Make sure you have the following installed:

- **Node.js** and **npm**
- **yt-dlp** (installed globally): [yt-dlp GitHub](https://github.com/yt-dlp/yt-dlp)
- **FFmpeg** (installed and added to your system PATH): [ffmpeg.org](https://ffmpeg.org/download.html)

---

## 🛠️ Backend Setup (Express + yt-dlp)

```bash
# Navigate to the backend folder
cd backend

# Install required packages
npm install

# Run the backend server
node server.js


# YouTube Video Downloader

## Backend
1. `cd backend`
2. `npm install express cors yt-dlp`
3. `node server.js`

## Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`
4. Open `http://localhost:3000`
