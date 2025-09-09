import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import TaskCard from '../../src/components/TaskCard/TaskCard';
import userEvent from '@testing-library/user-event';
import { categoryColors } from '../../src/utils/constants';
import * as imageUtils from '../../src/utils/image-utils';

describe('TaskCard Unit Test', () => {
  it('component renders with correct values', () => {
    const task = {
      category: 'work',
      title: 'Working Dev Stuff',
      duration: 5,
      previous: 10,
      timeframe: 'daily',
      id: 1
    };
    const setTaskList = vi.fn();
    const showForm = false;
    const setShowForm = vi.fn();

    render(
      <TaskCard
        task={task}
        setTaskList={setTaskList}
        showForm={showForm}
        setShowForm={setShowForm}
      />
    );

    const h5 = screen.getByText('Working Dev Stuff');
    const img = screen.getByAltText('work img');
    const duration = screen.getByText('5hrs');
    const previous = screen.getByText(/10hrs/i);

    expect(h5).toHaveTextContent('Working Dev Stuff');
    expect(img).toBeInTheDocument();
    expect(duration).toHaveTextContent('5hrs');
    expect(previous).toHaveTextContent('Yesterday - 10hrs');
  });

  it('Pluralization is correct', () => {
    const task = {
      category: 'work',
      title: 'Working Dev Stuff',
      duration: 1,
      previous: 2,
      timeframe: 'daily',
      id: 1
    };
    const setTaskList = vi.fn();
    const showForm = false;
    const setShowForm = vi.fn();

    render(
      <TaskCard
        task={task}
        setTaskList={setTaskList}
        showForm={showForm}
        setShowForm={setShowForm}
      />
    );

    const duration = screen.getByText(/1hr/i);

    expect(duration).toHaveTextContent('1hr');
  });

  it('has correct background color', () => {
    const task = {
      category: 'work',
      title: 'Working Dev Stuff',
      duration: 1,
      previous: 2,
      timeframe: 'daily',
      id: 1
    };
    const setTaskList = vi.fn();
    const showForm = false;
    const setShowForm = vi.fn();

    render(
      <TaskCard
        task={task}
        setTaskList={setTaskList}
        showForm={showForm}
        setShowForm={setShowForm}
      />
    );

    const div = screen.getByTestId('category-color');

    expect(div).toHaveClass(categoryColors[task.category]);
  });

  it('icon renders via getImageUrl', () => {
    const task = {
      category: 'work',
      title: 'Working Dev Stuff',
      duration: 1,
      previous: 2,
      timeframe: 'daily',
      id: 1
    };
    vi.spyOn(imageUtils, 'getImageUrl').mockReturnValue(
      `icon-${task.category}.svg`
    );
    const setTaskList = vi.fn();
    const showForm = false;
    const setShowForm = vi.fn();

    render(
      <TaskCard
        task={task}
        setTaskList={setTaskList}
        showForm={showForm}
        setShowForm={setShowForm}
      />
    );

    const icon = screen.getByAltText(`${task.category} img`);

    expect(icon).toBeInTheDocument();
    expect(imageUtils.getImageUrl).toBeCalled();
    expect(icon).toHaveAttribute('src', `icon-${task.category}.svg`);
    expect(imageUtils.getImageUrl).toHaveBeenCalledWith('icon-work.svg');

  });

  it('button click toggles showActions state', async () => {
    const task = {
      category: 'work',
      title: 'Working Dev Stuff',
      duration: 1,
      previous: 2,
      timeframe: 'daily',
      id: 1
    };
    const setTaskList = vi.fn();
    const showForm = false;
    const setShowForm = vi.fn();
    const user = userEvent.setup();

    render(
      <TaskCard
        task={task}
        setTaskList={setTaskList}
        showForm={showForm}
        setShowForm={setShowForm}
      />
    );

    const button = screen.getByRole('button', {
      name: /show add and delete btn/i,
    });

    await user.click(button);

    expect(screen.getByTestId('add-delete-box')).toBeInTheDocument();
    expect(screen.getByText(task.title)).toHaveClass(
      'animate-pulse',
      'opacity-20'
    );

    // Clicking again hides it
    await user.click(button);
    expect(screen.queryByTestId('add-delete-box')).not.toBeInTheDocument();
    expect(screen.getByText(task.title)).not.toHaveClass(
      'animate-pulse',
      'opacity-20'
    );
  });

  //   it('Accessibility checks');

  //   it('Edgecase handling');

  afterEach(() => {
    vi.clearAllMocks(); // clears usage data (calls, instances)
    vi.resetAllMocks(); // resets mocks to initial state
    vi.restoreAllMocks(); // restores original implementations
  });
});
