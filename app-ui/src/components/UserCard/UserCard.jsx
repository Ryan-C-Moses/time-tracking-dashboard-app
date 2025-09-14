import { useState, useEffect } from 'react';
import TimeFrameBtn from '../TimeFrameBtn/TimeFrameBtn.jsx';
import { timeframes } from '../../utils/constants';
import { getUser } from '../../services/user.js';

const UserCard = ({ setTimeFrame }) => {
  const [activeBtn, setActiveBtn] = useState('Daily');
  const [user, setUser] = useState({});
  // const [isLoading, setIsLoading] = useState(null);

  const toggleBtns = timeframes.map((val, idx) => (
    <TimeFrameBtn
      key={idx}
      value={val}
      isActive={activeBtn}
      setActive={setActiveBtn}
      setTimeFrame={setTimeFrame}
    />
  ));

  const fetchUser = async () => {
    const user = await getUser();
    setUser(user);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className='w-full mb-[24px]'>
      <div className='bg-(--app-navy-900) rounded-2xl'>
        <div className='flex bg-(--app-purple-600) p-8 rounded-2xl'>
          <img
            className='w-[64px] h-[64px] border-3 rounded-full border-white mr-6'
            src='/images/image-jeremy.png'
            alt='user pic'
          />
          <div className='py-2'>
            <p className='txt-preset-6 rubik-reg mb-2'>Report for</p>
            <h4 className='txt-preset-4 rubik-light'>{user.username}</h4>
          </div>
        </div>
        <div className='w-full flex justify-between p-6'>{toggleBtns}</div>
      </div>
    </div>
  );
};

export default UserCard;
