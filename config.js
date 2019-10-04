require('dotenv').config();

module.exports = {
  secret: process.env.SECRET,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASS,
  dbHost: process.env.DB_HOST,
  dbPort: process.env.DB_PORT,
  dbName: process.env.DB_NAME,
  corsConfiguration: {
    delimiter: process.env.ORIGIN_DELIMITER || ',',
    allowedOrigins: process.env.ALLOWED_ORIGINS || '*',
    allowedMethods: process.env.ALLOWED_METHODS || '',
    allowedHeaders: process.env.ALLOWED_HEADERS || '',
    exposedHeaders: process.env.EXPOSED_HEADERS || '',
    allowCredentials: (process.env.ALLOW_CREDENTIALS || false) == 'true',
    maxAge: Number.parseInt(process.env.MAX_AGE || 0),
    preflightContinue: (process.env.PREFLIGHT_CONTINUE || false) == 'true',
    responseSuccessCode: Number.parseInt(process.env.OPTIONS_SUCCESS_STATUS_CODE || 204)
  }
};