// // src/components/SearchBar.jsx
// import { useState } from "react";
// import { FaSearch, FaTimes, FaPaste } from "react-icons/fa";

// export default function SearchBar({ onSearch }) {
//   const [url, setUrl] = useState("");

//   const handlePaste = async () => {
//     try {
//       const text = await navigator.clipboard.readText();
//       setUrl(text);
//     } catch {
//       alert("Failed to read clipboard content");
//     }
//   };

//   const handleClear = () => setUrl("");

//   return (
//     <div className="search-bar">
//       <input
//         type="text"
//         placeholder="Search keywords or paste video link here"
//         value={url}
//         onChange={(e) => setUrl(e.target.value)}
//       />
//       {url && (
//         <button className="clear-btn" onClick={handleClear}>
//           <FaTimes />
//         </button>
//       )}
//       <button className="paste-btn" onClick={handlePaste}>
//         <FaPaste />
//       </button>
//       <button className="search-btn" onClick={() => onSearch(url)}>
//         Search
//       </button>
//     </div>
//   );
// }
// src/components/SearchBar.jsx
import { useState } from "react";
import { FaSearch, FaTimes, FaPaste } from "react-icons/fa";

export default function SearchBar({ onSearch }) {
  const [url, setUrl] = useState("");

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setUrl(text);
    } catch (err) {
      alert("Failed to read clipboard content");
    }
  };

  const handleClear = () => setUrl("");

  const handleFocus = async () => {
    if (!url) {
      try {
        const text = await navigator.clipboard.readText();
        if (text) setUrl(text);
      } catch {
        console.warn("Clipboard access denied");
      }
    }
  };

  const handleSearch = () => {
    if (!url.trim()) {
      alert("Please enter a valid video URL or search term.");
      return;
    }
    onSearch(url.trim());
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search keywords or paste video link here"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onFocus={handleFocus}
      />
      {url ? (
        <button className="clear-btn" onClick={handleClear}>
          <FaTimes />
        </button>
      ) : (
        <button className="paste-btn" onClick={handlePaste}>
          <FaPaste />
        </button>
      )}
      <button className="search-btn" onClick={handleSearch}>
        <FaSearch /> Search
      </button>
    </div>
  );
}
