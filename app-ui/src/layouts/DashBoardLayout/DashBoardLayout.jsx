import { useState, useEffect } from 'react';
import { getUser } from '../../services/user';
import { fetchTasks } from '../../services/task';
import TaskCard from '../../components/TaskCard/TaskCard';
import UserCard from '../../components/UserCard/UserCard';
import TaskEntryForm from '../../components/TaskEntryForm/TaskEntryForm';
import AddTaskBtn from '../../components/AddTask/AddTaskBtn';
import SignOutBtn from '../../components/SignOutBtn/SignOutBtn';
import Loading from '../../components/Loading/Loading';

const DashBoardLayout = () => {
  const [taskList, setTaskList] = useState(null);
  const [timeFrame, setTimeFrame] = useState('Daily');
  const [showForm, setShowForm] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState({});

  const fetchData = async () => {
    setIsLoading(true);
    await fetchUser();
    const data = await fetchTasks();
    setTaskList(data);
    setIsLoading(false);
  };

  const fetchUser = async () => {
    const user = await getUser();
    setUser(user);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderTasks = taskList
    ?.filter((task) => task.timeframe === timeFrame.toLocaleLowerCase())
    .map((task) => (
      <TaskCard
        key={task.task_id}
        task={task}
        timeFrame={timeFrame}
        setTaskList={setTaskList}
        setShowForm={setShowForm}
        showForm={showForm}
        fetchData={fetchData}
      />
    ));

  return (
    <div className='text-(--app-white) h-[90vh] overflow-auto snap-start'>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <SignOutBtn />
          <AddTaskBtn setShowForm={setShowForm} />
          <UserCard setTimeFrame={setTimeFrame} user={user} />
          {showForm && (
            <TaskEntryForm
              setShowForm={setShowForm}
              fetchData={fetchData}
            />
          )}
          {taskList && renderTasks}
        </>
      )}
    </div>
  );
};

export default DashBoardLayout;
