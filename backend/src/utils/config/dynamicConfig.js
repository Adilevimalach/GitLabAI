// Description: This file contains the code to read and write the dynamic configuration data to the config.json file.
import fs from 'fs/promises';
import path from 'path';
import CustomError from '../../middleware/CustomError.js';

/**
 * Path to the configuration file.
 * @type {string}
 */
const configPath = path.resolve(process.cwd(), 'config.json');

/**
 * Represents the dynamic configuration object.
 * @type {Object}
 */
let m_dynamicConfig = {};

/**
 * Writes data to a file.
 *
 * @param {string} filePath - The path of the file to write.
 * @param {any} data - The data to write to the file.
 * @throws {CustomError} If there is an error while writing the file.
 */
async function writeFile(filePath, data) {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    throw new CustomError(
      'Failed to write file',
      500,
      'FileWriteError',
      { originalError: error.message },
      filePath
    );
  }
}

/**
 * Updates the dynamic configuration with the provided parameters.
 *
 * @param {string} accessToken - The access token.
 * @param {string} refreshToken - The refresh token.
 * @param {number} expiresIn - The expiration time in seconds.
 * @param {string} scope - The scope of the tokens.
 * @param {number} createdAt - The timestamp when the tokens were created.
 * @throws {CustomError} Throws an error if any of the parameters are invalid.
 */
export const updateDynamicConfig = async (
  accessToken,
  refreshToken,
  expiresIn,
  scope,
  createdAt
) => {
  if (
    !accessToken ||
    !refreshToken ||
    !Number.isFinite(expiresIn) ||
    !createdAt
  ) {
    throw new CustomError(
      'Invalid parameters for dynamic config',
      400,
      'ParameterValidation',
      { accessToken, refreshToken, expiresIn, createdAt }
    );
  }
  const tokenExpirationTime = createdAt + expiresIn;
  m_dynamicConfig = {
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_in: tokenExpirationTime.toString(),
    scope: scope,
    created_at: createdAt,
  };
  await writeFile(configPath, m_dynamicConfig);
};

/**
 * Reads a file from the specified file path and returns the parsed JSON data.
 * @param {string} filePath - The path of the file to read.
 * @returns {Promise<Object>} - A promise that resolves to the parsed JSON data of the file.
 * @throws {CustomError} - If the file is not found or there is an error reading the file.
 */
async function readFile(filePath) {
  try {
    const fileData = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileData);
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new CustomError(
        'Config file not found',
        404,
        'FileNotFound',
        { originalError: error.message },
        filePath
      );
    } else {
      throw new CustomError(
        'Failed to read file',
        error,
        'FileReadError',
        {},
        filePath
      );
    }
  }
}

/**
 * Loads the dynamic configuration from a file.
 * @returns {Promise<void>} A promise that resolves when the dynamic configuration is loaded.
 * @throws {Error} If there is an error while loading the dynamic configuration.
 */
export const loadDynamicConfig = async () => {
  try {
    m_dynamicConfig = await readFile(configPath);
  } catch (error) {
    m_dynamicConfig = {};
    throw error;
  }
};

/**
 * Retrieves the dynamic configuration.
 *
 * @returns {Object} The dynamic configuration object.
 */
export const getDynamicConfig = () => m_dynamicConfig;
