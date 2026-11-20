import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://agressiva86.github.io",
  base: "/get3d_redesign/",
  output: "static",
  build: {
    format: "file",
  },
  vite: {
    plugins: [tailwindcss()],
  },
});