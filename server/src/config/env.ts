import dotenv from 'dotenv';

dotenv.config();

// Validate required environment variables
const requiredEnvVars = {
  JWT_SECRET: process.env.JWT_SECRET,
  DATABASE_URL: process.env.DATABASE_URL,
};

// Fail fast if required env vars are missing
const missingVars: string[] = [];
for (const [key, value] of Object.entries(requiredEnvVars)) {
  if (!value || value.trim() === '') {
    missingVars.push(key);
  }
}

if (missingVars.length > 0) {
  console.error('❌ ERROR: Missing required environment variables:');
  missingVars.forEach((varName) => {
    console.error(`   - ${varName}`);
  });
  console.error('\n💡 Please set these environment variables before starting the server.');
  process.exit(1);
}

// Export JWT_SECRET as a constant (read only once)
export const JWT_SECRET: string = requiredEnvVars.JWT_SECRET!;

// Export other configuration
export const config = {
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'production',
  database: {
    url: requiredEnvVars.DATABASE_URL!,
  },
  jwt: {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  },
};

// Log environment status on startup
console.log('✅ Environment variables validated');
console.log(`📦 Node Environment: ${config.nodeEnv}`);
console.log(`🔐 JWT_SECRET: ✓ Set`);
