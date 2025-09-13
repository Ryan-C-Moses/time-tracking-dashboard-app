import clsx from 'clsx';

const AddEditDeleteBox = ({
  setTaskList,
  cardId,
  isFormOpen,
  setShowActions,
  setShowForm,
  setEdit
}) => {
  const onAdd = () => {
    setShowForm(true);
    setShowActions(false);
  };

  const onDelete = () => {
    setTaskList((prev) => prev.filter((item) => item.id !== cardId));
    setShowActions(false);
  };

  const onEdit = () => {
    setEdit(true);
    setShowForm(false);
    setShowActions(false);
  }

  const hideActions = () => setShowActions(false);

  const showAllBtns = 'w-24';
  const removeAddBtn = 'w-16';

  return (
    <div
      className={clsx(
        'flex items-center py-1 justify-between z-10',
        isFormOpen ? removeAddBtn : showAllBtns
      )}
      data-testid='add-edit-delete-box'
      onMouseLeave={hideActions}
    >
      {!isFormOpen && (
        <button
          className={
            'duration-150 ease-in flex items-center justify-center border-2 border-white rounded-md hover:bg-green-800 hover:border-(--app-green-400) active:border-3'
          }
          onClick={onAdd}
          data-testid='add-btn'
        >
          <span className='material-symbols-outlined text-(--app-green-400)'>
            add_box
          </span>
        </button>
      )}
      <button
        className='duration-150 ease-in flex items-center justify-center border-2 border-white rounded-md hover:bg-sky-800 hover:border-sky-600 active:border-3'
        onClick={onEdit}
        data-testid='edit-btn'
      >
        <span className='material-symbols-outlined text-sky-400'>edit</span>
      </button>
      <button
        className='duration-150 ease-in flex items-center justify-center border-2 border-white rounded-md hover:bg-red-800 hover:border-red-600 active:border-3'
        onClick={onDelete}
        data-testid='delete-btn'
      >
        <span className='material-symbols-outlined text-red-600'>delete</span>
      </button>
    </div>
  );
};

export default AddEditDeleteBox;