import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// https://vitejs.dev/config/
export default defineConfig({
  base: "./", // 这里更改打包相对绝对路径
  minify: true, // 是否压缩代码
  plugins: [react()],
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          chrome: "49",
          ios: "10",
        },
      },
    ],
  ],

  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
      },
    },
    host: "0.0.0.0",
  },
});
