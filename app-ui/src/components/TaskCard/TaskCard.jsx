import clsx from 'clsx';
import { categoryColors } from '../../utils/constants';
import { getImageUrl } from '../../utils/image-utils';

const TaskCard = ({ task }) => {
  const { category, title, current, previous } = task;

  return (
    <div className='flex flex-col mb-[24px] overflow-clip relative'>
      <div
        className={clsx(
          'flex w-full h-20 rounded-t-2xl absolute', category === 'self-care' ? categoryColors["selfCare"] : categoryColors[category])}
      >
        <img
          className='absolute right-[24px] -top-1 w-[78px] h-[78px]'
          src={getImageUrl(`icon-${category}.svg`)}
          alt={`${category} img`}
        />
      </div>
      <div className='flex w-full items-center justify-between mt-10 flex-wrap bg-(--app-navy-900) z-10 px-6 py-7 rounded-2xl hover:bg-(--app-navy-800)'>
        <div className='flex basis-full justify-between mb-2'>
          <h5 className='txt-preset-5-md rubik-md'>{title}</h5>
          <i className='text-(--app-navy-200) fa-solid fa-ellipsis'></i>
        </div>
        <p className='txt-preset-3 rubik-light'>{current}hrs</p>
        <p className='text-(--app-navy-200) txt-preset-6 rubik-reg'>
          {`Previous - ${previous}hrs`}
        </p>
      </div>
    </div>
  );
};

export default TaskCard;

// Work
//   5hrs <!-- daily -->
//   Previous - 7hrs <!-- daily -->
//   32hrs <!-- weekly -->
//   Previous - 36hrs <!-- weekly -->
//   103hrs <!-- monthly -->
//   Previous - 128hrs <!-- monthly -->
