import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getUser } from '../../services/user';
import { fetchTasks } from '../../services/task';
import { redirectToLogin } from '../../utils/constants';
import TaskCard from '../../components/TaskCard/TaskCard';
import UserCard from '../../components/UserCard/UserCard';
import TaskEntryForm from '../../components/TaskEntryForm/TaskEntryForm';
import AddTaskBtn from '../../components/AddTask/AddTaskBtn';
import SignOutBtn from '../../components/SignOutBtn/SignOutBtn';
import Loading from '../../components/Loading/Loading';

const DashBoardLayout = () => {
  const [taskList, setTaskList] = useState(null);
  const [timeFrame, setTimeFrame] = useState('');
  const [showForm, setShowForm] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    setIsLoading(true);
    const user = await fetchUser();
    if (user) {
      setTimeFrame('daily');
      const data = await fetchTasks();
      setTaskList(data);
      setIsLoading(false);
    } else {
      redirectToLogin(navigate);
    }
  };

  const fetchUser = async () => {
    const user = await getUser();
    setUserData(user);
    return user;
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderTasks = taskList
    ?.filter((task) => task.timeframe === timeFrame)
    .map((task) => (
      <TaskCard
        key={task.task_id}
        task={task}
        timeFrame={timeFrame}
        setTaskList={setTaskList}
        setShowForm={setShowForm}
        showForm={showForm}
        fetchTasks={fetchTasks}
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
          <UserCard timeFrame={timeFrame} setTimeFrame={setTimeFrame} username={userData.username} />
          {showForm && (
            <TaskEntryForm setShowForm={setShowForm} setTimeFrame={setTimeFrame} setTaskList={setTaskList} fetchTasks={fetchTasks} />
          )}
          {taskList && renderTasks}
        </>
      )}
    </div>
  );
};

export default DashBoardLayout;
