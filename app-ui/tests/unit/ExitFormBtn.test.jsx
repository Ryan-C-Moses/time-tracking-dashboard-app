import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import ExitFormBtn from '../../src/components/ExitFormBtn/ExitFormBtn';
import userEvent from '@testing-library/user-event';

describe('ExitFormBtn Unit Test', () => {
  it('component renders', () => {
    render(<ExitFormBtn />);

    const button = screen.getByRole('button', {
      name: /close task entry form/i,
    });

    expect(button).toBeInTheDocument();
  });

  it('hides task entry form form', async () => {
    const exitForm = vi.fn();

    render(<ExitFormBtn exitForm={exitForm}/>);

    const button = screen.getByRole('button', {
      name: /close task entry form/i,
    });

    await userEvent.click(button);

    expect(exitForm).toHaveBeenCalledOnce();
  });
});