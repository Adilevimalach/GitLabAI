// Description: This file contains the functions for processing user prompts and responses using the OpenAI API.
import { JsonCacheObjects } from '../utils/predefinedObjects.js';
import { requestHandler } from './requestHandler.js';

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
  const editedPrompt = `Based on the user input: "${prompt}", identify the appropriate operation from the options: DELETE_REPOSITORY, UPDATE_REPOSITORY, UPDATE_AFTER_REPOSITORY, MORE_INFO_OPERATION, and MISSING_INFO_OPERATION. Extract relevant details such as project IDs, update fields, or dates from the input to populate the predefined JSON object for the identified operation.

  Predefined operations and their expected data formats are:
  ${predefinedJsonString}`;

  const systemMessage = `You are assigned to analyze the user input to determine the most relevant operation and provide a response using a predefined JSON object. Specifically, if you identify the operation as MORE_INFO_OPERATION, consider the following data sources:

  -'cacheProjectsById' contains project details such as ID, name, description, visibility, and last activity date, aiding in project identification and tracking.

  -'cacheCommitsById' stores commit information, including commit ID, message, timestamp, author details, and changes made, facilitating version control and tracking.

  -'cacheBranchesById' provides details on commits within a project's repository, including commit IDs, messages, timestamps, author details, and more.

  -'cacheContributorsById' includes data on contributors with their commit count, email, names, and the extent of their contributions (additions and deletions), which helps identify key contributors.

  -'cacheMembersById' offers information on project members, such as ID, username, access level, and join date.

  -'cacheTreesById' shows a tree view of the files and directories in a project's repository at a specified commit or branch, aiding in repository navigation.

  -The list of project IDs can be empty, but there should always be at least one valid option in the caches.
  -If a specific project ID is not recognized directly from the user prompt, retrieve and return all pertinent information related to the queried topic.

  -If you found the operation to be UPDATE_REPOSITORY, ensure that the response includes a project id and field to update otherwise response MISSING_INFO_OPERATION with a message about the missing information .

  -If you found the operation to be DELETE_REPOSITORY, ensure that the response includes a project id, otherwise response MISSING_INFO_OPERATION with a message about the missing information .

  -If you found the operation to be UPDATE_AFTER_REPOSITORY look for a date in do by the following:
  Default to the start of a month if the month is given but not the day, and to the beginning of the year if no year is specified, using 2024 as the fallback year.
  otherwise response MISSING_INFO_OPERATION with a message about the missing information  .

  Instructions:
  -Focus your response only on the caches directly relevant to the query, ensuring the highest probability of providing a pertinent answer. Your response should be formatted as JSON, without additional text or markdown formatting.

  -Keep the essence of the instructions intact, ensuring that all essential details are conveyed succinctly. When making an API call to OpenAI, this script should elicit a precise and highly probable response based on the user's query.`;

  const data = {
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: systemMessage },
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
  const dynamicInstructions = `You are an assistant designed to analyze and provide accurate insights based on the provided data. Your task is to answer the user's specific query clearly and completely.Make sure the answer is comprehensive and inclusive answer, if they ask about the amount of something, give an answer that also explains why this is the answer, using the provided data.

  imporntant:
  -If the data you considered is empty, it will return that at the moment they cannot answer.
  -If the data contains a status and a message like NOT FOUND, invaild or missing properties, to complete to user requirements.
  -The user does not understand the numbers of requests and opinions. Formulate his winnings then to a 60-year-old person with no background in computers.

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
