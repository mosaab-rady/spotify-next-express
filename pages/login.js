import { useRouter } from 'next/router';

function Login() {
  const router = useRouter();
  const signIn = async () => {
    router.push('/api/login/spotify');
  };

  return (
    <div className='bg-black h-screen flex flex-col items-center justify-center '>
      <img
        src='https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/2048px-Spotify_logo_without_text.svg.png'
        className='w-52 mb-5'
        alt=''
      />
      <div>
        <button
          onClick={signIn}
          className='bg-green-500 p-5 text-black hover:bg-green-600 
        focus:ring-2 focus:ring-offset-2 focus:ring-green-500 capitalize rounded-full'
        >
          login with spotify
        </button>
      </div>
    </div>
  );
}

export default Login;
