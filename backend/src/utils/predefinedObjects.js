/**
 * Array of predefined JSON objects.
 * @type {Array<Object>}
 */
export const predefinedJsonObjects = [
  {
    operation: 'FETCH_UPDATED_REPOSITORIES',
    parameters: {
      updatedAfter: 'YYYY-MM-DD',
    },
  },
  {
    operation: 'FETCH_REPOSITORY_BY_ID',
    parameters: {
      projectId: 123456,
    },
  },
  {
    operation: 'DELETE_REPOSITORY',
    parameters: {
      projectId: 123456,
    },
  },
  {
    operation: 'UPDATE_REPOSITORY',
    parameters: {
      projectId: 123456,
      updates: {},
    },
  },
  {
    operation: 'OPERATION_NOT_SUPPORTED',
    parameters: {
      error: 'Missing information in the request',
      opertionSupported: [
        'fetch update repositories',
        'fetch repository by id',
        'delete repository',
        'update repository',
      ],
    },
  },
];

/*

**Token Calculation Example:**
1.System Message (Includes predefinedJsonObjects and repositoryFields):
  predefinedJsonObjects:
    This object includes several operations, each with parameters and potentially fields. If each operation on average is detailed enough, and given there are five operations, we might estimate about 100 tokens per operation as previously mentioned. This would be around 500 tokens for all operations combined.

  repositoryFields: 
    This simpler object describes fields without nesting much data. Given its straightforward descriptions, this could be around 200 tokens.
    Total for System Message: About 700 tokens (as previously calculated).

2.Other Information Sent:
  Configuration settings and role indications ("role: 'system'", "role: 'user'", model configuration details, etc.) typically don't require many tokens, but for the sake of completeness, we could estimate around 50-100 tokens to account for JSON structure, keys, and non-dynamic values included in the API call.
  Worst Case Scenario:
  System Message (predefined objects + fields): 700 tokens
  Additional settings and structural information: 100 tokens
  Total without user prompt: ~800 tokens

**Cost Calculation Example:**
1.Cost per Token:
  $0.002 per 1,000 tokens,Hence, $0.000002 per token. 
  
2.Token Usage:
  System Message (predefined objects + fields): 700 tokens
  Additional settings and structural information: 100 tokens
  Total without user prompt: 800 tokens
  Cost Calculation per Component:
  System Message Cost: 700 tokens × $0.000002 = $0.0014
  Additional Settings Cost: 100 tokens × $0.000002 = $0.0002
  Total Cost per API Call (Send + Response): (800 tokens × $0.000002) = $0.0016

  ***NOTICE: User prompt not included in the calculation above.***
*/
