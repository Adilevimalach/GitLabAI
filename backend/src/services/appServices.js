// Description: The app services module for the GitLab API.

import { requestHandler } from './requestHandler.js';

/**
 * Builds the URL for GitLab API requests based on project ID and endpoint specifics.
 * @param {string} projectId - The ID of the project, if applicable.
 * @param {string} endpoint - The specific API endpoint after the project ID.
 * @returns {string} The full URL for the API request.
 */
function buildGitLabApiUrl(projectId = '', endpoint = '') {
  const baseApiUrl = 'https://gitlab.com/api/v4/projects';
  return projectId
    ? `${baseApiUrl}/${projectId}${endpoint}`
    : `${baseApiUrl}${endpoint}`;
}

/**
 * Fetches repositories updated after a specific date.
 * @param {string} updatedAfter - The date to fetch repositories updated after (YYYY-MM-DD).
 * @param {string} accessToken - The access token for the API request.
 * @returns {Promise<Array>} - The updated repositories.
 */
export const fetchRepositoriesUpdatedAfter = async (
  updatedAfter,
  accessToken
) => {
  const apiUrl = buildGitLabApiUrl(
    '',
    `?membership=true&updated_after=${updatedAfter}&order_by=updated_at&sort=desc`
  );
  return await requestHandler(apiUrl, 'GET', accessToken);
};

/**
 * Fetches a repository by its ID.
 *
 * @param {string} projectId - The ID of the project/repository.
 * @param {string[]} fields - The fields to extract from the GitLab data.
 * @param {string} accessToken - The access token for authentication.
 * @returns {Promise<Object>} - A promise that resolves to the extracted fields with description.
 */
export const fetchRepositoryById = async (projectId, accessToken) => {
  const apiUrl = buildGitLabApiUrl(projectId);
  const gitLabData = await requestHandler(apiUrl, 'GET', accessToken);
  return gitLabData;
};

/**
 * Deletes a repository by ID.
 * @param {number} projectId - The ID of the GitLab project.
 * @param {string} accessToken - The access token for the API request.
 * @returns {Promise<Object>} - The deletion response.
 */
export const deleteRepositoryById = async (projectId, accessToken) => {
  const apiUrl = buildGitLabApiUrl(projectId);
  return await requestHandler(apiUrl, 'DELETE', accessToken);
};

/**
 * Updates a repository by its ID.
 *
 * @param {string} projectId - The ID of the project.
 * @param {object} updates - The updates to be applied to the repository.
 * @param {string} accessToken - The access token for authentication.
 * @returns {Promise<object>} - A promise that resolves to the update response.
 */
export const updateRepositoryById = async (projectId, updates, accessToken) => {
  const apiUrl = buildGitLabApiUrl(projectId);
  const updateResponse = await requestHandler(
    apiUrl,
    'PUT',
    accessToken,
    updates
  );
  return updateResponse;
};

/**
 * Performs the requested operation based on the provided API request.
 * @param {Object} apiRequest - The API request object.
 * @param {string} accessToken - The access token for GitLab API.
 * @returns {Promise} A promise that resolves with the result of the operation.
 */
export const performOperation = async (apiRequest, accessToken) => {
  try {
    switch (apiRequest.operation) {
      case 'FETCH_UPDATED_REPOSITORIES':
        return fetchRepositoriesUpdatedAfter(
          apiRequest.parameters.updatedAfter,
          accessToken
        );
      case 'FETCH_REPOSITORY_BY_ID':
        return fetchRepositoryById(
          apiRequest.parameters.projectId,
          accessToken
        );
      case 'DELETE_REPOSITORY':
        return deleteRepositoryById(
          apiRequest.parameters.projectId,
          accessToken
        );
      case 'UPDATE_REPOSITORY':
        return updateRepositoryById(
          apiRequest.parameters.projectId,
          apiRequest.parameters.updates,
          apiRequest.fields,
          accessToken
        );
      default:
      //TODO: handle invalid operation
    }
  } catch (error) {
    throw error;
  }
};

//TODO: Check CRUD operations for GitLab API (calls fit to the doc)
