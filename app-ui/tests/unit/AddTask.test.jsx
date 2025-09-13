import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import AddTaskBtn from '../../src/components/AddTask/AddTaskBtn';

describe('AddTask unit test', () => {
  let setShowForm;

  beforeEach(() => {
    setShowForm = vi.fn();
  });

  const setup = () => {
    return render(<AddTaskBtn setShowForm={setShowForm} />);
  };

  it('renders without crashing', () => {
    setup();
    const p = screen.getByText('Add Task');
    expect(p).toBeInTheDocument();
  });

  it('renders a button element', () => {
    setup();
    const btn = screen.getByRole('button');
    expect(btn).toBeInTheDocument();
  });

  it('renders button with text Add Task', () => {
    setup();
    const p = screen.getByText('Add Task');
    expect(p).toBeInTheDocument();
  });

  it('renders button with plus icon', () => {
    setup();
    const icon = screen.getByTestId('icon');
    expect(icon).toBeInTheDocument();
  });

  it('clicking button calls setShowForm(true)', async () => {
    setup();
    const user = userEvent.setup();
    const btn = screen.getByRole('button');

    await user.click(btn);

    expect(setShowForm).toHaveBeenCalledWith(true);
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
    vi.restoreAllMocks();
  });
});
