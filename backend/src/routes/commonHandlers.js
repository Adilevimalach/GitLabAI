// commonHandlers.js
/**
 * Parses the JSON body of a request.
 * @param {Object} req - The request object.
 * @returns {Promise<Object>} - A promise that resolves with the parsed JSON body or rejects with an error.
 */
export const parseJsonBody = (req) => {
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
            'JSONParse',
            {},
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
export const addCorsHeaders = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
};
