import {
  HeartIcon,
  HomeIcon,
  LibraryIcon,
  PlusCircleIcon,
  RssIcon,
  SearchIcon,
} from '@heroicons/react/solid';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { playlistIdState } from '../atoms/playlistAtom';

// const SpotifyWebApi = require('spotify-web-api-node');
// const client_id = process.env.SPOTIFY_CLIENT_ID;
// const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
// const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;

// const spotifyApi = new SpotifyWebApi({
//   clientId: client_id,
//   clientSecret: client_secret,
//   redirectUri: redirect_uri,
// });

function Sidebar() {
  const [playlists, setPlaylists] = useState([]);
  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);

  useEffect(() => {
    // console.log('access token is: ' + spotifyApi.getAccessToken());

    const getData = async () => {
      const res = await axios({
        url: '/api/spotify/userplaylists',
        method: 'GET',
      });
      if (res) {
        if (res.data.status === 'success') {
          setPlaylists(res.data.data.data);
          setPlaylistId(res.data.data.data[0].id);
        }
      }
    };
    getData();
  }, []);

  return (
    <div className='text-gray-500 overflow-y-scroll h-screen scrollbar-hide space-y-4 p-5 pb-32 text-xs lg:text-sm hidden md:inline border-r-[0.1px] border-gray-900 sm:min-w-[12rem] lg:min-w-[15rem]'>
      <button className='flex items-center space-x-2 hover:text-white'>
        <HomeIcon className='w-5 h-5' />
        <p className='capitalize'>home</p>
      </button>
      <button className='flex items-center space-x-2 hover:text-white'>
        <SearchIcon className='w-5 h-5' />
        <p className='capitalize'>search</p>
      </button>
      <button className='flex items-center space-x-2 hover:text-white'>
        <LibraryIcon className='w-5 h-5' />
        <p className='capitalize'>your library</p>
      </button>
      <hr className='border-t-[0.1px] border-gray-900' />

      <button className='flex items-center space-x-2 hover:text-white'>
        <PlusCircleIcon className='w-5 h-5' />
        <p className='capitalize'>create playlist</p>
      </button>
      <button className='flex items-center space-x-2 hover:text-white'>
        <HeartIcon className='w-5 h-5 text-blue-500' />
        <p className='capitalize'>liked songs</p>
      </button>
      <button className='flex items-center  space-x-2 hover:text-white'>
        <RssIcon className='w-5 h-5 text-green-500' />
        <p className='capitalize'>your eposides</p>
      </button>
      <hr className='border-t-[0.1px] border-gray-900' />

      {playlists?.map((item) => {
        return (
          <p
            key={item.id}
            onClick={() => {
              setPlaylistId(item.id);
            }}
            className={`cursor-pointer hover:text-white ${
              playlistId === item.id ? 'text-white' : ''
            }`}
          >
            {item.name}
          </p>
        );
      })}
    </div>
  );
}

export default Sidebar;
