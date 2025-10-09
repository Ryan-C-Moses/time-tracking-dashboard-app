const SaveBtn = ({ handleUpdateTask }) => {
  return (
    <button
      className='text-sm bg-green-700 p-2 rounded-lg  hover:bg-green-500 active:bg-green-500 mt-3 w-full'
      onClick={handleUpdateTask}
    >
      Update
      <i className='ml-1 fa-solid fa-arrow-up-from-bracket'></i>
    </button>
  );
};

export default SaveBtn;
