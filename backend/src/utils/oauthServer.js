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
let connections = {};

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
  const authorizationUrl = constructAuthorizationUrl(staticConfig);
  const command =
    process.platform === 'darwin'
      ? `open "${authorizationUrl}"`
      : `start "" "${authorizationUrl}"`;
  exec(command, (error) => {
    if (error) {
      throw {
        type: 'URLOpenError',
        error: error,
      };
    }
  });
};

/**
 * Handles the OAuth callback by exchanging the authorization code for an access token.
 *
 * @param {Object} res - The response object.
 * @param {string} code - The authorization code received from the OAuth provider.
 * @param {Object} staticConfig - The static configuration object containing client ID, client secret, redirect URI, and token URL.
 * @returns {Promise<void>} - Resolves when the server closes.
 */
const handleOAuthCallback = async (res, code, staticConfig) => {
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
      console.error(
        `Token exchange failed with status ${response.status}: ${errorText}`
      );
      throw new CustomError(
        `OAuth token request failed: ${response.status}`,
        500,
        'OAuthCallbackError',
        { response: errorText },
        null,
        staticConfig.TOKEN_URL
      );
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

    // Attempt to close the server gracefully
    return new Promise((resolve) => {
      server.close(() => {
        resolve();
      });

      // Destroy open connections after a timeout to force closure
      setTimeout(() => {
        for (const key in connections) {
          connections[key].destroy();
        }
        resolve();
      }, 3000); // Increased timeout to 3 seconds
    });
  } catch (error) {
    console.error('Error processing OAuth callback:', error);
    throw new CustomError(
      'OAuth callback processing error',
      500,
      'OAuthCallbackError',
      { originalError: error.message },
      null,
      staticConfig.TOKEN_URL
    );
  }
};

/**
 * Creates an OAuth server.
 * @param {Object} staticConfig - The static configuration object.
 * @returns {Promise<void>} A promise that resolves when the server is created.
 * @throws {CustomError} - If there is an error creating the server.
 */
export const createServer = async (staticConfig) => {
  return new Promise((resolve, reject) => {
    server = http
      .createServer(async (req, res) => {
        const reqUrl = new URL(
          req.url,
          `http://localhost:${staticConfig.PORT}`
        );
        if (
          reqUrl.pathname === '/oauth/callback' &&
          reqUrl.searchParams.has('code')
        ) {
          try {
            await handleOAuthCallback(
              res,
              reqUrl.searchParams.get('code'),
              staticConfig
            );
            resolve();
          } catch (err) {
            reject(err);
          }
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

    server.on('connection', (conn) => {
      const key = `${conn.remoteAddress}:${conn.remotePort}`;
      connections[key] = conn;
      conn.on('close', () => {
        delete connections[key];
      });
    });

    server.on('error', (error) => {
      console.error('Server error:', error);
      reject(
        new CustomError(
          'Server error',
          500,
          'ServerError',
          { originalError: error.message },
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
      throw new CustomError(
        `Error refreshing access token: ${response.status}`,
        errorText,
        'OAuthRefreshError',
        {},
        config.TOKEN_URL
      );
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
