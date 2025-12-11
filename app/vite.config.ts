import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/easypantry/",
  build: {
    outDir: "../docs",
    emptyOutDir: true,
  },
  publicDir: "../public",
});
