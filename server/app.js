const express = require('express');
const morgan = require('morgan');
const path = require('path');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const session = require('express-session');

const cors = require('cors');
const history = require('connect-history-api-fallback');

require('dotenv').config({ path: __dirname + '/.env' });

const app = express();

app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, '/public')));
app.use(history());
app.use(express.static(path.join(__dirname, '/public')));

app.use(express.json());

app.use(cors());

let { PORT, NODE_ENV, SESSION_LIFETIME, SESSION_NAME, SESSION_SECRET } = process.env;

// Register middleware for express sessions here
app.use(
  session({
    secret: SESSION_SECRET,
    name: SESSION_NAME,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: SESSION_LIFETIME * 1000 * 60 * 60,
      httpOnly: false,
      sameSite: true,
      secure: NODE_ENV === 'production',
    },
  })
);

app.use('/', routes);

app.use(errorHandler);

app.listen(PORT ?? 5000);
