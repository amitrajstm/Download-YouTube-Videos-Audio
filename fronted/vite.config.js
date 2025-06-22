import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  const isLocal = env.VITE_API_URL?.includes("localhost");

  return {
    plugins: [react()],

    server: {
      port: 3000,
      ...(isLocal && {
        proxy: {
          "/metadata": env.VITE_API_URL,
          "/download-progress": env.VITE_API_URL,
        },
      }),
    },

    define: {
      "process.env": env,
    },

    build: {
      outDir: "dist",
    },

    base: "./", // For SPA routing compatibility
  };
});
