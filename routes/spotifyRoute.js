const express = require('express');
const spotifyController = require('../controllers/spotifyController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.get('/userplaylists', spotifyController.getUserPlaylists);

router.get('/playlist/:playlistId', spotifyController.getPlaylist);

router.get('/playtrack/:trackId', spotifyController.playTrack);

router.get('/currenttrack', spotifyController.getMyCurrentPlayingTrack);

router.get('currenttrackstate', spotifyController.getMyCurrentPlaybackState);

router.get('/handlepauseplay', spotifyController.handlePausePlay);

router.get('/getme', spotifyController.getMe);

module.exports = router;
