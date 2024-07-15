import { config } from '../utils/config.js';
import CustomError from '../middleware/CustomError.js';

/**
 * Middleware for basic authentication.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @throws {CustomError} If authorization header is missing or if username or password is invalid.
 */
const basicAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      throw new CustomError('Authorization header missing', 401, 'Auth', {
        authHeader: null,
      });
    }
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString(
      'ascii'
    );
    const [username, password] = credentials.split(':');
    const validUsername = config.BASIC_AUTH_USERNAME;
    const validPassword = config.BASIC_AUTH_PASSWORD;
    if (username !== validUsername || password !== validPassword) {
      const error = {
        message: 'Invalid username or password',
        status: 401,
        type: 'Auth',
        context: { authHeader },
      };

      throw new CustomError(error, 'INVALID_CREDENTIALS');
    }
    next();
  } catch (error) {
    next(error);
  }
};

export default basicAuth;
