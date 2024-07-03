// Description: Asynchronously loads the environment variables from the specified environment file.
import fs from 'fs/promises';
import path from 'path';
import CustomError from '../../middleware/CustomError.js';

/**
 * The path to the .env file.
 * @type {string}
 */
const envPath = path.resolve(process.cwd(), '.env');

/**
 * Promise that resolves to the environment configuration.
 * @type {Promise|null}
 */
let envConfigPromise = null;

/**
 * Loads the environment variables from the specified environment file.
 * @returns {Object} The environment variables loaded from the file.
 * @throws {CustomError} If there is an error reading the environment file.
 */
//TODO: check for improvement using process.env
const loadEnvFile = async () => {
  let envConfig = {};
  try {
    const envData = await fs.readFile(envPath, 'utf8');
    envConfig = envData
      .split(/\r?\n/)
      .map((line) => {
        const parts = line.trim().split('=');
        return parts.length === 2 ? [parts[0].trim(), parts[1].trim()] : null;
      })
      .filter((parts) => parts) // Ensure only valid entries are processed
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
  } catch (error) {
    throw new CustomError(
      'Failed to read environment file',
      error,
      'FileRead',
      {},
      envPath
    );
  }

  // Setting the environment variables after ensuring they are correctly trimmed
  for (const [key, value] of Object.entries(envConfig)) {
    process.env[key] = value;
  }
  return envConfig;
};

/**
 * Retrieves the environment variables required for the application.
 * @returns {Promise<Object>} An object containing the required environment variables.
 * @throws {CustomError} If any of the required environment variables are missing.
 */
export const getEnvVariables = async () => {
  if (!envConfigPromise) {
    envConfigPromise = loadEnvFile();
  }
  const envConfig = await envConfigPromise;

  // Validate required configuration
  const requiredKeys = [
    'PORT',
    'CLIENT_ID',
    'CLIENT_SECRET',
    'REDIRECT_URI',
    'AUTHORIZATION_URL',
    'TOKEN_URL',
    'OPENAI_API_KEY',
  ];
  for (const key of requiredKeys) {
    if (!envConfig[key]) {
      throw new CustomError(
        `Missing required environment variable: ${key}`,
        null,
        'EnvConfigMissing',
        {}
      );
    }
  }

  return {
    PORT: envConfig.PORT,
    CLIENT_ID: envConfig.CLIENT_ID,
    CLIENT_SECRET: envConfig.CLIENT_SECRET,
    REDIRECT_URI: envConfig.REDIRECT_URI,
    AUTHORIZATION_URL: envConfig.AUTHORIZATION_URL,
    TOKEN_URL: envConfig.TOKEN_URL,
    OPENAI_API_KEY: envConfig.OPENAI_API_KEY,
  };
};
