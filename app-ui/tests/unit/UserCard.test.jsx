import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import UserCard from '../../src/components/UserCard/UserCard';

describe('renders text', () => {
  it('renders UserCard', () => {
    render(<UserCard />);

    expect(screen.getByText('Report for')).toBeInTheDocument();
  });

  it('renders username', () => {
    render(<UserCard username={'Jeremy Robson'} />);
    const text = screen.getByText('Jeremy Robson');
    expect(text).toBeInTheDocument();
  });

  it('renders timeframe buttons', () => {
    const setTimeFrame = vi.fn();

    render(<UserCard setTimeFrame={setTimeFrame} />);

    const buttons = screen.getAllByRole('button');

    expect(buttons[0]).toHaveTextContent('Daily');
    expect(buttons[1]).toHaveTextContent('Weekly');
    expect(buttons[2]).toHaveTextContent('Monthly');
  });
});
