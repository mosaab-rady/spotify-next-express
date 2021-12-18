const SpotifyWebApi = require('spotify-web-api-node');
// const spotifyApi = require('../lib/spotify');

require('dotenv').config({ path: `${__dirname}/../.env.local` });
// const SpotifyWebApi = require('spotify-web-api-node');
const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;
const state = process.env.JWT_SECRET;

// const spotifyApi = new SpotifyWebApi({
//   clientId: client_id,
//   clientSecret: client_secret,
//   redirectUri: redirect_uri,
// });

exports.spotifyLogin = (req, res, next) => {
  const scope =
    'user-read-email playlist-modify-private playlist-read-collaborative streaming user-read-private user-library-read user-top-read user-read-playback-state user-modify-playback-state user-read-currently-playing user-read-recently-played user-follow-read';

  const query = new URLSearchParams({
    response_type: 'code',
    client_id: client_id,
    scope: scope,
    redirect_uri: redirect_uri,
    state: state,
  });

  res.redirect('https://accounts.spotify.com/authorize?' + query.toString());
};

exports.spotifyLogInCallback = (req, res, next) => {
  const code = req.query.code || null;
  let tokenExpirationEpoch;

  const spotifyApi = new SpotifyWebApi({
    clientId: client_id,
    clientSecret: client_secret,
    redirectUri: redirect_uri,
  });

  spotifyApi.authorizationCodeGrant(code).then(
    function (data) {
      // spotifyApi.setAccessToken(data.body['access_token']);
      // spotifyApi.setRefreshToken(data.body['refresh_token']);

      tokenExpirationEpoch =
        new Date().getTime() / 1000 + data.body['expires_in'];
      res.cookie('access_token', data.body['access_token']);
      res.cookie('refresh_token', data.body['refresh_token']);
      res.cookie('expires_in', data.body['expires_in'] * 1000 + Date.now());
      res.redirect('/');
    },
    function (err) {
      console.error('error :' + err);
    }
  );

  // let numberOfTimesUpdated = 0;

  // setInterval(function () {
  //   console.log(
  //     'Time left: ' +
  //       Math.floor(tokenExpirationEpoch - new Date().getTime() / 1000) +
  //       ' seconds left!'
  //   );

  //   // OK, we need to refresh the token. Stop printing and refresh.
  //   if (++numberOfTimesUpdated > 10) {
  //     clearInterval(this);

  //     // Refresh token and print the new time to expiration.
  //     spotifyApi.refreshAccessToken().then(
  //       function (data) {
  //         tokenExpirationEpoch =
  //           new Date().getTime() / 1000 + data.body['expires_in'];
  //         console.log(
  //           'Refreshed token. It now expires in ' +
  //             Math.floor(tokenExpirationEpoch - new Date().getTime() / 1000) +
  //             ' seconds!'
  //         );
  //       },
  //       function (err) {
  //         console.log('Could not refresh the token!', err.message);
  //       }
  //     );
  //   }
  // }, 1000 * 60);
};

exports.protect = (req, res, next) => {
  const accessToken = req.cookies.access_token;
  const refreshToken = req.cookies.refresh_token;
  const expiresIn = req.cookies.expires_in;

  if (accessToken) {
    const spotifyApi = new SpotifyWebApi({
      clientId: client_id,
      clientSecret: client_secret,
    });

    spotifyApi.setAccessToken(accessToken);
    spotifyApi.setRefreshToken(refreshToken);

    if (Date.now() > expiresIn) {
      spotifyApi.refreshAccessToken().then(
        function (data) {
          console.log(data.body.access_token);
          spotifyApi.setAccessToken(data.body.access_token);
          res.cookie('access_token', data.body.access_token);
          res.cookie('expires_in', data.body.expires_in * 1000 + Date.now());
          console.log('The access token has been refreshed!');
          req.spotifyApi = spotifyApi;
          return next();
        },

        function (err) {
          console.log('Could not refresh the token!', err.message);
          return res.status(401).json({
            status: 'error',
            message: 'You are not logged in please log in to get access.',
          });
        }
      );
    }

    req.spotifyApi = spotifyApi;
    return next();
  } else {
    return res.status(401).json({
      status: 'error',
      message: 'You are not logged in please log in to get access.',
    });
  }
};

exports.logout = (req, res, next) => {
  res.cookie('access_token', 'loggedout', { expires: new Date(Date.now()) });
  res.cookie('refresh_token', 'loggedout', { expires: new Date(Date.now()) });
  res.cookie('expires_in', 'loggedout', { expires: new Date(Date.now()) });
  res.status(200).json({
    status: 'success',
    data: 'logged out successfully.',
  });
};

exports.protectHomePage = (req, res, next) => {
  if (req.path === '/') {
    const token = req.cookies.access_token;
    if (!token) {
      console.log('No token');
      return res.redirect('/login');
    } else {
      console.log('token exist');
      next();
    }
  }
  next();
};
