// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: "Fables",
      link: [
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..800;1,400..800&display=swap",
        },
        {
          rel: "icon",
          type: "image/svg+xml",
          href: "/favicon.svg",
        },
      ],
    },
  },
  compatibilityDate: "2024-04-03",
  css: [
    '~/assets/css/tailwind.css'],
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@pinia/nuxt", "@nuxt/eslint"],
  runtimeConfig: {
    // Public keys that are exposed to the client
    public: {
      baseURL: process.env.BASE_URL,
    },
  },
});
