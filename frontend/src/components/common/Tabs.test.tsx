import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import Tabs from './Tabs';

describe('Tabs', () => {
  const tabs = [
    { label: 'Огляд', value: 'overview' },
    { label: 'Профіль', value: 'profile' },
  ];

  it('відображає всі вкладки', () => {
    render(<Tabs tabs={tabs} activeTab="overview" onChange={() => {}} />);

    expect(screen.getByRole('tab', { name: 'Огляд' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Профіль' })).toBeInTheDocument();
  });

  it('позначає активну вкладку', () => {
    render(<Tabs tabs={tabs} activeTab="overview" onChange={() => {}} />);

    expect(screen.getByRole('tab', { name: 'Огляд' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Профіль' })).toHaveAttribute('aria-selected', 'false');
  });

  it('викликає onChange при натисканні на вкладку', () => {
    const onChange = vi.fn();

    render(<Tabs tabs={tabs} activeTab="overview" onChange={onChange} />);

    fireEvent.click(screen.getByRole('tab', { name: 'Профіль' }));

    expect(onChange).toHaveBeenCalledWith('profile');
  });
});
