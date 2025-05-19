import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.development
config({ path: resolve(__dirname, '../.env.development') }); 