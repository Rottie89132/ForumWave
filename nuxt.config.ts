// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },

  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxt/image",
    "@vite-pwa/nuxt",
    "nuxt-icon",
    "@vueuse/nuxt",
    "@vee-validate/nuxt",
    "nuxt-mongoose",
    "nuxt-tiptap-editor",
    "@nuxtjs/supabase"
  ],

  veeValidate: {
    autoImports: false,
  },

  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    redirectOptions: {
      login: '/screen',
      callback: '/confirm',
      include: ["/test"],
      exclude: [],
      cookieRedirect: true,
    },
  },

  tiptap: {
    prefix: "Tiptap", 
  },

  pwa: {
    strategies: "injectManifest",
    registerType: 'autoUpdate',
    manifest: {
      name: "ForumWave",
      short_name: "ForumWave",
      description: "ForumWave",
      prefer_related_applications: true,
      orientation: "portrait",
      background_color: "#FFFFFF",
      theme_color: "#FFFFFF",
      display_override: ["window-controls-overlay", "standalone", "minimal-ui", "fullscreen", "browser"],
      icons: [
        {
          src: "icons/icon_144.png",
          sizes: "144x144",
          type: "image/png",
        },
        {
          src: "icons/icon_152.png",
          sizes: "152x152",
          type: "image/png",
        },
        {
          src: "icons/icon_192.png",
          sizes: "192x192",
          type: "image/svg",
        },
        {
          src: "icons/icon_512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
      launch_handler: {
        client_mode: ["navigate-existing", "auto"]
      }
    },
    workbox: {
      navigateFallback: '/',
    },
    devOptions: {
      enabled: true,
      type: "module",
      suppressWarnings: true,
    },
  },

  app: {
    head: {
      meta: [
        { name: 'theme-color', media: '(prefers-color-scheme: light)', content: "#FFFFFF" },
        { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      ],
      charset: 'utf-8',
      viewport: 'viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no',
    }
  },

  nitro: {
    imports: {
      dirs: ["./server/utils"],
      presets: [{
        from: "bcrypt",
        imports: [{ name: "default", as: "bcrypt" }],
      }],
    },
  },

  compatibilityDate: "2024-09-17",
})