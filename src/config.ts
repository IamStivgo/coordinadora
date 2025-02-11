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
  CACHE_URL: string | undefined
}

const getConfig = (): ENV => {
  return {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT ? Number(process.env.PORT) : 3000,
    CLIENT_URL: process.env.CLIENT_URL || '*',
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_USER: process.env.DB_USER || 'root',
    DB_PASSWORD: process.env.DB_PASSWORD || 'root',
    DB_NAME: process.env.DB_NAME || 'coordinadora',
    DB_PORT: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    JWT_SECRET: process.env.JWT_SECRET || 'secret',
    CACHE_URL: process.env.CACHE_URL || 'redis://localhost:6379',
  }
}

const config = getConfig()

export default config
