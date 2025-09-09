import clsx from "clsx";

const AddDeleteBox = ({ setTaskList, cardId, isFormOpen, setShowActions, setShowForm }) => {
  const onAdd = () => {
    setShowForm(true);
    setShowActions(false);
  };

  const onDelete = () => {
    setTaskList((prev) => prev.filter((item) => item.id !== cardId));
    setShowActions(false);
  };

  const showTwoBtns = 'w-18 top-[2px] right-0 justify-between';
  const showOneBtn = 'right-[18px]';

  return (
    <div className={clsx('flex items-center p-1 absolute top-[2px] z-10', isFormOpen ? showOneBtn : showTwoBtns)} data-testid="add-delete-box">
      {!isFormOpen && (
        <button
          className={
            'duration-150 ease-in flex items-center justify-center border-2 border-white rounded-md hover:bg-green-800 hover:border-(--app-green-400) active:border-3'
          }
          onClick={onAdd}
          data-testid="add-btn"
        >
          <span className='material-symbols-outlined text-(--app-green-400)'>
            add_box
          </span>
        </button>
      )}
      <button
        className='duration-150 ease-in flex items-center justify-center border-2 border-white rounded-md hover:bg-red-800 hover:border-red-600 active:border-3'
        onClick={onDelete}
        data-testid="delete-btn"
      >
        <span className='material-symbols-outlined text-red-600'>delete</span>
      </button>
    </div>
  );
};

export default AddDeleteBox;
