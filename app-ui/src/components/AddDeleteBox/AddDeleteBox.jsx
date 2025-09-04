const AddDeleteBox = ({ setTaskList, cardId, setShowActions }) => {
  const onAdd = () => {
    setTaskList((prev) => [
      ...prev,
      {
        category: 'work',
        title: "Ryan's Working",
        timeframe: 'daily',
        current: 3,
        previous: 4,
      },
    ]);
    setShowActions(false);
  };

  const onDelete = () => {
    setTaskList(prev => prev.filter((item) => item.id !== cardId));
    setShowActions(false);
  }

  return (
    <div className='flex items-center justify-between w-18 p-1 absolute top-[2px] right-1 z-10'>
      <button
        className={
          'duration-150 ease-in flex items-center justify-center border-2 border-white rounded-md hover:bg-green-800 hover:border-(--app-green-400) active:border-3'
        }
        onClick={onAdd}
      >
        <span className='material-symbols-outlined text-(--app-green-400)'>
          add_box
        </span>
      </button>
      <button className='duration-150 ease-in flex items-center justify-center border-2 border-white rounded-md hover:bg-red-800 hover:border-red-600 active:border-3'
      onClick={onDelete}
      >
        <span className='material-symbols-outlined text-red-600'>delete</span>
      </button>
    </div>
  );
};

export default AddDeleteBox;
