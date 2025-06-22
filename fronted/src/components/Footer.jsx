// src/components/Footer.jsx
import React from "react";
import {
  FaLinkedin,
  FaGithub,
  FaInstagram,
  FaFacebook,
  FaGlobe,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer">
      <p>© 2025 Y. All rights reserved.</p>
      <div className="social-icons">
        <a
          href="https://www.linkedin.com/in/amitkumarraj1/"
          target="_blank"
          rel="noreferrer"
        >
          <FaLinkedin />
        </a>
        <a
          href="https://github.com/amitrajstm"
          target="_blank"
          rel="noreferrer"
        >
          <FaGithub />
        </a>
        <a
          href="https://www.instagram.com/amitraj_stm"
          target="_blank"
          rel="noreferrer"
        >
          <FaInstagram />
        </a>
        <a
          href="https://www.facebook.com/englishconversationinsitamarhi/"
          target="_blank"
          rel="noreferrer"
        >
          <FaFacebook />
        </a>
        <a
          href="https://amitkumarraj.vercel.app/"
          target="_blank"
          rel="noreferrer"
        >
          <FaGlobe />
        </a>
      </div>
    </footer>
  );
}
