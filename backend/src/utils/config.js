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
const areRequiredPropertiesPresent = (dynamicConfig) => {
  return requiredProperties.every((property) => dynamicConfig[property]);
};

/**
 * Checks if the token has expired.
 * @returns {boolean} Returns true if the token has expired, false otherwise.
 */
export const isTokenExpired = () => {
  const currentTime = Math.floor(Date.now() / 1000);
  const tokenExpirationTime = config.created_at + config.expires_in;
  return currentTime >= tokenExpirationTime;
};

/**
 * Retrieves the refresh token.
 * @async
 * @throws {Error} If an error occurs while refreshing the access token.
 */
export const getRefreshToken = async () => {
  try {
    await refreshAccessToken(config);
    const updatedDynamicConfig = getDynamicConfig();
    config = { ...config, ...updatedDynamicConfig };
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
  try {
    const staticConfig = getEnvVariables();
    await loadDynamicConfig();
    const dynamicConfig = getDynamicConfig();

    if (!areRequiredPropertiesPresent(dynamicConfig)) {
      await createServer(staticConfig);
      const updatedDynamicConfig = getDynamicConfig();
      config = { ...config, ...updatedDynamicConfig };
    } else {
      config = { ...staticConfig, ...dynamicConfig };
      if (isTokenExpired()) {
        await getRefreshToken();
      }
    }
  } catch (error) {
    throw error;
  }
  return config;
};
