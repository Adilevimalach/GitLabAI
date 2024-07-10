// Description: Controller for handling user requests.

import {
  processPromptGPTToCache,
  processResponseGPT,
} from '../services/aiServices.js';
import {
  deleteRepositoryById,
  updateRepositoryById,
  fetchRepositoriesUpdatedAfter,
} from '../services/appServices.js';
import { config, isTokenExpired, getRefreshToken } from '../utils/config.js';
import {
  updateCachesByTime,
  getInfoFromCaches,
  updateAllCachesById,
  removeProjectFromCaches,
  updateNeeded,
} from '../utils/cache.js';

/**
 * Handles the user request by processing the query using AI models and returning the processed response.
 * @param {Object} req - The request object.
 * @returns {Promise} A promise that resolves to the processed response.
 * @throws {Error} If an error occurs during the processing of the user request.
 */
export const handleUserRequest = async (req) => {
  try {
    // await updateIfNeeded();
    const { query } = req.body;
    if (isTokenExpired()) {
      await getRefreshToken();
    }
    if (updateNeeded()) {
      await updateCachesByTime();
    }
    const aiResponseOperation = await processPromptGPTToCache(
      query,
      config.OPENAI_API_KEY
    );
    switch (aiResponseOperation.operation) {
      case 'MORE_INFO_OPERATION': {
        const data = getInfoFromCaches(
          aiResponseOperation.parameters.caches,
          aiResponseOperation.parameters.projectIds
        );
        const aiResponseToUser = await processResponseGPT(
          query,
          JSON.stringify(data),
          config.OPENAI_API_KEY
        );
        return aiResponseToUser;
      }
      case 'UPDATE_REPOSITORY': {
        const updateResponse = await updateRepositoryById(
          aiResponseOperation.parameters.projectId,
          aiResponseOperation.parameters.updates,
          config.access_token
        );
        if (updateResponse.status === 200) {
          await updateAllCachesById(aiResponseOperation.parameters.projectId);
          updateResponse.message = 'Repository updated successfully';
        }
        const aiResponseToUser = await processResponseGPT(
          query,
          JSON.stringify(updateResponse),
          config.OPENAI_API_KEY
        );
        return aiResponseToUser;
      }
      case 'DELETE_REPOSITORY': {
        const deleteResponse = await deleteRepositoryById(
          aiResponseOperation.parameters.projectId,
          config.access_token
        );
        if (deleteResponse.status === 202) {
          await removeProjectFromCaches(
            aiResponseOperation.parameters.projectId
          );
          deleteResponse.message = 'Repository deleted successfully';
        }
        const aiResponseToUser = await processResponseGPT(
          query,
          deleteResponse.message,
          config.OPENAI_API_KEY
        );

        return aiResponseToUser;
      }
      case 'UPDATE_AFTER_REPOSITORY': {
        const updatedRepositories = await fetchRepositoriesUpdatedAfter(
          aiResponseOperation.parameters.updated_at,
          config.access_token
        );

        const responseData = updatedRepositories.body.map((repo) => ({
          id: repo.id,
          name: repo.name,
          description: repo.description,
          visibility: repo.visibility,
          updated_at: repo.updated_at,
        }));
        const aiResponseToUser = await processResponseGPT(
          query,
          JSON.stringify(responseData),
          config.OPENAI_API_KEY
        );

        return aiResponseToUser;
      }
      default:
        return { message: 'Operation not supported or missing details' };
    }
  } catch (error) {
    console.log('Error in handleUserRequest:', error);
    throw error;
  }
};
