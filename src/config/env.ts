export const env = ({
    NODE_ENV: process.env.NODE_ENV ?? "development",
    PORT: Number(process.env.PORT ?? 3000),
    JWT_SECRET: process.env.JWT_SECRET ?? "dummysecret#123",
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ?? "",
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? "7d",
})
