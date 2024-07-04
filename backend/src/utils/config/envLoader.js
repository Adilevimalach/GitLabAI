// import dotenv from 'dotenv';
import CustomError from '../../middleware/CustomError.js';
import dotenv from 'dotenv';
// Load environment variables from the .env file
dotenv.config();

/**
 * An array of required environment variable keys.
 * @type {string[]}
 */
const requiredKeys = [
  'PORT',
  'CLIENT_ID',
  'CLIENT_SECRET',
  'REDIRECT_URI',
  'AUTHORIZATION_URL',
  'TOKEN_URL',
  'BASIC_AUTH_USERNAME',
  'BASIC_AUTH_PASSWORD',
  'OPENAI_API_KEY',
];

/**
 * Validates the presence of required environment variables.
 * @throws {CustomError} If any required environment variables are missing.
 */
const validateEnvVariables = () => {
  const missingKeys = requiredKeys.filter((key) => !process.env[key]);
  if (missingKeys.length > 0) {
    throw new CustomError(
      `Missing required environment variables: ${missingKeys.join(', ')}`,
      500,
      'EnvConfigMissing',
      { missingKeys }
    );
  }
};

/**
 * Retrieves the environment variables required for the application.
 * @returns {Object} An object containing the environment variables.
 */
export const getEnvVariables = () => {
  validateEnvVariables();

  return {
    PORT: process.env.PORT,
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    REDIRECT_URI: process.env.REDIRECT_URI,
    AUTHORIZATION_URL: process.env.AUTHORIZATION_URL,
    TOKEN_URL: process.env.TOKEN_URL,
    BASIC_AUTH_USERNAME: process.env.BASIC_AUTH_USERNAME,
    BASIC_AUTH_PASSWORD: process.env.BASIC_AUTH_PASSWORD,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  };
};
