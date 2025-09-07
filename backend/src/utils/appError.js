class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // indicates it's a trusted error. Continues in errorHandler.js
  }
}

module.exports = AppError;
