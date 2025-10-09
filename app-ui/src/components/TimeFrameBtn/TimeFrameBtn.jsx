import clsx from 'clsx';
import log from '../../config/logger';

const TimeFrameBtn = (props) => {
  const { value, isActive, setActive, setTimeFrame } = props;

  const handleClick = () => {
    setActive(value);
    setTimeFrame(value);
    const msg = `Loading ${value.toUpperCase()} tasks`;
    log.warn(msg, '<TimeFrameBtn />', {
      action: `Displaying ${value.toUpperCase()} tasks`,
    });
  };

  return (
    <button
      className={clsx(
        isActive === value ? 'text-(--app-white)' : 'text-(--app-purple-500)'
      )}
      onClick={handleClick}
    >
      {value[0].toUpperCase() + value.slice(1)}
    </button>
  );
};

export default TimeFrameBtn;
