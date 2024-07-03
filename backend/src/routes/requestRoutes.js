// Description: Routes for handling user requests.

import { handleUserRequest } from '../controllers/requestController.js';
import { parseJsonBody, addCorsHeaders } from './commonHandlers.js';
import ErrorHandler from '../middleware/errorHandler.js';
import { isTokenExpired, getRefreshToken } from '../utils/config.js';

/**
 * Handles incoming HTTP requests and routes them to the appropriate handlers.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {void}
 */
const routes = async (req, res) => {
  const reqUrl = new URL(req.url, `http://${req.headers.host}`);
  const requestId = new Date().getTime(); // Example unique request ID for logging

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
      if (isTokenExpired()) {
        await getRefreshToken();
      }
      // Parse JSON body from the request
      const body = await parseJsonBody(req);
      console.log(`[${requestId}] Request body parsed:`, body);
      req.body = body; // Attach parsed body to the request object for further handling

      // Process the user request
      console.log(`[${requestId}] Handling user request...`);
      const responseData = await handleUserRequest(req, res);

      // Send success response
      sendSuccessResponse(res, responseData);
    } catch (error) {
      // Handle any errors that occur during request processing
      console.error(`[${requestId}] Error handling request:`, error);
      ErrorHandler.handleError(error); // Proper error handling by logging and responding

      // Send error response
      sendErrorResponse(res, error);
    }
  } else {
    // Respond with 404 for all other routes
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
};

/**
 * Sends a success response.
 * @param {Object} res - The HTTP response object.
 * @param {Object} data - The data to send in the response.
 */
const sendSuccessResponse = (res, data) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ status: 'success', data }));
};

/**
 * Sends an error response.
 * @param {Object} res - The HTTP response object.
 * @param {Object} error - The error object containing error details.
 */
const sendErrorResponse = (res, error) => {
  res.writeHead(error.status || 500, { 'Content-Type': 'application/json' });
  res.end(
    JSON.stringify({
      status: 'error',
      message: error.message || 'Internal Server Error',
    })
  );
};

export default routes;
