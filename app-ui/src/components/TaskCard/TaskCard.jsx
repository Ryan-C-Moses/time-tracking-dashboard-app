import { useState } from 'react';
import { categoryColors } from '../../utils/constants';
import { getImageUrl } from '../../utils/image-utils';
import { previousLabels } from '../../utils/constants';
import { updateTask } from '../../services/task';
import clsx from 'clsx';
import log from '../../config/logger';
import AddEditDeleteBox from '../AddEditDeleteBox/AddEditDeleteBox';
import SaveBtn from '../SaveBtn/SaveBtn';
import ExitFormBtn from '../ExitFormBtn/ExitFormBtn';

const TaskCard = ({ task, setTaskList, showForm, setShowForm, fetchTasks }) => {
  const { category, title, duration, previous_duration, timeframe, task_id } = task;
  const [showActions, setShowActions] = useState(false);
  const [edit, setEdit] = useState(false);
  const [updatedValues, setUpdatedValues] = useState({
    title,
    category,
    duration,
    timeframe,
    task_id,
  });

  const handleClick = () => {
    setShowActions(!showActions);
  };

  const handleChange = (e) => {
    setUpdatedValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdateTask = async () => {
    setShowActions(false);
    setEdit(false);
    await updateTask(updatedValues);
    const data = await fetchTasks();
    setTaskList(data);
    log.info(`Task ${updatedValues.task_id} updated`, '<TaskCard />', {
      action: 'edited task',
    });
  };

  const exitForm = () => {
    setEdit(false);
    setShowActions(true);
    setUpdatedValues({
      title,
      category,
      duration,
      timeframe,
      task_id,
    });
  };

  const isPulse = showActions || edit ? 'animate-pulse opacity-20' : null;

  return (
    <div className='flex flex-col mb-[24px] overflow-clip relative'>
      <div
        className={clsx(
          'flex w-full h-20 rounded-t-2xl absolute',
          categoryColors[category],
          isPulse
        )}
        data-testid='category-color'
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
        {edit && <ExitFormBtn exitForm={exitForm} />}
        <div
          className={clsx(
            'flex basis-full justify-between mb-2',
            edit ? 'flex-col' : 'items-center'
          )}
        >
          {edit ? (
            <>
              <label className='text-sm mb-1 mr-2' htmlFor='title'>
                Title
              </label>
              <input
                className='text-sm text-blue-600 bg-neutral-300 mb-3 h-8 rounded-lg p-1'
                type='text'
                name='title'
                id='title'
                value={updatedValues.title}
                placeholder='Enter Title'
                onChange={handleChange}
              />
            </>
          ) : (
            <h5 className={clsx('txt-preset-5-md rubik-md', isPulse)}>
              {title}
            </h5>
          )}
          {edit && (
            <div className='w-44 text-sm flex justify-between items-center mb-1'>
              <label htmlFor='category'>Category</label>
              <select
                className='bg-neutral-300 text-blue-600 w-25 p-1 rounded-lg'
                name='category'
                id='category'
                value={updatedValues.category}
                onChange={handleChange}
              >
                <option value='work'>Work</option>
                <option value='play'>Play</option>
                <option value='study'>Study</option>
                <option value='exercise'>Exercise</option>
                <option value='social'>Social</option>
                <option value='self-care'>Self Care</option>
              </select>
            </div>
          )}
          {showActions ? (
            <AddEditDeleteBox
              setTaskList={setTaskList}
              cardId={task_id}
              setShowActions={setShowActions}
              setShowForm={setShowForm}
              isFormOpen={showForm}
              setEdit={setEdit}
            />
          ) : (
            !edit && (
              <button
                onClick={handleClick}
                aria-label='show add and delete btn'
              >
                <i className='text-(--app-navy-200) text-xl hover:text-(--app-white) z-20 fa-solid fa-ellipsis'></i>
              </button>
            )
          )}
        </div>
        {edit ? (
          <div className='flex items-center mt-1'>
            <label className='text-sm mr-2' htmlFor='duration'>
              Duration
            </label>
            <input
              className='text-center text-blue-600 w-10 h-8 bg-neutral-300 rounded-md'
              min='1'
              type='number'
              name='duration'
              id='duration'
              value={updatedValues.duration}
              onChange={handleChange}
            />
          </div>
        ) : (
          <p className={clsx('txt-preset-3 rubik-light', isPulse)}>
            {duration}
            {Number(duration) === 1 ? 'hr' : 'hrs'}
          </p>
        )}
        {edit ? (
          <div className='flex items-center mt-1'>
            <label className='text-sm mr-2' htmlFor='timeframe'>
              Timeframe
            </label>
            <select
              className='text-blue-600 bg-neutral-300 w-22 text-sm p-1 rounded-lg'
              name='timeframe'
              id='timeframe'
              value={updatedValues.timeframe}
              onChange={handleChange}
            >
              <option value='daily'>Daily</option>
              <option value='weekly'>Weekly</option>
              <option value='monthly'>Monthly</option>
            </select>
          </div>
        ) : (
          <p
            className={clsx(
              'text-(--app-navy-200) txt-preset-6 rubik-reg',
              isPulse
            )}
          >
            {previousLabels[timeframe]} - {previous_duration}
            {previous_duration === 1 ? 'hr' : 'hrs'}
          </p>
        )}
        {edit && <SaveBtn handleUpdateTask={handleUpdateTask} />}
      </div>
    </div>
  );
};

export default TaskCard;
