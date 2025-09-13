import { BrowserRouter, Routes, Route } from 'react-router';
import DashBoard from '../pages/DashBoard';
import SignInPage from '../pages/SignInPage';
import SignUpPage from '../pages/SignUpPage';

const UI = () => {
  return (
    <BrowserRouter>
      <div className='bg-(--app-navy-950) w-full h-screen'>
        <Routes>
          <Route path="/" element={<SignInPage />} />
          <Route path='/register' element={<SignUpPage />} />
          <Route path='/home' element={<DashBoard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default UI;
