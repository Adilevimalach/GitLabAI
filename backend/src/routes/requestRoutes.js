import express from 'express';
import basicAuth from '../middleware/basicAuth.js';
import ErrorHandler from '../middleware/errorHandler.js';
import { handleUserRequest } from './requestController.js';

/**
 * Express router instance.
 * @type {express.Router}
 */
const router = express.Router();

router.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

router.post('/user-request', basicAuth, async (req, res, next) => {
  try {
    const responseData = await handleUserRequest(req);
    res.status(200).json({ status: 'success', responseData });
  } catch (error) {
    ErrorHandler.handleError(error, res);
  }
});

router.use((req, res) => {
  res.status(404).send('Not Found');
});

export default router;
