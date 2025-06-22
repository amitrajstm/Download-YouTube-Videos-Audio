import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/download-progress": "http://localhost:5000",
      "/metadata": "http://localhost:5000"
    }
  },
  // SPA fallback so React Router pages reload:
  build: { outDir: "dist" },
  base: "./"
});
