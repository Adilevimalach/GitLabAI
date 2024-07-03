// Code for the OAuth server and token refresh functionality

import http from 'http';
import { URL } from 'url';
import fetch from 'node-fetch';
import { exec } from 'child_process';
import { updateDynamicConfig } from './config/dynamicConfig.js';
import CustomError from '../middleware/CustomError.js'; // Import the CustomError class

/**
 * The OAuth server instance.
 * @type {Object}
 */
let server;

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
const openAuthorizationUrl = (staticConfig) => {
  console.log('Opening authorization URL...');
  const authorizationUrl = constructAuthorizationUrl(staticConfig);
  exec(`start "" "${authorizationUrl}"`, (error) => {
    if (error) {
      throw new CustomError(
        'Error opening authorization URL',
        error,
        'AuthorizationUrlError',
        {},
        authorizationUrl
      );
    }
  });
};

/**
 * Handles the OAuth callback by exchanging the authorization code for an access token.
 *
 * @param {Object} res - The response object.
 * @param {string} code - The authorization code received from the OAuth provider.
 * @param {Object} staticConfig - The static configuration object containing client ID, client secret, redirect URI, and token URL.
 * @param {Function} resolve - The function to resolve the promise.
 * @param {Function} reject - The function to reject the promise.
 * @returns {void}
 */
const handleOAuthCallback = async (
  res,
  code,
  staticConfig,
  resolve,
  reject
) => {
  console.log('Handling OAuth callback...');
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
      const errorText = await response.text();
      reject(
        new CustomError(
          `OAuth token request failed: ${response.status}`,
          errorText,
          'OAuthCallbackError',
          {},
          staticConfig.TOKEN_URL
        )
      );
      return;
    }

    const data = await response.json();
    updateDynamicConfig(
      data.access_token,
      data.refresh_token,
      data.expires_in,
      data.scope,
      data.created_at
    );

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
    server.close(() => {
      console.log('Server closed');
      resolve();
    });
  } catch (error) {
    reject(
      new CustomError(
        'OAuth callback processing error',
        error,
        'OAuthCallbackError',
        {},
        staticConfig.TOKEN_URL
      )
    );
  }
};

/**
 * Creates an OAuth server.
 * @param {Object} staticConfig - The static configuration object.
 * @returns {Promise} A promise that resolves when the server is created.
 */
export const createServer = (staticConfig) => {
  console.log('Creating OAuth server...');
  return new Promise((resolve, reject) => {
    server = http
      .createServer((req, res) => {
        const reqUrl = new URL(
          req.url,
          `http://localhost:${staticConfig.PORT}`
        );
        if (
          reqUrl.pathname === '/oauth/callback' &&
          reqUrl.searchParams.has('code')
        ) {
          handleOAuthCallback(
            res,
            reqUrl.searchParams.get('code'),
            staticConfig,
            resolve,
            reject
          );
        } else {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('Not Found');
        }
      })
      .listen(staticConfig.PORT, () => {
        console.log(
          `OAuth server started on http://localhost:${staticConfig.PORT}`
        );
        openAuthorizationUrl(staticConfig);
      });

    server.on('error', (error) => {
      reject(
        new CustomError(
          'Server error',
          error,
          'ServerError',
          {},
          `http://localhost:${staticConfig.PORT}`
        )
      );
    });
  });
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
  console.log('Refreshing access token...');
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
      throw new CustomError(
        `Error refreshing access token: ${response.status}`,
        errorText,
        'OAuthRefreshError',
        {},
        config.TOKEN_URL
      );
    }

    const data = await response.json();
    updateDynamicConfig(
      data.access_token,
      data.refresh_token,
      data.expires_in,
      data.scope,
      data.created_at
    );
  } catch (error) {
    throw new CustomError(
      'Network error during token refresh',
      error,
      'NetworkError',
      {},
      config.TOKEN_URL
    );
  }
};
