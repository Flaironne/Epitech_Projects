import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Vous pouvez maintenant utiliser `mode` pour vérifier l'environnement
  console.log(`Mode actuel : ${mode}`);

  return {
    define: {
      __APP_ENV__: JSON.stringify(mode)
    },
    plugins: [
      vue(),
      VitePWA({
        registerType: "autoUpdate", // Show prompt to install
        workbox: {
          globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        },
        includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
        manifest: {
          name: "timemanager",
          short_name: "timemanager",
          description: "A time management app",
          theme_color: "#ffffff",
          start_url: "/",
          icons: [
            {
              src: "pwa-192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
            },
            {
              src: "pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any maskable",
            },
          ],
        },
      }),
    ],
    css: {
      preprocessorOptions: {
        scss: {},
      },
    },
    server: {
      proxy: {
        "/api": {
          target: "http://timemanager:4000/api",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  };
});