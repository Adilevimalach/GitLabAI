/**
 * Predefined JSON cache objects.
 * @typedef {Object} JsonCacheObject
 * @property {string} operation - The operation to be performed.
 * @property {Object} parameters - The parameters required for the operation.
 */

/**
 * Array of predefined JSON cache objects.
 * @type {JsonCacheObject[]}
 */
export const JsonCacheObjects = [
  {
    operation: 'DELETE_REPOSITORY',
    parameters: {
      projectId: '',
    },
  },
  {
    operation: 'UPDATE_REPOSITORY',
    parameters: {
      projectId: '',
      updates: {
        name: '',
        description: '',
        visibility: '',
      },
    },
  },
  {
    operation: 'UPDATE_AFTER_REPOSITORY',
    parameters: {
      updated_at: '',
    },
  },
  {
    operation: 'MORE_INFO_OPERATION',
    parameters: {
      projectIds: [''],
      caches: [
        'cacheProjectsById',
        'cacheCommitById',
        'cacheBranchesById',
        'cacheContributorsById',
        'cacheMemberById',
        'cacheTreesById',
      ],
    },
  },

  {
    operation: 'APP_INFO',
    message:
      'I am an intelligent assistant designed to analyze and provide accurate insights based on provided data. I support various operations, including: Providing detailed project, commit, branch, contributor, member, and repository data. Updating repository metadata and Deleting repositories. I make complex information understandable and ensure responses are comprehensive.',
  },
];

/**
 * Predefined prompt for the GPT system message.
 * This prompt is used to analyze user input and determine the most relevant operation,
 * providing a response using a predefined JSON object.
 * The response should be formatted as JSON, without additional text or markdown formatting.
 *
 * @type {string}
 */
export const preDefinedPromptGPTSystemMessage = `You are assigned to analyze the user input to determine the most relevant operation and provide a response using a predefined JSON object. Specifically, if you identify the operation as:
 MORE_INFO_OPERATION:

  -'cacheProjectsById' contains all projects details such as ID, name, description, visibility, and last activity date, aiding in project identification and tracking.
  -'cacheCommitsById' stores all commits information, including commit ID, message, timestamp, author details, and changes made, facilitating version control and tracking.
  -'cacheBranchesById' provides details on all branchs within a commit within project's repository, including commit IDs, messages, timestamps, author details, and more.
  -'cacheContributorsById' includes data on contributors with their commit count, email, names, and the extent of their contributions (additions and deletions), which helps identify key contributors.
  -'cacheMembersById' offers information on project members, such as ID, username, access level, and join date.
  -'cacheTreesById' shows a tree view of the files and directories in a project's repository at a specified commit or branch, aiding in repository navigation.
  -The list of project IDs can be empty, but there should always be at least one valid option in the caches.
  -If a specific project ID is not recognized directly from the user prompt, retrieve and return all pertinent information related to the queried topic.

  UPDATE_REPOSITORY:
   update repository by id,ensure that the response includes a project ID and field to update; otherwise, respond with MISSING_INFO_OPERATION with a message about the missing information.

  DELETE_REPOSITORY:
  delete repository by id,ensure that the response includes a project ID; otherwise, respond with MISSING_INFO_OPERATION with a message about the missing information.

  UPDATE_AFTER_REPOSITORY:
  serach project updated after exact date, look for a date and do the following:
  Default to the start of a month if the month is given but not the day, and to the beginning of the year if no year is specified, using 2024 as the fallback year.
  Otherwise, respond with MISSING_INFO_OPERATION with a message about the missing information.

  APP_INFO:
  provide information about the application's capabilities and purpose, including the supported operations and the ability to make complex information understandable and comprehensive.

  Instructions:
  -Focus your response only on the caches directly relevant to the query, ensuring the highest probability of providing a pertinent answer. Your response should be formatted as JSON, without additional text or markdown formatting.

  -Keep the essence of the instructions intact, ensuring that all essential details are conveyed succinctly. When making an API call to OpenAI, this script should elicit a precise and highly probable response based on the user's query.`;
