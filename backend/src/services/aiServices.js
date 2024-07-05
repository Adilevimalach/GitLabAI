// Description: This file contains the functions for processing user prompts and responses using the OpenAI API.
import { predefinedJsonObjects } from '../utils/predefinedObjects.js';
import { requestHandler } from './requestHandler.js';

/**
 * Performs an OpenAI request using the provided API URL, API key, and request data.
 * @param {string} apiUrl - The URL of the OpenAI API.
 * @param {string} apiKey - The API key for authentication.
 * @param {Object} requestData - The data to be sent in the request.
 * @param {boolean} [expectJsonResponse=true] - Indicates whether to expect a JSON response. Default is true.
 * @returns {Promise<Object|string>} - A promise that resolves to the parsed JSON response (if expectJsonResponse is true),
 * or the response content as a string (if expectJsonResponse is false).
 * @throws {Error} - If there is an error performing the request or parsing the JSON response.
 */
const performOpenAIRequest = async (
  apiUrl,
  apiKey,
  requestData,
  expectJsonResponse = true
) => {
  try {
    const response = await requestHandler(apiUrl, 'POST', apiKey, requestData);
    const responseContent = response.choices[0].message.content.trim();

    if (expectJsonResponse) {
      try {
        return JSON.parse(responseContent);
      } catch (parseError) {
        //TODO: create custom error massage as did before
        throw new Error(`Failed to parse JSON response: ${parseError.message}`);
      }
    } else {
      return responseContent;
    }
  } catch (error) {
    throw error;
  }
};

/**
 * Processes the prompt using the GPT-3.5-turbo model and returns the response.
 * @param {string} prompt - The user input prompt.
 * @param {string} apiKey - The API key for OpenAI.
 * @returns {Promise} - A promise that resolves to the response from OpenAI.
 */
export const processPromptGPT = async (prompt, apiKey) => {
  const predefinedJsonString = JSON.stringify(predefinedJsonObjects, null, 2);

  const editedPrompt = `User Input: ${prompt}

Task: Identify which CRUD operation the user wants to perform from the following predefined operations: FETCH_UPDATED_REPOSITORIES, FETCH_REPOSITORY_BY_ID, DELETE_REPOSITORY, UPDATE_REPOSITORY, and OPERATION_NOT_SUPPORTED. Based on the identified operation, return the corresponding predefined JSON object for that operation. Ensure that the returned JSON object includes only the fields that have non-empty values.

Here are the predefined JSON objects:
${predefinedJsonString}`;

  const systemMessage = `You are an assistant that returns only the predefined JSON objects based on user requests. Here are the predefined objects: ${predefinedJsonString}`;

  const data = {
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: systemMessage },
      { role: 'user', content: editedPrompt },
    ],
    max_tokens: 150,
    temperature: 0,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  };

  const url = 'https://api.openai.com/v1/chat/completions';
  return performOpenAIRequest(url, apiKey, data, true);
};

/**
 * Process the response using the GPT model.
 *
 * @param {string} prompt - The user's query prompt.
 * @param {object} dataJson - The JSON data to be used for analysis.
 * @param {string} apiKey - The API key for accessing the OpenAI API.
 * @returns {Promise<object>} - The response from the OpenAI API.
 */
export const processResponseGPT = async (prompt, dataJson, apiKey) => {
  // Convert the dataJson to a formatted JSON string
  const formattedDataJson = JSON.stringify(dataJson, null, 2);
  const dynamicInstructions = `
  You are an assistant designed to analyze and provide accurate insights based on the provided data. Your task is to answer the user's specific query clearly and completely, using the fields in the provided data.

  - If the data contains relevant information, generate a user-friendly and complete message based on the user's query.
  - If the data contains an "error" field or it doesn't have the relevant information, generate a user-friendly message based on the error information provided. Do not simply repeat the error message from the data. Instead, use it to provide a clear and helpful response to the user.
  - Ensure you answer the user prompt and do not use the word "JSON" in your response.

  Provided Data:
  ${formattedDataJson}

  User Prompt:
  ${prompt}

  Provide a complete response to the user based on the provided data.
`;
  // const dynamicInstructions = `
  //   You are an assistant designed to analyze and provide accurate insights based on the provided JSON data. Use the fields in the JSON object to answer the user's specific query in a clear and helpful manner.
  //   Generate a user-friendly message based on the provided data.
  //   If the JSON data contains an "error" field, generate a user-friendly message based on the error information provided. Do not simply repeat the error message from the JSON. Instead, use it to provide a clear and helpful response to the user.

  //   JSON Data:
  //   ${formattedDataJson}

  //   User Prompt:
  //   ${prompt}
  // `;

  const messages = [
    {
      role: 'system',
      content: dynamicInstructions,
    },
    { role: 'user', content: prompt },
  ];
  // Prepare the data for the OpenAI API call
  const data = {
    model: 'gpt-3.5-turbo',
    messages: messages,
    max_tokens: 150,
    temperature: 0.5,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stop: ['\n', 'Data:'],
  };

  // Define the OpenAI API endpoint URL
  const url = 'https://api.openai.com/v1/chat/completions';

  // Make the API request and return the response
  return performOpenAIRequest(url, apiKey, data, false);
};
