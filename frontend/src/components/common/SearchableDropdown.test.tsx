import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import SearchableDropdown from './SearchableDropdown';

describe('SearchableDropdown', () => {
  const options = [
    { label: 'Біг', value: 'running' },
    { label: 'Велосипед', value: 'cycling' },
    { label: 'Плавання', value: 'swimming' },
  ];

  it('відображає вибране значення', () => {
    render(<SearchableDropdown options={options} value="running" onChange={() => {}} />);

    expect(screen.getByText('Біг')).toBeInTheDocument();
  });

  it('фільтрує варіанти за пошуковим запитом', () => {
    render(<SearchableDropdown options={options} value="" onChange={() => {}} />);

    fireEvent.click(screen.getByRole('button', { name: /оберіть значення/i }));

    fireEvent.change(screen.getByPlaceholderText('Пошук...'), {
      target: { value: 'вел' },
    });

    expect(screen.getByRole('option', { name: 'Велосипед' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'Біг' })).not.toBeInTheDocument();
  });

  it('викликає onChange після вибору варіанта', () => {
    const onChange = vi.fn();

    render(<SearchableDropdown options={options} value="" onChange={onChange} />);

    fireEvent.click(screen.getByRole('button', { name: /оберіть значення/i }));
    fireEvent.click(screen.getByRole('option', { name: 'Плавання' }));

    expect(onChange).toHaveBeenCalledWith('swimming');
  });
});
