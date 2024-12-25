import { defineConfig, UserConfig } from "vite";
import html_literal from "rollup-plugin-minify-html-literals";

export default defineConfig({
  plugins: [html_literal()],
});
