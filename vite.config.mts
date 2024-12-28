import { defineConfig, UserConfig } from "vite";
import html_literal from "rollup-plugin-minify-html-literals";

export default defineConfig({
  // @ts-ignore - ES module syntax here, but typescript will consider it as commonjs
  plugins: [html_literal.default()],
});
