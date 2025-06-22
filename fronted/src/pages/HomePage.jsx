// src/pages/HomePage.jsx
import SearchBar from "../components/SearchBar";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const handleSearch = (url) => {
    if (!url.trim()) {
      alert("Please enter a valid YouTube video URL or search keyword.");
      return;
    }
    navigate(`/result?url=${encodeURIComponent(url)}`);
  };

  return (
    <div className="container max-w-xl mx-auto text-center px-4 py-10">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">
        YouTube Video Downloader
      </h1>
      <p className="subtext text-gray-600 mb-6">
        Download YouTube videos in MP3 or MP4 formats — fast & free.
      </p>

      <SearchBar onSearch={handleSearch} />

      <p className="text-xs text-gray-400 mt-6">
        ⚠️ Copyrighted content is not available for download.
      </p>
    </div>
  );
};

export default HomePage;
