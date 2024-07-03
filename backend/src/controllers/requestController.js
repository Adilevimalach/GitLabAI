// Description: Controller for handling user requests.

import {
  processPromptGPT,
  processResponseGPT,
} from '../services/aiServices.js';
import { performOperation } from '../services/appServices.js';
import { config, isTokenExpired, getRefreshToken } from '../utils/config.js';

/**
 * Handles the user request by processing the query using AI models and performing operations on the response.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise} - A promise that resolves to the processed response.
 * @throws {Error} - If there is an error handling the user request.
 */
export const handleUserRequest = async (req, res) => {
  try {
    const { query } = req.body;
    if (isTokenExpired()) {
      await getRefreshToken();
    }
    console.log('Prompt:', query);
    const aiResponse = await processPromptGPT(query, config.OPENAI_API_KEY);
    console.log('AI Response:', aiResponse);
    const dataJson = await performOperation(aiResponse, config.access_token);
    const processedResponse = await processResponseGPT(
      query,
      dataJson,
      config.OPENAI_API_KEY
    );
    console.log('Processed Response:', processedResponse);
    return processedResponse;
  } catch (error) {
    console.error('Error handling user request:', error);
    throw error;
  }
};
