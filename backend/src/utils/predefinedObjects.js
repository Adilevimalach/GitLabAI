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
    operation: 'MISSING_INFO_OPERATION',
    message:
      'Missing information for the operation. Please provide the required parameters.',
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
  Total without user prompt: ~1000 tokens

**Cost Calculation Example:**
1.Cost per Token:
  $0.002 per 2000 tokens,Hence, $0.000004 per token. 
  
2.Token Usage:
  System Message (predefined objects + fields): 700 tokens
  Additional settings and structural information: 100 tokens
  Total without user prompt: 800 tokens
  Cost Calculation per Component:
  System Message Cost: 1400 tokens × $0.000002 = $0.0028
  Additional Settings Cost: 200 tokens × $0.000002 = $0.0004
  Total Cost per API Call (Send + Response): (1500 tokens × $0.000002) = $0.0032

  ***NOTICE: User prompt not included in the calculation above.***
*/
