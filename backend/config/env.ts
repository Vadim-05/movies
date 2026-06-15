import dotenv from "dotenv";
import Joi from "joi";

dotenv.config();

const schema = Joi.object({
  PORT: Joi.number().default(5000),

  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),

  CLIENT_URL: Joi.string().default("*"),
  NODE_ENV: Joi.string().valid("development", "production").default("development"),
  LOG_LEVEL: Joi.string().default("info"),
}).unknown(true);

const { value, error } = schema.validate(process.env);

if (error) throw new Error(error.message);

export const env = {
  PORT: Number(value.PORT),
  DB_HOST: value.DB_HOST,
  DB_PORT: Number(value.DB_PORT),
  DB_USER: value.DB_USER,
  DB_PASSWORD: value.DB_PASSWORD,
  DB_NAME: value.DB_NAME,
  CLIENT_URL: value.CLIENT_URL,
  NODE_ENV: value.NODE_ENV,
  LOG_LEVEL: value.LOG_LEVEL,
} as const;