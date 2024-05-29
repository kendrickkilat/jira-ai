// https://nuxt.com/docs/api/configuration/nuxt-config
import type { NuxtConfig } from "nuxt/config";

const runtimeConfig: NuxtConfig["runtimeConfig"] = {
  public: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    OPENAI_ORG_KEY: process.env.OPENAI_ORG_KEY,
    GEMINI_API_KEY: process.env.GOOGLE_GEMINI_KEY,
  },
};

export default defineNuxtConfig({
  runtimeConfig,
  srcDir: "./src",
  devtools: { enabled: true },
  css: [
    "primevue/resources/themes/lara-dark-green/theme.css",
    "primeicons/primeicons.css",
  ],
  imports: {
    dirs: ["./store/**", "./composables/**"],
  },
  modules: ["@pinia/nuxt", "@nuxtjs/tailwindcss", "nuxt-primevue"],
  primevue: {
    cssLayerOrder: "tailwind-base, primevue, tailwind-utilities",
  },
  router: {
    options: {
      scrollBehaviorType: "smooth",
    },
  },
});
