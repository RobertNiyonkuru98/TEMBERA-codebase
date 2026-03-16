import { cleanEnv, port, str, url } from "envalid";

const envValidator = cleanEnv(process.env, {
  NODE_ENV: str({
    choices: ["development", "production", "test"],
    default: "development",
  }),
  PORT: port({ default: 3000 }),
  DATABASE_URL: url(),
  JWT_SECRET: str({ default: 'Tembera@2026' }),
});

export const APP_ENV = envValidator.NODE_ENV;
export const PORT = envValidator.PORT;
export const DATABASE_URL = envValidator.DATABASE_URL;
export const JWT_SECRET = envValidator.JWT_SECRET;

export const LOG_LEVEL = APP_ENV === "production" ? "info" : "debug";