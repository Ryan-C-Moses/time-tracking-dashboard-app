import { useState, useEffect } from 'react';
import TaskCard from '../../components/TaskCard/TaskCard';
import UserCard from '../../components/UserCard/UserCard';
import TaskEntryForm from '../../components/TaskEntryForm/TaskEntryForm';
import AddTaskBtn from '../../components/AddTask/AddTaskBtn';

const DashBoardLayout = () => {
  const [taskList, setTaskList] = useState(null);
  const [timeFrame, setTimeFrame] = useState('Daily');
  const [showForm, setShowForm] = useState(null);

  const fetchData = async () => {
    const response = await fetch('../../../data.json');
    const data = await response.json();
    setTaskList(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderTasks = taskList
    ?.filter((task) => task.timeframe === timeFrame.toLocaleLowerCase())
    .map((task, idx) => (
      <TaskCard
        key={idx}
        task={task}
        timeFrame={timeFrame}
        setTaskList={setTaskList}
        setShowForm={setShowForm}
        showForm={showForm}
      />
    ));

  return (
    <div className='text-(--app-white) h-[90vh] overflow-auto snap-start'>
      <AddTaskBtn setShowForm={setShowForm} />
      <UserCard setTimeFrame={setTimeFrame} />
      {showForm && (
        <TaskEntryForm setShowForm={setShowForm} setTaskList={setTaskList} />
      )}
      {taskList && renderTasks}
    </div>
  );
};

export default DashBoardLayout;
