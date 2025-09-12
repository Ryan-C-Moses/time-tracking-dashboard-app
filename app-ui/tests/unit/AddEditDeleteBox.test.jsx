import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import AddEditDeleteBox from '../../src/components/AddEditDeleteBox/AddEditDeleteBox';

describe('addEditDeleteBox unit test', () => {
  let setTaskList, setShowForm, setShowActions;

  const baseProps = {
    cardId: 1,
  };

  beforeEach(() => {
    setTaskList = vi.fn();
    setShowActions = vi.fn();
    setShowForm = vi.fn();
  });

  const setup = (overrides = {}) => {
    return render(
      <AddEditDeleteBox
        {...baseProps}
        setTaskList={setTaskList}
        setShowForm={setShowForm}
        setShowActions={setShowActions}
        {...overrides}
      />
    );
  };

  it('renders without crashing', () => {
    setup();

    const buttons = screen.getAllByRole('button');

    expect(buttons[0]).toBeInTheDocument();
    expect(buttons[1]).toBeInTheDocument();
  });

  it('renders with data-testid add-edit-delete-box', () => {
    setup();
    const addEditDeleteBox = screen.getByTestId('add-edit-delete-box');
    expect(addEditDeleteBox).toBeInTheDocument();
  });

  it('applies all-button classes when isFormOpen is false', () => {
    setup({ isFormOpen: false });
    const addEditDeleteBox = screen.getByTestId('add-edit-delete-box');
    expect(addEditDeleteBox).toHaveClass('w-24');
  });

  it('applies one-button classes when isFormOpen is true', () => {
    setup({ isFormOpen: true });
    const addEditDeleteBox = screen.getByTestId('add-edit-delete-box');
    expect(addEditDeleteBox).not.toHaveClass(
      'w-18 top-[2px] right-0 justify-between'
    );
  });

  it('shows Add button when isFormOpen is false', () => {
    setup({ isFormOpen: false });
    const addBtn = screen.getByTestId('add-btn');
    expect(addBtn).toBeInTheDocument();
  });

  it('hides Add button when isFormOpen is true', () => {
    setup({ isFormOpen: true });
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toEqual(2);
  });

  it('always shows Delete button', () => {
    setup({ isFormOpen: false });

    const delBtn = screen.getByTestId('delete-btn');

    expect(delBtn).toBeInTheDocument();

    setup({ isFormOpen: true });

    expect(delBtn).toBeInTheDocument();
  });

  it('clicking Add calls setShowForm(true)', async () => {
    setup({ isFormOpen: false });
    const user = userEvent.setup();
    const addBtn = screen.getByTestId('add-btn');

    await user.click(addBtn);

    expect(setShowForm).toHaveBeenCalledTimes(1);
    expect(setShowForm).toHaveBeenCalledWith(true);
  });

  it('clicking Add calls setShowActions(false)', async () => {
    setup({ isFormOpen: false });
    const user = userEvent.setup();
    const addBtn = screen.getByTestId('add-btn');

    await user.click(addBtn);

    expect(setShowActions).toHaveBeenCalledTimes(1);
    expect(setShowActions).toHaveBeenCalledWith(false);
  });

  it('clicking Delete calls setTaskList with filtered list', async () => {
    setup({ isFormOpen: false });
    const user = userEvent.setup();
    const delBtn = screen.getByTestId('delete-btn');

    await user.click(delBtn);

    expect(setTaskList).toHaveBeenCalledOnce();
    expect(setTaskList).toHaveBeenCalledWith(expect.any(Function));

    const updater = setTaskList.mock.calls[0][0];
    const prevList = [{ id: 1 }, { id: 2 }];
    const result = updater(prevList);
    expect(result).toEqual([{ id: 2 }]);
  });

  it('clicking Delete calls setShowActions(false)', async () => {
    setup({ isFormOpen: false });
    const user = userEvent.setup();
    const delBtn = screen.getByTestId('delete-btn');

    await user.click(delBtn);

    expect(setShowActions).toHaveBeenCalledTimes(1);
    expect(setShowActions).toHaveBeenCalledWith(false);
  });

  it('delete does not throw when task list is empty', async () => {
    setup({ isFormOpen: false });
    const user = userEvent.setup();
    const delBtn = screen.getByTestId('delete-btn');

    await user.click(delBtn);

    expect(setTaskList).toHaveBeenCalledWith(expect.any(Function));

    const updater = setTaskList.mock.calls[0][0];
    const prevList = [];
    const result = updater(prevList);

    expect(() => updater([])).not.toThrow();
    expect(result).toEqual([]);
    expect(Array.isArray(result)).toBe(true);
    expect(result).not.toBe(prevList); // for immutability check
    expect(setShowActions).toHaveBeenCalledWith(false);
  });

  it('delete leaves task list unchanged when cardId not found', async () => {
    setup({ isFormOpen: false, cardId: 3 });
    const user = userEvent.setup();
    const delBtn = screen.getByTestId('delete-btn');

    await user.click(delBtn);

    expect(setTaskList).toHaveBeenCalledWith(expect.any(Function));

    const updater = setTaskList.mock.calls[0][0];
    const prevList = [{ id: 1 }, { id: 2 }, { id: 4 }];
    const result = updater(prevList);

    expect(result).toEqual(prevList);
  });

  it('Add button has correct icon and green color class', () => {
    setup();
    const addBtn = screen.getByTestId('add-btn');
    expect(addBtn.className).toContain('hover:bg-green-800');
    expect(addBtn.className).toContain('hover:border-(--app-green-400)');
    expect(addBtn.className).toContain('active:border-3');
  });

  it('Delete button has correct icon and red color class', () => {
    setup();
    const delBtn = screen.getByTestId('delete-btn');
    expect(delBtn.className).toContain('hover:bg-red-800');
    expect(delBtn.className).toContain('hover:border-red-600');
    expect(delBtn.className).toContain('active:border-3');
  });

  it('renders buttons with accessible role=button', () => {
    setup();

    const buttons = screen.getAllByRole('button');

    expect(buttons[0]).toBeInTheDocument();
    expect(buttons[1]).toBeInTheDocument();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
    vi.restoreAllMocks();
  });
});
