import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import TaskEntryForm from '../../src/components/TaskEntryForm/TaskEntryForm';
import DashBoardLayout from '../../src/layouts/DashBoardLayout/DashBoardLayout';

describe('TaskEntryForm Test', () => {
  it('render inputs and labels', () => {
    render(<TaskEntryForm />);

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
    render(<TaskEntryForm />);

    const button = screen.getByText('Add Entry');

    expect(button).toBeInTheDocument();
  });

  it('form values return to default', async () => {
    const setShowForm = vi.fn();
    const setTaskList = vi.fn();

    render(<TaskEntryForm setShowForm={setShowForm} setTaskList={setTaskList} />);

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
