import fetch from 'node-fetch';
import { exec } from 'child_process';
import { updateDynamicConfig } from './config/dynamicConfig.js';
import CustomError from '../middleware/CustomError.js';
import { loadConfiguration } from '../utils/config.js';

/**
 * Constructs the authorization URL for OAuth authentication.
 *
 * @param {Object} staticConfig - The static configuration object.
 * @returns {string} The authorization URL.
 */
const constructAuthorizationUrl = (staticConfig) => {
  const scope = encodeURIComponent(
    'api read_api read_repository write_repository'
  );
  return `${staticConfig.AUTHORIZATION_URL}?client_id=${
    staticConfig.CLIENT_ID
  }&redirect_uri=${encodeURIComponent(
    staticConfig.REDIRECT_URI
  )}&response_type=code&scope=${scope}`;
};

/**
 * Opens the authorization URL in the default browser.
 *
 * @param {Object} staticConfig - The static configuration object.
 */
export const openAuthorizationUrl = (staticConfig) => {
  const authorizationUrl = constructAuthorizationUrl(staticConfig);
  const command =
    process.platform === 'darwin'
      ? `open "${authorizationUrl}"`
      : `start "" "${authorizationUrl}"`;
  exec(command, (error) => {
    if (error) {
      throw new CustomError(error, 'OPEN_AUTHORIZATION_URL_ERROR');
    }
  });
};

/**
 * Handles the OAuth callback by exchanging the authorization code for an access token.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>}
 */
export const oauthCallbackHandler = async (req, res) => {
  const staticConfig = await loadConfiguration();
  const code = req.query.code;

  const params = new URLSearchParams({
    client_id: staticConfig.CLIENT_ID,
    client_secret: staticConfig.CLIENT_SECRET,
    code,
    grant_type: 'authorization_code',
    redirect_uri: staticConfig.REDIRECT_URI,
  });

  try {
    const response = await fetch(staticConfig.TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    });

    if (!response.ok) {
      throw new CustomError(response, 'TOKEN_REQUEST_ERROR');
    }

    const data = await response.json();
    await updateDynamicConfig(
      data.access_token,
      data.refresh_token,
      data.expires_in,
      data.scope,
      data.created_at
    );

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  } catch (error) {
    console.error('Error processing OAuth callback:', error);
    res.status(500).json({ error: 'OAuth callback error' });
  }
};

/**
 * Refreshes the access token using the provided configuration.
 * @param {Object} config - The configuration object.
 * @param {string} config.CLIENT_ID - The client ID.
 * @param {string} config.CLIENT_SECRET - The client secret.
 * @param {string} config.refresh_token - The refresh token.
 * @param {string} config.REDIRECT_URI - The redirect URI.
 * @param {string} config.TOKEN_URL - The token URL.
 * @throws {CustomError} - If there is an error refreshing the access token.
 * @throws {CustomError} - If there is a network error during token refresh.
 */
export const refreshAccessToken = async (config) => {
  const params = new URLSearchParams({
    client_id: config.CLIENT_ID,
    client_secret: config.CLIENT_SECRET,
    refresh_token: config.refresh_token,
    grant_type: 'refresh_token',
    redirect_uri: config.REDIRECT_URI,
  });
  try {
    const response = await fetch(config.TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Error refreshing access token: ${response.status} - ${errorText}`
      );
      throw new CustomError(response, 'REFRESH_TOKEN_ERROR');
    }

    const data = await response.json();
    await updateDynamicConfig(
      data.access_token,
      data.refresh_token,
      data.expires_in,
      data.scope,
      data.created_at
    );
  } catch (error) {
    console.error('Network error during token refresh:', error);
    throw new CustomError(
      'Network error during token refresh',
      error,
      'NetworkError',
      {},
      config.TOKEN_URL
    );
  }
};
