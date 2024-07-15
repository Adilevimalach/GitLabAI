import fetch from 'node-fetch';
import CustomError from '../middleware/CustomError.js';

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
    timeout: 5000,
  };
  if (body) {
    options.body = JSON.stringify(body);
  }
  try {
    const response = await fetch(url, options);
    const responseBody = await response.text();
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
    return {
      status: response.status,
      statusText: response.statusText,
      body: JSON.parse(responseBody),
      response: response,
    };
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
