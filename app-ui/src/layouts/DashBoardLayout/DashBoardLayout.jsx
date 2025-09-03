import { useState, useEffect } from 'react';
import TaskCard from '../../components/TaskCard/TaskCard';

const DashBoardLayout = () => {
  const [taskList, setTaskList] = useState(null);

  const fetchData = async () => {
    const response = await fetch('../../../data.json');
    const data = await response.json();
    setTaskList(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderTasks = taskList?.map((task, idx) => <TaskCard key={idx} task={task} />);

  return (
    <div className="text-(--app-white) h-[90vh] overflow-auto snap-start">
     {taskList && renderTasks}
    </div>
  );
};

export default DashBoardLayout;
