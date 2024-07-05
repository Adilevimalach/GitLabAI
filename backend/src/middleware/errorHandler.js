// class ErrorHandler {
//   constructor() {
//     this.handlers = {
//       FileReadError: this.handleFileReadError,
//       FileWriteError: this.handleFileWriteError,
//       JSONParseError: this.handleJSONParseError,
//       NetworkError: this.handleNetworkError,
//       OAuthCallbackError: this.handleOAuthCallbackError,
//       AuthorizationUrlError: this.handleAuthorizationUrlError,
//       ServerError: this.handleServerError,
//       EnvConfigMissing: this.handleEnvConfigMissingError,
//       TokenExpiredError: this.handleTokenExpiredError,
//       LoadEnvError: this.handleLoadEnvError,
//       LoadDynamicConfigError: this.handleLoadDynamicConfigError,
//       OAuthFlowError: this.handleOAuthFlowError,
//       RefreshTokenError: this.handleRefreshTokenError,
//       APIError: this.handleAPIRequestError,
//       ConfigError: this.handleConfigError,
//       // Add other custom error types as needed
//     };
//   }

//   handleError(res = null, error) {
//     // console.log('Handling error:', error); // Add this line for logging
//     const handler = this.handlers[error.type];
//     if (handler) {
//       handler.call(this, res, error);
//     } else {
//       this.handleGenericError(res, error);
//     }
//   }

//   handleFileReadError(res, error) {
//     res.writeHead(500, { 'Content-Type': 'application/json' });
//     res.end(
//       JSON.stringify({
//         message: `Failed to read file at ${error.filePath}: ${error.message}`,
//         context: error.context,
//       })
//     );
//   }

//   handleFileWriteError(res, error) {
//     res.writeHead(500, { 'Content-Type': 'application/json' });
//     res.end(
//       JSON.stringify({
//         message: `Failed to write file at ${error.filePath}: ${error.message}`,
//         context: error.context,
//       })
//     );
//   }

//   handleJSONParseError(res, error) {
//     res.writeHead(400, { 'Content-Type': 'application/json' });
//     res.end(
//       JSON.stringify({
//         message: `Failed to parse JSON string: ${error.context.originalBody}`,
//         error: error.message,
//       })
//     );
//   }

//   handleNetworkError(res, error) {
//     res.writeHead(500, { 'Content-Type': 'application/json' });
//     res.end(
//       JSON.stringify({
//         message: `Network error while accessing ${error.url}: ${error.message}`,
//         context: error.context,
//       })
//     );
//   }

//   handleOAuthCallbackError(res, error) {
//     res.writeHead(500, { 'Content-Type': 'application/json' });
//     res.end(
//       JSON.stringify({
//         message: `Error during OAuth callback: ${error.message}`,
//         context: error.context,
//       })
//     );
//   }

//   handleAuthorizationUrlError(res, error) {
//     res.writeHead(500, { 'Content-Type': 'application/json' });
//     res.end(
//       JSON.stringify({
//         message: `Error opening authorization URL: ${error.message}`,
//         context: error.context,
//       })
//     );
//   }

//   handleServerError(res, error) {
//     res.writeHead(500, { 'Content-Type': 'application/json' });
//     res.end(
//       JSON.stringify({
//         message: `Server error: ${error.message}`,
//         context: error.context,
//       })
//     );
//   }

//   handleEnvConfigMissingError(res, error) {
//     res.writeHead(500, { 'Content-Type': 'application/json' });
//     res.end(
//       JSON.stringify({
//         message: 'Environment variables are missing',
//         context: error.context,
//       })
//     );
//   }

//   handleTokenExpiredError(res, error) {
//     res.writeHead(401, { 'Content-Type': 'application/json' });
//     res.end(
//       JSON.stringify({
//         message: 'Access token is expired',
//         context: error.context,
//       })
//     );
//   }

//   handleLoadEnvError(res, error) {
//     res.writeHead(500, { 'Content-Type': 'application/json' });
//     res.end(
//       JSON.stringify({
//         message: `Error loading environment variables: ${error.message}`,
//         context: error.context,
//       })
//     );
//   }

//   handleLoadDynamicConfigError(res, error) {
//     res.writeHead(500, { 'Content-Type': 'application/json' });
//     res.end(
//       JSON.stringify({
//         message: `Error loading dynamic configuration: ${error.message}`,
//         context: error.context,
//       })
//     );
//   }

//   handleOAuthFlowError(res, error) {
//     res.writeHead(500, { 'Content-Type': 'application/json' });
//     res.end(
//       JSON.stringify({
//         message: `Error during OAuth flow: ${error.message}`,
//         context: error.context,
//       })
//     );
//   }

//   handleRefreshTokenError(res, error) {
//     res.writeHead(500, { 'Content-Type': 'application/json' });
//     res.end(
//       JSON.stringify({
//         message: `Error refreshing access token: ${error.message}`,
//         context: error.context,
//       })
//     );
//   }

//   handleAPIRequestError(res, error) {
//     res.writeHead(500, { 'Content-Type': 'application/json' });
//     res.end(
//       JSON.stringify({
//         message: `API request error while accessing ${error.url}: ${error.message}`,
//         context: error.context,
//       })
//     );
//   }

