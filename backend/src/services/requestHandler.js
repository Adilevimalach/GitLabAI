// Description: This file contains the requestHandler function that is used to make API requests.

import fetch from 'node-fetch';
import http from 'http';

import CustomError from '../middleware/CustomError.js';

// Create HTTP and HTTPS agents with keep-alive and a timeout of 20-30 seconds
/**TODO:
 * HTTP agent for handling requests.
 * @type {http.Agent}
 */
const httpAgent = new http.Agent({ keepAlive: true, timeout: 30000 });

/**
 * Handles HTTP requests to the specified URL with the given method, access token, and optional request body.
 * @param {string} url - The URL to send the request to.
 * @param {string} method - The HTTP method to use for the request (e.g., 'GET', 'POST', 'PUT', 'DELETE').
 * @param {string} accessToken - The access token to include in the request headers.
 * @param {object|null} body - The optional request body to send with the request.
 * @returns {Promise<object>} - A promise that resolves to the parsed JSON response from the server.
 * @throws {CustomError} - If the API request fails or the response has an invalid content type.
 */
export const requestHandler = async (url, method, accessToken, body = null) => {
  const options = {
    method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    httpAgent, // Use the appropriate agent
    timeout: 5000, // TODO:5 seconds timeout for the entire request
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    const responseBody = await response.text();
    if (!response.ok) {
      throw new CustomError(
        `API request failed with status ${response.status}`,
        response.status,
        'APIError',
        { response: responseBody },
        null,
        url,
        method,
        responseBody
      );
    }

    // Check the content type before parsing
    const contentType = response.headers.get('Content-Type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new CustomError(
        'Expected JSON response, got something else.',
        500,
        'InvalidContentType',
        { expected: 'application/json', got: contentType },
        null,
        url,
        method,
        responseBody
      );
    }

    return JSON.parse(responseBody);
  } catch (error) {
    throw new CustomError(
      'Network error during API request',
      500,
      'NetworkError',
      { originalError: error.message },
      null,
      url,
      method
    );
  }
};

/**
 * Closes the HTTP and HTTPS agents.
 */
export const closeAgents = () => {
  httpAgent.destroy();
};
