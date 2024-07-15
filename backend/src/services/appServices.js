import { requestHandler } from './requestHandler.js';
import {
  JsonCacheObjects,
  preDefinedPromptGPTSystemMessage,
} from '../utils/predefinedObjects.js';

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

/**
 * Performs an OpenAI request.
 *
 * @param {string} apiUrl - The URL of the OpenAI API.
 * @param {string} apiKey - The API key for authentication.
 * @param {Object} requestData - The data to be sent in the request.
 * @param {boolean} [expectJsonResponse=true] - Indicates whether to expect a JSON response.
 * @returns {Promise<Object|string>} - The response from the OpenAI API.
 * @throws {Error} - If there is an error performing the request or parsing the response.
 */
const performOpenAIRequest = async (
  apiUrl,
  apiKey,
  requestData,
  expectJsonResponse = true
) => {
  return requestHandler(apiUrl, 'POST', apiKey, requestData)
    .then((response) => {
      const responseContent = response.body.choices[0].message.content.trim();
      if (!expectJsonResponse) return responseContent;
      try {
        return JSON.parse(responseContent);
      } catch (parseError) {
        throw new Error(`Failed to parse JSON response: ${parseError.message}`);
      }
    })
    .catch((error) => {
      throw new Error(`Error performing the API request: ${error.message}`);
    });
};

/**
 * Processes the user prompt using the GPT-3.5-turbo model and caches the response.
 * @param {string} prompt - The user prompt to process.
 * @param {string} apiKey - The API key for accessing the OpenAI service.
 * @returns {Promise} - A promise that resolves to the response from the OpenAI service.
 */
export const processPromptGPTToCache = async (prompt, apiKey) => {
  const predefinedJsonString = JSON.stringify(JsonCacheObjects);

  const editedPrompt = `Based on the user input: "${prompt}", identify the appropriate operation from the options: DELETE_REPOSITORY, UPDATE_REPOSITORY, UPDATE_AFTER_REPOSITORY, MORE_INFO_OPERATION, APP_INFO, and MISSING_INFO_OPERATION. Extract relevant details such as project IDs, update fields, or dates from the input to populate the predefined JSON object for the identified operation.

  Predefined operations and their expected data formats are:
  ${predefinedJsonString}`;

  const data = {
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: preDefinedPromptGPTSystemMessage },
      { role: 'user', content: editedPrompt },
    ],
    max_tokens: 200,
    temperature: 0,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  };

  const url = 'https://api.openai.com/v1/chat/completions';
  return await performOpenAIRequest(url, apiKey, data, true);
};

export const processResponseGPT = async (prompt, dataString, apiKey) => {
  const dynamicInstructions = `You are an assistant designed to analyze and provide accurate insights based on the provided data. Your task is to answer the user's specific query clearly and completely. Make sure the answer is comprehensive and inclusive. If they ask about the amount of something, give an answer that also explains why this is the answer, using the provided data.

  Important:
  - If the data you considered is empty, inform the user that at the moment you cannot answer.
  - If the data contains a status and a message like NOT FOUND, invalid, or missing properties, inform the user and explain what is needed to complete their requirements.
  - The user does not understand technical jargon. Formulate your response as if explaining to a 60-year-old person with no background in computers.

  Provided Data:
  ${dataString}

  User Prompt:
  ${prompt}`;

  const messages = [
    { role: 'system', content: dynamicInstructions },
    { role: 'user', content: prompt },
  ];

  const data = {
    model: 'gpt-3.5-turbo',
    messages: messages,
    max_tokens: 300,
    temperature: 0.5,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  };

  const url = 'https://api.openai.com/v1/chat/completions';
  return await performOpenAIRequest(url, apiKey, data, false);
};
