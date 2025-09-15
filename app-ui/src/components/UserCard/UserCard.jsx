import { useState, useEffect } from 'react';
import TimeFrameBtn from '../TimeFrameBtn/TimeFrameBtn.jsx';
import { timeframes } from '../../utils/constants';

const UserCard = ({ setTimeFrame, user }) => {
  const [activeBtn, setActiveBtn] = useState('Daily');

  const toggleBtns = timeframes.map((val, idx) => (
    <TimeFrameBtn
      key={idx}
      value={val}
      isActive={activeBtn}
      setActive={setActiveBtn}
      setTimeFrame={setTimeFrame}
    />
  ));

  useEffect(() => {}, []);

  return (
    <div className='w-full mb-[24px]'>
      <div className='bg-(--app-navy-900) rounded-2xl'>
        <div className='flex bg-(--app-purple-600) p-7 rounded-2xl'>
          <img
            className='w-[64px] h-[64px] border-3 rounded-full border-white mr-6'
            src='/images/image-jeremy.png'
            alt='user pic'
          />
          <div className='py-2'>
            <p className='txt-preset-6 rubik-reg mb-2'>Report for</p>
            <h4 className='w-full txt-preset-4 rubik-light'>{user.username}</h4>
          </div>
        </div>
        <div className='w-full flex justify-between p-6'>{toggleBtns}</div>
      </div>
    </div>
  );
};

export default UserCard;
