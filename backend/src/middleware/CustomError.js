// /**
//  * Represents a custom error with additional properties for handling and debugging.
//  *
//  * @class CustomError
//  * @extends Error
//  * @param {string} message - The error message.
//  * @param {number|null} [status=null] - The HTTP status code or custom status identifier.
//  * @param {string|null} [type=null] - The type of operation (e.g., 'FileRead', 'FileWrite', 'Network', etc.).
//  * @param {Object} [context={}] - Additional context-specific information.
//  * @param {string|null} [filePath=null] - The path of the file involved in the error (for file operations).
//  * @param {string|null} [url=null] - The URL related to the error (for network/API errors).
//  * @param {string|null} [method=null] - The HTTP method used (for network/API errors).
//  * @param {string|null} [response=null] - The full response text or body (for network/API errors).
//  * @param {string|null} [code=null] - The specific error code, which can be custom or predefined (e.g., 'ENOENT' for file not found).
//  */
// class CustomError extends Error {
//   constructor(
//     message,
//     status = null,
//     type = null,
//     context = {},
//     filePath = null,
//     url = null,
//     method = null,
//     response = null,
//     code = null
//   ) {
//     super(message);
//     this.status = status; // HTTP status code or custom status identifier
//     this.type = type; // Type of operation (e.g., 'FileRead', 'FileWrite', 'Network', etc.)
//     this.context = context; // Additional context-specific information
//     this.filePath = filePath; // Path of the file involved in the error (for file operations)
//     this.url = url; // URL related to the error (for network/API errors)
//     this.method = method; // HTTP method used (for network/API errors)
//     this.response = response; // Full response text or body (for network/API errors)
//     this.stack = this.stack; // Stack trace of the error, useful for debugging
//     this.code = code; // Specific error code, which can be custom or predefined (e.g., 'ENOENT' for file not found)
//   }
// }

// export default CustomError;
/**
 * Represents a custom error with additional properties for handling and debugging.
 *
 * @class CustomError
 * @extends Error
 * @param {string} message - The error message.
 * @param {number|null} [status=null] - The HTTP status code or custom status identifier.
 * @param {string|null} [type=null] - The type of operation (e.g., 'FileRead', 'FileWrite', 'Network', etc.).
 * @param {Object} [context={}] - Additional context-specific information.
 */
class CustomError extends Error {
  constructor(err, identifier, status = null, type = null, context = {}) {
    super(message);

    this.identifier = identifier;
    this.status = status || (err && err.status) || null;
    this.type = type || (err && err.type) || null;
    this.context = context || (err && err.context) || {};
    this.stack = (err && err.stack) || this.stack;
  }
}

export default CustomError;
