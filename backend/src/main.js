import http from 'http';
import routes from './routes/requestRoutes.js';
import { loadConfiguration } from './utils/config.js';
import ErrorHandler from './middleware/errorHandler.js';
import CustomError from './middleware/CustomError.js';
import { closeAgents } from './services/requestHandler.js';

/**
 * Shuts down the server gracefully.
 * @param {Object} server - The server instance to be shut down.
 * @returns {void}
 */
const shutdown = (server) => {
  // Destroy agents to close any remaining keep-alive connections
  closeAgents();

  // Close the server
  server.close(() => {
    console.log('Server shut down gracefully.');
    process.exit(0);
  });

  // Force shutdown after a timeout
  setTimeout(() => {
    console.error('Forcing shutdown due to open connections.');
    process.exit(1);
  }, 3000); // Timeout in milliseconds
};

/**
 * The main function that starts the server and handles server errors.
 * @returns {Promise<void>} A promise that resolves when the server is started.
 */
async function main() {
  try {
    const config = await loadConfiguration();

    const PORT = config.PORT || 3000;
    const server = http.createServer(routes);

    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });

    server.on('error', (error) => {
      ErrorHandler.handleError(
        res,
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
