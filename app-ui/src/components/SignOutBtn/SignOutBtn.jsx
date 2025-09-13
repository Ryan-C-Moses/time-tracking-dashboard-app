import { Link } from 'react-router';

const SignOutBtn = () => {
  return (
    <Link to='/'>
      <button className='absolute right-4 top-3 bg-(--app-purple-600) p-2 rounded-lg text-sm hover:bg-(--app-purple-700)'>
        Sign Out<i className='ml-1 fa-solid fa-arrow-right-from-bracket'></i>
      </button>
    </Link>
  );
};

export default SignOutBtn;
