/* eslint-disable no-unused-vars */

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string

    GITHUB_TOKEN: string

    SLACK_WEBHOOK_URL: string

    GOOGLE_CALENDAR_REFRESH_TOKEN: string
    GOOGLE_CALENDAR_CLIENT_ID: string
    GOOGLE_CALENDAR_CLIENT_SECRET: string

    NEXT_PUBLIC_BASE_URL: string

    GOOGLE_ANALYTICS_PROPERTY_ID: string
    GOOGLE_ANAYLTICS_PROJECT_ID: string
    GOOGLE_ANALYTICS_CLIENT_EMAIL: string
    GOOGLE_ANALYTICS_PRIVATE_KEY: string

    SPOTIFY_CLIENT_ID: string
    SPOTIFY_CLIENT_SECRET: string
    NEXT_PUBLIC_SPOTIFY_PLAYLIST_ID: string

    GEMINI_API_KEY: string
    GEMINI_CHAT_MODEL: string
    GEMINI_EMBED_MODEL: string

    AUTH_TOKEN: string

    SUPABASE_URL: string
    SUPABASE_SERVICE_ROLE_KEY: string
    NEXT_PUBLIC_SUPABASE_URL: string
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: string
  }
}
