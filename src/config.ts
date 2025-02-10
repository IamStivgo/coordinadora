import dotenv from 'dotenv'
dotenv.config()

interface ENV {
  NODE_ENV: string | undefined
  PORT: number | undefined
  CLIENT_URL: string | undefined
  DB_HOST: string | undefined
  DB_USER: string | undefined
  DB_PASSWORD: string | undefined
  DB_NAME: string | undefined
  DB_PORT: number | undefined
  JWT_SECRET: string
  CACHE_DB_PORT: number | undefined
  CACHE_DB_HOST: string | undefined
  CACHE_DB_PASSWORD: string | undefined
}

const getConfig = (): ENV => {
  return {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT ? Number(process.env.PORT) : 3000,
    CLIENT_URL: process.env.CLIENT_URL || '*',
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME,
    DB_PORT: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    JWT_SECRET: process.env.JWT_SECRET || 'secret',
    CACHE_DB_PORT: process.env.CACHE_DB_PORT
      ? Number(process.env.CACHE_DB_PORT)
      : undefined,
    CACHE_DB_HOST: process.env.CACHE_DB_HOST,
    CACHE_DB_PASSWORD: process.env.CACHE_DB_PASSWORD,
  }
}

const config = getConfig()

export default config
