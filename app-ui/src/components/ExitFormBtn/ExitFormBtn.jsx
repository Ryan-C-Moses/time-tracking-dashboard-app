const ExitFormBtn = ({ setShowForm }) => {
  const handleClick = () => {
    setShowForm(false);
  };

  return (
    <button
      className='absolute right-2 -top-3 bg-neutral-400 hover:bg-(--app-yellow-300) active:bg-yellow-500 flex items-center justify-center p-2 rounded-full'
      onClick={handleClick}
    >
      <i className='text-sm fa-solid fa-xmark'></i>
    </button>
  );
};

export default ExitFormBtn;
