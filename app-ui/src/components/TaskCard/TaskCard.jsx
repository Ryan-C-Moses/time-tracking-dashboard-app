import { useState } from 'react';
import clsx from 'clsx';
import { categoryColors } from '../../utils/constants';
import { getImageUrl } from '../../utils/image-utils';
import { previousLabels } from '../../utils/constants';
import AddDeleteBox from '../AddDeleteBox/AddDeleteBox';

const TaskCard = ({ task, setTaskList, showForm, setShowForm }) => {
  const [showActions, setShowActions] = useState(false);

  const { category, title, duration, previous, timeframe, id } = task;

  const handleClick = () => {
    setShowActions(!showActions);
  };

  const isPulse = showActions ? 'animate-pulse opacity-20' : null;

  return (
    <div className='flex flex-col mb-[24px] overflow-clip relative'>
      <div
        className={clsx(
          'flex w-full h-20 rounded-t-2xl absolute',
          category === 'self-care'
            ? categoryColors['selfCare']
            : categoryColors[category],
          isPulse
        )}
      >
        <img
          className='absolute right-[24px] -top-1 w-[78px] h-[78px]'
          src={getImageUrl(`icon-${category}.svg`)}
          alt={`${category} img`}
        />
      </div>
      <div
        className={clsx(
          'flex w-full items-center justify-between mt-10 flex-wrap bg-(--app-navy-900) z-10 px-6 py-7 rounded-2xl hover:bg-(--app-navy-800) z-0 relative',
          showActions ? 'pt-9' : null
        )}
      >
        {showActions && (
          <AddDeleteBox
            setTaskList={setTaskList}
            cardId={id}
            setShowActions={setShowActions}
            setShowForm={setShowForm}
            isFormOpen={showForm}
          />
        )}
        <div className='flex basis-full justify-between mb-2'>
          <h5 className={clsx('txt-preset-5-md rubik-md', isPulse)}>{title}</h5>
          <button onClick={handleClick}>
            <i className='text-(--app-navy-200) text-xl hover:text-(--app-white) z-20 fa-solid fa-ellipsis'></i>
          </button>
        </div>
        <p className={clsx('txt-preset-3 rubik-light', isPulse)}>
          {duration}
          {Number(duration) === 1 ? 'hr' : 'hrs'}
        </p>
        <p
          className={clsx(
            'text-(--app-navy-200) txt-preset-6 rubik-reg',
            isPulse
          )}
        >
          {previousLabels[timeframe]} - {previous}
          {previous === 1 ? 'hr' : 'hrs'}
        </p>
      </div>
    </div>
  );
};

export default TaskCard;