import { useState, useEffect } from 'react';
import TaskCard from '../../components/TaskCard/TaskCard';
import UserCard from '../../components/UserCard/UserCard';

const DashBoardLayout = () => {
  const [taskList, setTaskList] = useState(null);
  const [timeFrame, setTimeFrame] = useState('Daily');

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
    .map((task, idx) => <TaskCard key={idx} task={task} />);

  return (
    <div className='text-(--app-white) h-[90vh] overflow-auto snap-start'>
      <UserCard setTimeFrame={setTimeFrame} />
      {taskList && renderTasks}
    </div>
  );
};

export default DashBoardLayout;
