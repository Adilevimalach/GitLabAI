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
    // const aiResponseTest = {
    //   operation: 'FETCH_UPDATED_REPOSITORIES',
    //   parameters: {
    //     updatedAfter: '2024-01-01',
    //   },
    // };
    console.log('AI Response:', aiResponse);
    const dataJson = await performOperation(aiResponse, config.access_token);
    console.log('Data JSON:', dataJson);
    const processedResponse = await processResponseGPT(
      query,
      dataJson,
      config.OPENAI_API_KEY
    );
    console.log('Processed Response:', processedResponse);
    return processedResponse;
  } catch (error) {
    console.log('Error in handleUserRequest:', error);
    throw error;
  }
};
