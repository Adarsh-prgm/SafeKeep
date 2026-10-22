import 'dotenv/config';
import { z } from 'zod';
const schema = z.object({ DATABASE_URL: z.string().url(), JWT_ACCESS_SECRET: z.string().min(32), ACCESS_TOKEN_TTL: z.string().default('15m'), CLIENT_URL: z.string().url().default('http://localhost:5173'), PORT: z.coerce.number().default(4000), UPLOAD_DIR: z.string().default('./private-uploads'), MAX_FILE_SIZE_MB: z.coerce.number().int().positive().default(15) });
export const config = schema.parse(process.env);
