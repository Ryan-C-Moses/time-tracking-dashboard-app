import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { createTask } from '../../services/task';
import log from '../../config/logger';
import ExitFormBtn from '../ExitFormBtn/ExitFormBtn';

const TaskEntryForm = ({
  setShowForm,
  setTaskList,
  fetchTasks,
  setTimeFrame,
}) => {
  const [formValues, setFormValues] = useState({
    category: 'work',
    title: '',
    timeframe: 'daily',
    duration: 0,
  });

  const handleChange = (e) => {
    setFormValues((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = uuidv4();
    const newTask = { ...formValues, id };
    await createTask(newTask);
    setShowForm(false);
    log.warn('Re-Fetching All Tasks', '<TaskEntryForm />', {
      action: 'Submitted form for new task entry',
    });
    const data = await fetchTasks();
    setTaskList(data);
    setTimeFrame(newTask.timeframe);
  };

  const exitForm = () => {
    setShowForm(false);
  };

  return (
    <div className='rubik-md mt-[30px] mb-[24px] text-(--app-black) relative'>
      <p className='txt-preset-6 border border-neutral-200 size-fit bg-(--app-purple-700) py-1 px-2 rounded-lg absolute left-3 -top-3'>
        Task Entry Form
      </p>
      <ExitFormBtn exitForm={exitForm} />
      <form
        className='bg-cyan-800 flex flex-col px-7 pt-10 pb-7 rounded-xl'
        onSubmit={handleSubmit}
      >
        <div className='flex items-center justify-between mb-5'>
          <div className='flex flex-col mr-3 w-full'>
            <label className='txt-preset-5-md mb-1  mr-2' htmlFor='title'>
              Title
            </label>
            <input
              className='bg-neutral-300 h-8 rounded-lg p-1'
              type='text'
              name='title'
              id='title'
              value={formValues.title}
              onChange={handleChange}
            />
          </div>
          <div className='flex flex-col'>
            <label className='txt-preset-5-md mb-1' htmlFor='duration'>
              Duration
            </label>
            <input
              className='text-center w-10 h-8 bg-neutral-300 rounded-md'
              min='1'
              type='number'
              name='duration'
              id='duration'
              value={formValues.duration}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className='w-50 mb-3 flex justify-between items-center'>
          <label className='txt-preset-5-md' htmlFor='timeframe'>
            Timeframe
          </label>
          <select
            className='bg-neutral-300 w-25 p-1 rounded-lg'
            name='timeframe'
            id='timeframe'
            value={formValues.timeframe}
            onChange={handleChange}
          >
            <option value='daily'>Daily</option>
            <option value='weekly'>Weekly</option>
            <option value='monthly'>Monthly</option>
          </select>
        </div>
        <div className='w-50 flex justify-between items-center mb-5'>
          <label className='txt-preset-5-md' htmlFor='category'>
            Category
          </label>
          <select
            className='bg-neutral-300 w-25 p-1 rounded-lg'
            name='category'
            id='category'
            value={formValues.category}
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
        <button className='txt-preset-5-md p-4 rounded-lg bg-indigo-300 hover:bg-cyan-600 hover:border-2 hover:border-indigo-300'>
          Add Entry
        </button>
      </form>
    </div>
  );
};

export default TaskEntryForm;
