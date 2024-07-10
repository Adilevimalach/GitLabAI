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
 * Fetches commits by project ID from GitLab API.
 * @param {number} projectId - The ID of the project.
 * @param {string} accessToken - The access token for authentication.
 * @returns {Promise<Object>} - A promise that resolves to the GitLab data containing the commits.
 */
export const fetchCommitsById = async (projectId, accessToken) => {
  const apiUrl = buildGitLabApiUrl(projectId, '/repository/commits');
  const gitLabData = await requestHandler(apiUrl, 'GET', accessToken);
  return gitLabData;
};

/**
 * Fetches branches by project ID from GitLab API.
 *
 * @param {number} projectId - The ID of the project.
 * @param {string} accessToken - The access token for authentication.
 * @returns {Promise<Object>} - A promise that resolves to the GitLab data.
 */
export const fetchBranchesById = async (projectId, accessToken) => {
  const apiUrl = buildGitLabApiUrl(projectId, '/repository/branches');
  const gitLabData = await requestHandler(apiUrl, 'GET', accessToken);
  return gitLabData;
};

/**
 * Fetches contributors for a project from GitLab API.
 * @param {string} projectId - The ID of the project.
 * @param {string} accessToken - The access token for authentication.
 * @returns {Promise<Object>} - A promise that resolves to the GitLab data containing contributors.
 */
export const fetchContributorsById = async (projectId, accessToken) => {
  const baseApiUrl = buildGitLabApiUrl(projectId, '/repository/contributors');
  const gitLabData = await requestHandler(baseApiUrl, 'GET', accessToken);
  return gitLabData;
};

/**
 * Fetches members of a project from GitLab API.
 * @param {string} projectId - The ID of the project.
 * @param {string} accessToken - The access token for authentication.
 * @returns {Promise<Object>} - A promise that resolves to the GitLab data.
 */
export const fetchMembersById = async (projectId, accessToken) => {
  const baseApiUrl = buildGitLabApiUrl(projectId, '/members');
  const gitLabData = await requestHandler(baseApiUrl, 'GET', accessToken);
  return gitLabData;
};

/**
 * Fetches all tree data for a given project.
 *
 * @param {string} projectId - The ID of the project.
 * @param {string} accessToken - The access token for authentication.
 * @returns {Promise<Object>} - A promise that resolves to the GitLab data.
 */
export const fetchAllTreeById = async (projectId, accessToken) => {
  const baseApiUrl = buildGitLabApiUrl(projectId, '/repository/tree');

  const gitLabData = await requestHandler(baseApiUrl, 'GET', accessToken);
  return gitLabData;
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
  const apiUrl = buildGitLabApiUrl(projectId, '');
  const gitLabData = await requestHandler(apiUrl, 'GET', accessToken);
  return gitLabData;
};

/**
 * Fetches all repositories from GitLab.
 * @param {string} accessToken - The access token for authentication.
 * @returns {Promise<Object>} - A promise that resolves to the GitLab data.
 */
export const fetchAllRepository = async (accessToken) => {
  const apiUrl = buildGitLabApiUrl('', '?membership=true');
  const gitLabData = await requestHandler(apiUrl, 'GET', accessToken);
  return gitLabData;
};

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

  const data = await requestHandler(apiUrl, 'GET', accessToken);
  return data;
};

/**
 * Deletes a repository by ID.
 * @param {number} projectId - The ID of the GitLab project.
 * @param {string} accessToken - The access token for the API request.
 * @returns {Promise<Object>} - The deletion response.
 */
export const deleteRepositoryById = async (projectId, accessToken) => {
  const apiUrl = buildGitLabApiUrl(projectId);
  const deleteResponse = await requestHandler(
    apiUrl,
    'DELETE',
    accessToken,
    true
  );
  return {
    operation: 'delete repository',
    status: deleteResponse.status,
    message: deleteResponse.statusText,
  };
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
    updates,
    false
  );
  return {
    operation: 'update repository',
    status: updateResponse.status,
    message: updateResponse.statusText,
    updates: updates,
  };
};
