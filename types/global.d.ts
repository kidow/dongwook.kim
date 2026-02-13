declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string

    GITHUB_TOKEN: string

    NOTION_SECRET_KEY: string
    NOTION_DATABASE_ID: string

    SLACK_WEBHOOK_URL: string

    GOOGLE_CALENDAR_REFRESH_TOKEN: string
    GOOGLE_CALENDAR_CLIENT_ID: string
    GOOGLE_CALENDAR_CLIENT_SECRET: string

    BASE_URL: string

    KV_URL: string
    KV_REST_API_URL: string
    KV_REST_API_TOKEN: string
    KV_REST_API_READ_ONLY_TOKEN: string

    GOOGLE_ANALYTICS_PROPERTY_ID: string
    GOOGLE_ANAYLTICS_PROJECT_ID: string
    GOOGLE_ANALYTICS_CLIENT_EMAIL: string
    GOOGLE_ANALYTICS_PRIVATE_KEY: string

    SPOTIFY_CLIENT_ID: string
    SPOTIFY_CLIENT_SECRET: string
  }
}
