import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
vi.mock('../../src/config/logger.js', () => ({
  __esModule: true,
  default: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    http: vi.fn(),
  },
}));
import TaskEntryForm from '../../src/components/TaskEntryForm/TaskEntryForm';
import DashBoardLayout from '../../src/layouts/DashBoardLayout/DashBoardLayout';

describe('TaskEntryForm Test', () => {
  const setShowForm = vi.fn();
  const setTaskList = vi.fn();
  const fetchTasks = vi.fn();
  const setTimeFrame = vi.fn();

  const setup = () => {
    return render(<TaskEntryForm 
      setShowForm={setShowForm}
      setTaskList={setTaskList}
      fetchTasks={fetchTasks}
      setTimeFrame={setTimeFrame}
    />);
  }

  it('render inputs and labels', () => {
    setup();

    const title = screen.getByLabelText('Title');
    const duration = screen.getByLabelText('Duration');
    const timeframe = screen.getByLabelText('Timeframe');
    const category = screen.getByLabelText('Category');

    //Labels
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Duration')).toBeInTheDocument();
    expect(screen.getByText('Timeframe')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();

    //Inputs
    expect(title).toBeInTheDocument();
    expect(duration).toBeInTheDocument();
    expect(timeframe).toBeInTheDocument();
    expect(category).toBeInTheDocument();
  });

  it('submit button rendered', () => {
    setup()

    const button = screen.getByText('Add Entry');

    expect(button).toBeInTheDocument();
  });

  it('form values return to default', async () => {
    setup();

    const button = screen.getByText('Add Entry');
    const title = screen.getByLabelText('Title');
    const duration = screen.getByLabelText('Duration');
    const timeframe = screen.getByLabelText('Timeframe');
    const category = screen.getByLabelText('Category');

    await userEvent.type(title, 'Testing Dev App');
    await userEvent.type(duration, '5');
    await userEvent.selectOptions(timeframe, 'weekly');
    await userEvent.selectOptions(category, 'exercise');

    await userEvent.click(button);

    expect(setShowForm).toHaveBeenCalledWith(false);
  });
});
