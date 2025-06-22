import SearchBar from "../components/SearchBar";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const handleSearch = (url) => {
    navigate(`/result?url=${encodeURIComponent(url)}`);
  };

  return (
    <div className="container">
      <h1>YouTube Video Downloader</h1>
      <p className="subtext">
        Download YouTube videos to mp3 and mp4 online for free
      </p>
      <SearchBar onSearch={handleSearch} />
      <p className="copyright">
        Copyrighted content is not available for download with this tool.
      </p>
    </div>
  );
};

export default HomePage;
