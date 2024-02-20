// https://nuxt.com/docs/api/configuration/nuxt-config
import type { NuxtConfig } from "nuxt/config";

const runtimeConfig: NuxtConfig["runtimeConfig"] = {
  OPENAI_API: {
    key: process.env.OPENAI_API_KEY,
    organization: process.env.OPENAI_ORG_KEY,
  },
  GEMINI_API: {
    key: process.env.GEMINI_API,
  },
};

export default defineNuxtConfig({
  runtimeConfig,
  devtools: { enabled: true },
  imports: {
    dirs: ["./store/**", "./composables/**"],
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  modules: ["nuxt-primevue"],
});
