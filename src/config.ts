import dotenv from 'dotenv'
dotenv.config()

interface ENV {
  NODE_ENV: string | undefined
  PORT: number
  CLIENT_URL: string
  MYSQL_URL: string | undefined
  JWT_SECRET: string | undefined
  CACHE_DB_PORT: number | undefined
  CACHE_DB_HOST: string | undefined
  CACHE_DB_PASSWORD: string | undefined
}

const getConfig = (): ENV => {
  return {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT ? Number(process.env.PORT) : 3000,
    CLIENT_URL: process.env.CLIENT_URL || '*',
    MYSQL_URL: process.env.MYSQL_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    CACHE_DB_PORT: process.env.CACHE_DB_PORT
      ? Number(process.env.CACHE_DB_PORT)
      : undefined,
    CACHE_DB_HOST: process.env.CACHE_DB_HOST,
    CACHE_DB_PASSWORD: process.env.CACHE_DB_PASSWORD,
  }
}

const config = getConfig()

export default config
