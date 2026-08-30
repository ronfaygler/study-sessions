import dotenv from 'dotenv';
import { Pool } from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: process.env.NODE_ENV === 'test' 
    ? path.join(__dirname, '..', 'tests', '.env.test')
    : path.join(__dirname, '..', '.env')
});

export const DATABASE_URL = process.env.DATABASE_URL;

export const pool = new Pool({
    connectionString: DATABASE_URL,
});