// Description: Routes for handling user requests.

import { handleUserRequest } from '../controllers/requestController.js';
import ErrorHandler from '../middleware/errorHandler.js';
import { isTokenExpired, getRefreshToken } from '../utils/config.js';
import CustomError from '../middleware/CustomError.js';
import basicAuth from '../middleware/basicAuth.js';

/**
 * Handles incoming HTTP requests and routes them to the appropriate handlers.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {void}
 */
const routes = async (req, res) => {
  const reqUrl = new URL(req.url, `http://${req.headers.host}`);

  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    addCorsHeaders(res);
    res.writeHead(204); // No content to send back for OPTIONS requests
    res.end();
    return; // Early return to avoid further processing
  }

  // Apply CORS headers to all responses
  addCorsHeaders(res);

  // Main route handling for POST to '/user-request'
  if (reqUrl.pathname === '/user-request' && req.method === 'POST') {
    try {
      // Perform basic authentication

      await basicAuth(req);
      // Token expiry check
      if (isTokenExpired()) {
        await getRefreshToken();
      }

      const body = await parseJsonBody(req);
      req.body = body;
      const responseData = await handleUserRequest(req);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'success', responseData }));
    } catch (error) {
      ErrorHandler.handleError(error, res);
    }
  } else {
    // Respond with 404 for all other routes
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
};

/**
 * Parses the JSON body of a request.
 * @param {Object} req - The request object.
 * @returns {Promise<Object>} - A promise that resolves with the parsed JSON body or rejects with an error.
 */
const parseJsonBody = (req) => {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString(); // Convert Buffer to string
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(
          new CustomError(
            'Failed to parse JSON body',
            400,
            'JSONParseError',
            { originalBody: body },
            null,
            null,
            null,
            body
          )
        );
      }
    });
  });
};

/**
 * Adds CORS headers to the response object.
 * @param {Object} res - The response object.
 */
const addCorsHeaders = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
};

export default routes;
