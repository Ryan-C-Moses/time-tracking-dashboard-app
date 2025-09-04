const AddDeleteBox = () => {
  return (
    <div className='flex items-center justify-between w-16 p-1 absolute top-px right-1 z-10'>
      <button className='flex items-center justify-center border border-white rounded-md'>
        <span className='material-symbols-outlined text-(--app-green-400)'>
          add_box
        </span>
      </button>
      <button className='flex items-center justify-center border border-white rounded-md'>
        <span className='material-symbols-outlined text-red-600'>delete</span>
      </button>
    </div>
  );
};

export default AddDeleteBox;
