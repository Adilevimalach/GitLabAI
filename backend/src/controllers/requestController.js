// Description: Controller for handling user requests.

import {
  processPromptGPT,
  processResponseGPT,
} from '../services/aiServices.js';
import { performOperation } from '../services/appServices.js';
import { config, isTokenExpired, getRefreshToken } from '../utils/config.js';

/**
 * Handles the user request by processing the query using AI models and returning the processed response.
 * @param {Object} req - The request object.
 * @returns {Promise} A promise that resolves to the processed response.
 * @throws {Error} If an error occurs during the processing of the user request.
 */
export const handleUserRequest = async (req) => {
  try {
    const { query } = req.body;
    if (isTokenExpired()) {
      await getRefreshToken();
    }
    const aiResponse = await processPromptGPT(query, config.OPENAI_API_KEY);
    const dataJson = await performOperation(aiResponse, config.access_token);
    const processedResponse = await processResponseGPT(
      query,
      dataJson,
      config.OPENAI_API_KEY
    );
    return processedResponse;
  } catch (error) {
    throw error;
  }
};
