// cypress.config.ts

import { defineConfig } from "cypress";
import { config as dotenvConfig } from "dotenv";

dotenvConfig();

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:8081",
    env: {
      EXPO_PUBLIC_BASE_URL: process.env.EXPO_PUBLIC_BASE_URL,
      EXPO_PUBLIC_API_KEY: process.env.EXPO_PUBLIC_API_KEY,
      EXPO_PUBLIC_API_TOKEN: process.env.EXPO_PUBLIC_API_TOKEN,
    },
  },
});
