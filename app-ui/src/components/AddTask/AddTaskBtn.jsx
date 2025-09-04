const AddTaskBtn = ({ setShowForm }) => {
  const handleClick = () => {
    setShowForm(true);
  }

  return (
    <button className='flex items-center bg-green-500 hover:bg-green-400 active:bg-green-500 p-3 mb-3 rounded-2xl'
        onClick={handleClick}
    >
      <p className='mr-2'>Add Task</p>
      <i className='fa-solid fa-plus'></i>
    </button>
  );
};

export default AddTaskBtn;
