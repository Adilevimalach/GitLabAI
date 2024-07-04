import { config } from '../utils/config.js';
import CustomError from '../middleware/CustomError.js';

// Load environment variables from .env file

const basicAuth = async (req) => {
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
    throw new CustomError('Invalid username or password', 401, 'Auth', {
      authHeader: authHeader,
    });
  }
};

export default basicAuth;
