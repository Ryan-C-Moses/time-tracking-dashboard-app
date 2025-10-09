import { useNavigate } from 'react-router';
import { logout } from '../../services/auth';
import { getUser } from '../../services/user';
import log from '../../config/logger';

const SignOutBtn = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    const user = getUser();
    const msg = `User ${user.id} has successfully logged out the application`;
    log.info(msg, '<SignOutBtn />')
    logout(navigate);
  };

  return (
    <button
      className='absolute right-4 top-3 bg-(--app-purple-600) p-2 rounded-lg text-sm hover:bg-(--app-purple-700)'
      onClick={handleClick}
    >
      Sign Out<i className='ml-1 fa-solid fa-arrow-right-from-bracket'></i>
    </button>
  );
};

export default SignOutBtn;
