// Description: This file contains the logic to load the configuration for the application.

import { getEnvVariables } from './config/envLoader.js';
import { loadDynamicConfig, getDynamicConfig } from './config/dynamicConfig.js';
import { createServer, refreshAccessToken } from './oauthServer.js';

/**
 * Configuration object.
 * @type {Object}
 */
export let config = {};

/**
 * Array of required properties.
 * @type {string[]}
 */
const requiredProperties = ['access_token', 'refresh_token'];

/**
 * Checks if all required properties are present in the config object.
 * @returns {boolean} True if all required properties are present, false otherwise.
 */
const areRequiredPropertiesPresent = () => {
  return requiredProperties.every((property) => config[property]);
};

/**
 * Checks if the token has expired.
 * @returns {boolean} Returns true if the token has expired, false otherwise.
 */
export const isTokenExpired = () => {
  const currentTime = Math.floor(Date.now() / 1000);
  return currentTime >= config.expires_in;
};

/**
 * Retrieves the refresh token.
 * @async
 * @throws {Error} If an error occurs while refreshing the access token.
 */
export const getRefreshToken = async () => {
  try {
    await refreshAccessToken(config);
  } catch (error) {
    throw error;
  }
};

/**
 * Loads the configuration by retrieving static and dynamic configurations,
 * performs necessary checks, and returns the final configuration object.
 *
 * @returns {Object} The configuration object.
 * @throws {Error} If any error occurs during the configuration loading process.
 */
export const loadConfiguration = async () => {
  let staticConfig = {};
  try {
    staticConfig = await getEnvVariables();
    await loadDynamicConfig();
  } catch (error) {
    throw error;
  }

  const dynamicConfig = getDynamicConfig();
  config = { ...staticConfig, ...dynamicConfig };

  try {
    if (!areRequiredPropertiesPresent()) {
      await createServer(staticConfig);
      // await loadDynamicConfig(); // Assume this reloads dynamic configuration correctly after OAuth-
      const updatedDynamicConfig = getDynamicConfig();
      config = { ...staticConfig, ...updatedDynamicConfig };
    }
    if (isTokenExpired()) {
      await getRefreshToken();
      const updatedDynamicConfig = getDynamicConfig();
      config = { ...staticConfig, ...updatedDynamicConfig };
    }
  } catch (error) {
    throw error;
  }

  return config;
};
