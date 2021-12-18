import {
  FastForwardIcon,
  PauseIcon,
  PlayIcon,
  ReplyIcon,
  RewindIcon,
  SwitchHorizontalIcon,
  VolumeUpIcon,
} from '@heroicons/react/solid';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom';

function Player() {
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [volume, setVolume] = useState(50);
  const [songInfo, setSongInfo] = useState(null);

  const fetchCurrentSong = async () => {
    let res = await axios({
      url: '/api/spotify/currenttrack',
      method: 'GET',
    });
    if (res) {
      if (res.data.status === 'success') {
        setIsPlaying(res.data.data.data.is_playing);
        setCurrentTrackId(res.data.data.data.item.id);
        setSongInfo(res.data.data.data.item);
      }
    }

    // res = await axios({
    //   url: '/api/spotify/currenttrackstate',
    //   method: 'GET',
    // });
    // if (res) {
    //   console.log(res);
    // }
  };

  const handlePlayPause = async () => {
    axios({
      url: '/api/spotify/handlepauseplay',
      method: 'GET',
    });
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    fetchCurrentSong();
  }, [currentTrackId]);

  return (
    <div className='h-24 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8'>
      <div className='flex items-center space-x-4'>
        <img
          src={songInfo?.album?.images?.[0]?.url}
          className='hidden md:inline h-10 w-10'
          alt=''
        />
        <div>
          <h3>{songInfo?.name}</h3>
          <p>{songInfo?.artists?.[0]?.name}</p>
        </div>
      </div>

      <div className='flex items-center justify-evenly'>
        <SwitchHorizontalIcon className='button' />
        <RewindIcon className='button' />
        {isPlaying ? (
          <PauseIcon onClick={handlePlayPause} className='button w-10 h-10' />
        ) : (
          <PlayIcon onClick={handlePlayPause} className='button w-10 h-10' />
        )}
        <FastForwardIcon className='button' />
        <ReplyIcon className='button' />
      </div>

      <div className='flex items-center space-x-3 md:space-x-4 justify-end pr-5'>
        <VolumeUpIcon
          className='button'
          onClick={() => {
            volume > 0 && setVolume(volume - 10);
          }}
        />
        <input
          className='w-14 md:w-28'
          value={volume}
          onChange={(e) => {
            setVolume(Number(e.target.value));
          }}
          type='range'
          min={0}
          max={100}
        />
        <VolumeUpIcon
          onClick={() => {
            volume < 100 && setVolume(volume + 10);
          }}
          className='button'
        />
      </div>
    </div>
  );
}

export default Player;
