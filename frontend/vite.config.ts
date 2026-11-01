import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const envDir = `${import.meta.dirname}/../`;
  const env = loadEnv(mode, envDir, "");

  const backendPort = env.PORT || "3000";

  return {
    plugins: [react()],
    server: {
      host: "0.0.0.0",
      port: 5173,
      watch: {
        usePolling: true,
        interval: 100,
      },
      proxy: {
        "/collections": {
          target: `http://backend:${backendPort}`,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});