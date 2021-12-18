const express = require('express');
const next = require('next');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authController = require('./controllers/authController');
require('dotenv').config({ path: `${__dirname}/.env.local` });
const spotifyRoute = require('./routes/spotifyRoute');

const dev = process.env.NODE_ENV !== 'production';

const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  const app = express();

  app.use(cors());
  app.options('*', cors());

  if (process.env.NODE_ENV === 'development') {
    const morgan = require('morgan');
    app.use(morgan('dev'));
  }

  // parse json,cookie and url
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));
  app.use(cookieParser());

  app.get('/api/login/spotify', authController.spotifyLogin);
  app.get('/api/logout/spotify', authController.logout);
  app.get('/api/login/callback', authController.spotifyLogInCallback);

  app.use('/api/spotify', spotifyRoute);

  app.use('/login', (req, res) => {
    nextApp.render(req, res, '/login');
  });

  app.use('/', authController.protectHomePage, (req, res) => {
    nextApp.render(req, res, '/');
  });

  app.use('*', (req, res) => {
    return handle(req, res);
  });

  const port = process.env.PORT || 5000;

  app.listen(port, (err) => {
    if (err) {
      console.error(err);
    }
    console.log(`app running on port ${port}....`);
  });
});
