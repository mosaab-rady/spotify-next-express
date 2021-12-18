import { ChevronDownIcon } from '@heroicons/react/solid';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { playlistIdState, playlistState } from '../atoms/playlistAtom';
import Songs from './Songs';

const colorsRange = [
  'from-red-500',
  'from-blue-500',
  'from-green-500',
  'from-yellow-500',
  'from-orange-500',
  'from-amber-500',
  'from-emerald-500',
];

function Center() {
  const playlistId = useRecoilValue(playlistIdState);
  const [playlist, setPlaylist] = useRecoilState(playlistState);
  const [color, setColor] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (playlistId !== null) {
      axios({
        url: `/api/spotify/playlist/${playlistId}`,
        method: 'GET',
      }).then((res) => {
        if (res.data.status === 'success') {
          setPlaylist(res.data.data.data);
        }
      });
    }
    setColor(colorsRange[Math.floor(Math.random() * colorsRange.length)]);
  }, [playlistId]);

  useEffect(() => {
    axios({
      url: '/api/spotify/getme',
      method: 'GET',
    })
      .then((res) => {
        if (res.data.status === 'success') {
          setUser(res.data.data.data);
        }
      })
      .then((res) => {
        if (res) {
          if (res.data.status === 'success') {
            ro;
          }
        }
      });
  }, []);

  const signOut = () => {
    axios({
      url: '/api/logout/spotify',
      method: 'GET',
    }).then((res) => {
      if (res) {
        if (res.data.status === 'success') {
          window.location.reload();
        }
      }
    });
  };
  return (
    <div className='flex-grow h-screen overflow-y-scroll scrollbar-hide pb-32'>
      {/* the user logo */}
      <header className='absolute top-5 right-8'>
        <div
          onClick={signOut}
          className='flex items-center space-x-3 text-white bg-black p-1 pr-2 rounded-full hover:opacity-80 cursor-pointer'
        >
          <img
            className='w-10 h-10 rounded-full'
            src={user?.images?.[0]?.url}
            alt=''
          />
          <h2>{user?.display_name}</h2>
          <ChevronDownIcon className='w-5 h-5' />
        </div>
      </header>

      {/* colored section with playlist info */}
      <section
        className={`text-white flex items-end  h-80 bg-gradient-to-b to-black ${color} p-8 space-x-4`}
      >
        <img
          className='w-44 h-44 shadow-2xl'
          src={playlist?.images?.[0]?.url}
          alt=''
        />
        <div>
          <p className='capitalize text-gray-400'>playlist</p>
          <h1 className='text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold'>
            {playlist?.name}
          </h1>
        </div>
      </section>

      {/* songs */}
      <Songs />
    </div>
  );
}

export default Center;
