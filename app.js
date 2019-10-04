const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

const config = require('./config');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const publicationsRouter = require('./routes/publications');
const offerRouter = require('./routes/offers');
const authRouter = require('./routes/auth');

const app = express();

const connectUri = `mongodb://${config.dbUser}:${config.dbPassword}@${config.dbHost}:${config.dbPort}/${config.dbName}?authSource=admin&w=1`;

mongoose.connect(connectUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// enable CORS policy for a select few origins
// only the origin option is required, the rest are optional
app.use(cors({ 
  origin: config.corsConfiguration.allowedOrigins.split(config.corsConfiguration.delimiter),
  methods: config.corsConfiguration.allowedMethods,
  allowedHeaders: config.corsConfiguration.allowedHeaders,
  exposedHeaders: config.corsConfiguration.exposedHeaders,
  credentials: config.corsConfiguration.allowCredentials,
  maxAge: config.corsConfiguration.maxAge,
  preflightContinue: config.corsConfiguration.preflightContinue,
  optionsSuccessStatus: config.corsConfiguration.responseSuccessCode
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/publications', publicationsRouter);
app.use('/offers', offerRouter);
app.use('/auth', authRouter);

module.exports = app;
