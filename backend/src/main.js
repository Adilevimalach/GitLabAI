import express from 'express';
import { loadConfiguration } from './utils/config.js';
import ErrorHandler from './middleware/errorHandler.js';
import { initializeAllCaches } from './utils/cache.js';
import { oauthCallbackHandler } from './utils/oauthServer.js';
import { handleUserRequest } from './routes/requestController.js';
import basicAuth from './middleware/basicAuth.js';

/**
 * Shuts down the server gracefully.
 * @param {Object} server - The server instance to be shut down.
 * @returns {void}
 */
const shutdown = (server) => {
  server.close(() => {
    console.log('Server shut down gracefully.');
    process.exit(0);
  });

  setTimeout(() => {
    console.error('Forcing shutdown due to open connections.');
    process.exit(1);
  }, 3000);
};

/**
 * The main function that starts the server and handles server errors.
 * @returns {Promise<void>} A promise that resolves when the server is started.
 */
async function main() {
  try {
    const config = await loadConfiguration();
    await initializeAllCaches();

    const app = express();
    const PORT = config.PORT || 3000;

    app.use(express.json());

    app.use((req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, OPTIONS'
      );
      res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization'
      );
      if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
      }
      next();
    });

    app.get('/oauth/callback', async (req, res) => {
      await oauthCallbackHandler(req, res);
    });

    app.post('/user-request', basicAuth, async (req, res, next) => {
      try {
        const responseData = await handleUserRequest(req);
        res.status(200).json({ status: 'success', responseData });
      } catch (error) {
        ErrorHandler.handleError(error, res);
      }
    });

    app.use((err, req, res, next) => {
      ErrorHandler.handleError(err, res);
    });

    const server = app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });

    server.on('error', (error) => {
      ErrorHandler.handleError(
        new CustomError('Server encountered an error', 500, 'ServerError', {
          originalError: error.message,
        })
      );
      shutdown(server);
    });

    process.on('SIGTERM', () => shutdown(server));
    process.on('SIGINT', () => shutdown(server));
  } catch (err) {
    ErrorHandler.handleError(err);
  }
}

main().catch((err) => {
  ErrorHandler.handleError(err);
});