//   handleConfigError(res, error) {
//     res.writeHead(500, { 'Content-Type': 'application/json' });
//     res.end(
//       JSON.stringify({
//         message: `Configuration file error at ${error.filePath}: ${error.message}`,
//         context: error.context,
//       })
//     );
//   }

//   handleGenericError(res, error) {
//     res.writeHead(500, { 'Content-Type': 'application/json' });
//     res.end(
//       JSON.stringify({
//         message: 'An unexpected error occurred',
//         error: error.message,
//         context: error.context,
//       })
//     );
//   }
// }

// export default new ErrorHandler();

import CustomError from './CustomError.js';
class ErrorHandler {
  constructor() {
    this.handlers = {
      FileReadError: this.handleFileReadError,
      FileWriteError: this.handleFileWriteError,
      JSONParseError: this.handleJSONParseError,
      NetworkError: this.handleNetworkError,
      OAuthCallbackError: this.handleOAuthCallbackError,
      AuthorizationUrlError: this.handleAuthorizationUrlError,
      ServerError: this.handleServerError,
      EnvConfigMissing: this.handleEnvConfigMissingError,
      TokenExpiredError: this.handleTokenExpiredError,
      LoadEnvError: this.handleLoadEnvError,
      LoadDynamicConfigError: this.handleLoadDynamicConfigError,
      OAuthFlowError: this.handleOAuthFlowError,
      RefreshTokenError: this.handleRefreshTokenError,
      APIError: this.handleAPIRequestError,
      ConfigError: this.handleConfigError,
      // Add other custom error types as needed
    };
  }

  handleError(error, res = null) {
    if (!error) {
      console.error('Error object is undefined:', error);
      this.handleGenericError(
        res,
        new CustomError('An unexpected error occurred', 500, 'GenericError', {})
      );
      return;
    }

    if (!error.type) {
      console.error('Error type is missing or undefined:', error);
      this.handleGenericError(res, error);
      return;
    }

    const handler = this.handlers[error.type];
    if (handler) {
      handler.call(this, res, error);
    } else {
      this.handleGenericError(res, error);
    }
  }

  handleFileReadError(_, error) {
    console.error(`Failed to read file at ${error.filePath}: ${error.message}`);
    // Additional logging or notification logic can go here
  }

  handleFileWriteError(_, error) {
    console.error(
      `Failed to write file at ${error.filePath}: ${error.message}`
    );
    // Additional logging or notification logic can go here
  }

  handleJSONParseError(error) {
    console.error(
      `Failed to parse JSON string: ${error.context.originalBody}`,
      error.message
    );
    // Additional logging or notification logic can go here
  }

  handleNetworkError(res, error) {
    console.error(
      `Network error while accessing ${error.url}: ${error.message}`
    );
    this.sendResponse(res, 500, {
      message: `Network error while accessing ${error.url}: ${error.message}`,
      context: error.context,
    });
  }

  handleOAuthCallbackError(_, error) {
    console.error(`Error during OAuth callback: ${error.message}`);
    // Additional logging or notification logic can go here
  }

  handleAuthorizationUrlError(_, error) {
    console.error(`Error opening authorization URL: ${error.message}`);
    // Additional logging or notification logic can go here
  }

  handleServerError(res, error) {
    this.sendResponse(res, 500, {
      message: `Server error: ${error.message}`,
      context: error.context,
    });
  }

  handleEnvConfigMissingError(res, error) {
    this.sendResponse(res, 500, {
      message: 'Environment variables are missing',
      context: error.context,
    });
  }

  handleTokenExpiredError(res, error) {
    this.sendResponse(res, 401, {
      message: 'Access token is expired',
      context: error.context,
    });
  }

  handleLoadEnvError(_, error) {
    console.error('Error loading environment variables:', error.message);
    // Additional logging or notification logic can go here
  }

  handleLoadDynamicConfigError(_, error) {
    console.error('Error loading dynamic configuration:', error.message);
    // Additional logging or notification logic can go here
  }

  handleOAuthFlowError(_, error) {
    console.error('Error during OAuth flow:', error.message);
    // Additional logging or notification logic can go here
  }

  handleRefreshTokenError(_, error) {
    console.error('Error refreshing access token:', error.message);
    // Additional logging or notification logic can go here
  }

  handleAPIRequestError(_, error) {
    console.error(
      `API request error while accessing ${error.url}: ${error.message}`
    );
    // Additional logging or notification logic can go here
  }

  handleConfigError(_, error) {
    console.error(
      `Configuration file error at ${error.filePath}: ${error.message}`
    );
    // Additional logging or notification logic can go here
  }

  handleGenericError(res, error) {
    this.sendResponse(res, 500, {
      message: 'An unexpected error occurred',
      error: error.message,
      context: error.context,
    });
  }

  sendResponse(res, statusCode, errorResponse) {
    if (res) {
      res.writeHead(statusCode, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(errorResponse));
    } else {
      console.error('No response object provided:', errorResponse);
    }
  }
}

export default new ErrorHandler();
