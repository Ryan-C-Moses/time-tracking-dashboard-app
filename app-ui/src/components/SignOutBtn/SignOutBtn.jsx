import { useNavigate } from 'react-router';
import { redirectToLogin } from '../../utils/constants';
import { clearToken } from '../../services/token-store';
import { clearUser } from '../../services/user';

const SignOutBtn = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    clearToken();
    clearUser();
    redirectToLogin(navigate);
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
