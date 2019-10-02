const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const pug = require('pug');
const app = express();

const connectUri = `mongodb://${config.dbUser}:${config.dbPassword}@${config.dbHost}:${config.dbPort}/${config.dbName}?authSource=admin&w=1`;

mongoose.connect(connectUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/', indexRouter);
app.use('/', usersRouter);

module.exports = app;
