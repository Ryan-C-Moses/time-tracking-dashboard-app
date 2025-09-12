import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { redirectToHome } from '../../utils/constants';
import clsx from 'clsx';

const SignInForm = () => {
  const [isPulse, setIsPulse] = useState(false);
  const [fields, setFields] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleMouseOver = () => setIsPulse(true);
  const handleMouseOut = () => setIsPulse(false);
  const handleChange = (e) =>
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(fields);
    setFields({ email: '', password: '' });
    redirectToHome(navigate);
  };

  return (
    <div className='flex flex-col justify-center items-center w-full max-w-sm bg-(--app-navy-800) rounded-lg p-4 bg-gradient-to-b from-indigo-500 via-(--app-purple-700) to-(--app-green-400) via-(purple-500) to-(--app-yellow-300) relative'>
      <div className='absolute bottom-0 right-0 text-xs p-1'>
        <p>v20250911</p>
      </div>
      <div className={clsx('relative p-28 w-full', isPulse && 'animate-pulse')}>
        <span
          id='app-logo'
          className='material-symbols-outlined text-(--card-soft-yellow)/80 absolute -top-2 left-0 -rotate-20 z-30'
        >
          task
        </span>
        <span
          id='app-logo'
          className='material-symbols-outlined text-(--card-lime-green) absolute -top-6 left-20 rotate-30 z-20'
        >
          approval_delegation
        </span>
        <span
          id='app-logo'
          className='material-symbols-outlined z-10 text-(--card-light-red)/70 absolute top-3 right-10'
        >
          clock_loader_60
        </span>
        <span
          id='app-logo'
          className='material-symbols-outlined text-(--card-light-orange) absolute -right-4'
        >
          quick_reference
        </span>
        <div className='rounded-4xl overflow-clip absolute z-0 opacity-20 bottom-2 left-3 -rotate-5'>
          <img
            className='w-[195px]'
            src='https://plus.unsplash.com/premium_photo-1681487767138-ddf2d67b35c1?q=80&w=1255&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
            alt='graphic'
          />
        </div>
      </div>
      <h1 className='my-4 text-3xl'>Task Dashboard</h1>
      <form
        className='py-5 px-4 w-full bg-(--card-violet) text-sm rounded-xl mb-5'
        onSubmit={handleSubmit}
      >
        <h2 className='text-3xl mb-5'>Sign In</h2>
        <div className='flex justify-between items-center mb-4'>
          <label className='mr-9' htmlFor='email'>
            Email:
          </label>
          <input
            id='email'
            name='email'
            type='email'
            value={fields.email}
            className='bg-zinc-300 p-1 w-full rounded-md'
            placeholder='Enter email'
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
            onChange={handleChange}
            required
          />
        </div>

        <div className='flex justify-between items-center mb-4'>
          <label className='mr-2' htmlFor='password'>
            Password:
          </label>
          <input
            id='password'
            name='password'
            type='password'
            value={fields.password}
            className='bg-zinc-300 p-1 w-full rounded-md'
            placeholder='Enter password'
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
            onChange={handleChange}
            required
          />
        </div>
        <button className='bg-yellow-600 hover:bg-yellow-500 w-full p-2 rounded-lg mt-2'>
          Submit
        </button>
      </form>
      <div className='flex text-xs w-full mb-1'>
        <p className='mr-1'>Don't have an account?</p>
        <Link to="/register" className='text-blue-600' to='/register'>
          Register
        </Link>
      </div>
      <div className='w-full text-xs mb-3'>
        Challenge by{' '}
        <a href='https://www.frontendmentor.io?ref=challenge' target='_blank'>
          Frontend Mentor
        </a>
        . Coded by <a href='https://github.com/ryan-c-moses'>Ryan Moses</a>.
      </div>
    </div>
  );
};

export default SignInForm;
