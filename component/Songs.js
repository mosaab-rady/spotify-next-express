import { useRecoilValue } from 'recoil';
import { playlistState } from '../atoms/playlistAtom';
import Song from './Song';

function Songs() {
  const playlist = useRecoilValue(playlistState);
  return (
    <div className='px-10 flex flex-col space-y-1'>
      {playlist?.tracks?.items?.map((song, i) => {
        return <Song key={song.track.id} order={i + 1} song={song} />;
      })}
    </div>
  );
}

export default Songs;
