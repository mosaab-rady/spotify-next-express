// require('dotenv').config({ path: `${__dirname}/../.env.local` });
// const SpotifyWebApi = require('spotify-web-api-node');
// const client_id = process.env.SPOTIFY_CLIENT_ID;
// const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

// const spotifyApi = require('../lib/spotify');

// const spotifyApi = new SpotifyWebApi({
//   clientId: client_id,
//   clientSecret: client_secret,
// });

exports.getUserPlaylists = (req, res, next) => {
  const spotifyApi = req.spotifyApi;
  if (spotifyApi.getAccessToken()) {
    spotifyApi
      .getUserPlaylists()
      .then((data) => {
        res.status(200).json({
          status: 'success',
          data: {
            data: data.body.items,
          },
        });
      })
      .catch((err) => {
        console.error('something is wrong: ' + err);
      });
  } else {
    next();
  }
};

exports.getMe = (req, res, next) => {
  const spotifyApi = req.spotifyApi;

  if (spotifyApi.getAccessToken()) {
    spotifyApi
      .getMe()
      .then((data) => {
        return res.status(200).json({
          status: 'success',
          data: {
            data: data.body,
          },
        });
      })
      .catch((err) => {
        console.error('something is wrong: ' + err);
      });
  } else {
    next();
  }
};

exports.getPlaylist = (req, res, next) => {
  const spotifyApi = req.spotifyApi;

  const { playlistId } = req.params;
  spotifyApi
    .getPlaylist(playlistId)
    .then((data) => {
      res.status(200).json({
        status: 'success',
        data: {
          data: data.body,
        },
      });
    })
    .catch((err) => {
      console.log('something went wrong!! ' + err);
      next();
    });
};

exports.playTrack = (req, res, next) => {
  const spotifyApi = req.spotifyApi;
  const { trackUri } = req.params;
  try {
    spotifyApi.play({
      uris: [trackUri],
    });
    next();
  } catch (error) {
    console.log('something went wrong!! ' + err);
    next();
  }
};

exports.handlePausePlay = (req, res, next) => {
  try {
    const spotifyApi = req.spotifyApi;
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (data.body?.is_playing) {
        spotifyApi.pause();
      } else {
        spotifyApi.play();
      }
    });
    next();
  } catch (error) {
    res.status(400).json({
      data: 'error',
      message: error?.message,
    });
  }
};

exports.getMyCurrentPlayingTrack = async (req, res, next) => {
  try {
    const spotifyApi = req.spotifyApi;
    spotifyApi.getMyCurrentPlayingTrack().then((data) => {
      console.log(`Now playing ${data.body?.item.name}`);
      res.status(200).json({
        status: 'success',
        data: {
          data: data.body,
        },
      });
    });
  } catch (error) {
    res.status(400).status({
      status: 'error',
      message: error.message,
    });
  }
};

exports.getMyCurrentPlaybackState = async (req, res, next) => {
  try {
    const spotifyApi = req.spotifyApi;
    await spotifyApi.getMyCurrentPlaybackState().then((data) => {
      res.status(200).json({
        status: 'success',
        data: {
          data: data.body?.is_playing,
        },
      });
    });
  } catch (error) {
    res.status(400).status({
      status: 'error',
      message: error.message,
    });
  }
};
