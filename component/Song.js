import axios from 'axios';
import { useRecoilState } from 'recoil';
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom';
import { millisToSeconds } from '../lib/time';

function Song({ order, song }) {
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);

  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

  const playSong = () => {
    setCurrentTrackId(song.track.id);
    setIsPlaying(true);
    axios({
      url: `/api/spotify/playtrack/:${song.track.uri}`,
      method: 'GET',
    });
  };

  return (
    <div
      onClick={playSong}
      className='text-gray-500 grid grid-cols-2 py-4 px-4 hover:bg-gray-900 rounded-lg cursor-pointer'
    >
      <div className='flex items-center space-x-4'>
        <p>{order}</p>
        <img
          className='w-10 h-10'
          src={song.track.album.images[0].url}
          alt=''
        />
        <div>
          <p className='text-white '>{song.track.name}</p>
          <p>{song.track.artists[0].name}</p>
        </div>
      </div>

      <div className='flex items-center justify-between ml-auto md:ml-0'>
        <p className='hidden md:inline'>{song.track.album.name}</p>
        <p>{millisToSeconds(song.track.duration_ms)}</p>
      </div>
    </div>
  );
}

export default Song;
