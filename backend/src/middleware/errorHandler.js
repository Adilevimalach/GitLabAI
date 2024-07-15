import CustomError from './CustomError.js';

class ErrorHandler {
  constructor() {
    this.handlers = {
      OPEN_AUTHORIZATION_URL_ERROR: this.handleAuthorizationUrlError,
      TOKEN_REQUEST_ERROR: this.handleTokenRequestError,
      OAUTH_CALLBACK_ERROR: this.handleOAuthCallbackError,
      REFRESH_TOKEN_ERROR: this.handleRefreshTokenError,
      ENV_CONFIG_MISSING: this.handleEnvConfigMissingError,
      INVALID_CREDENTIALS: this.handleInvalidCredentialsError,
    };
  }

  handleError(error, res = null) {
    if (!error) {
      console.error('Error object is undefined:', error);
      this.handleGenericError(
        res,
        new CustomError(
          'An unexpected error occurred',
          'GENERIC_ERROR',
          500,
          'GenericError',
          {}
        )
      );
      return;
    }

    if (!error.identifier) {
      console.error('Error identifier is missing or undefined:', error);
      this.handleGenericError(res, error);
      return;
    }

    const handler = this.handlers[error.identifier];

    if (handler) {
      handler.call(this, res, error);
    } else {
      this.handleGenericError(res, error);
    }
  }

  handleAuthorizationUrlError(res, error) {
    this.sendResponse(res, 500, {
      message: error.message,
    });
  }

  handleTokenRequestError(res, error) {
    this.sendResponse(res, 500, {
      message: error.message,
    });
  }

  handleOAuthCallbackError(res, error) {
    this.sendResponse(res, 500, {
      message: error.message,
    });
  }

  handleRefreshTokenError(res, error) {
    this.sendResponse(res, 500, {
      message: error.message,
    });
  }

  handleEnvConfigMissingError(res, error) {
    this.sendResponse(res, 500, {
      message: error.message,
    });
  }

  handleInvalidCredentialsError(res, error) {
    this.sendResponse(res, 401, {
      message: error.message,
    });
  }

  handleGenericError(res, error) {
    this.sendResponse(res, 500, {
      message: error.message,
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
