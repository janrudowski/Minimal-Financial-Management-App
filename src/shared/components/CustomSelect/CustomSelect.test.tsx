import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { getInitialCustomSelectValue, useCustomSelect } from './CustomSelect';
import CustomSelect from './CustomSelect';

const categories = ['Food', 'Travel', 'Software'] as const;

function HookProbe({
  items = categories,
  initialValue,
}: {
  items?: readonly string[];
  initialValue?: string;
}) {
  const [selected] = useCustomSelect(items, initialValue);

  return <output aria-label='selected value'>{selected}</output>;
}

describe('CustomSelect', () => {
  it('renders a labelled native select control', () => {
    render(
      <CustomSelect
        label='Expense type'
        items={categories}
        selected='Food'
        setSelected={vi.fn()}
      />
    );

    const select = screen.getByRole('combobox', { name: 'Expense type' });

    expect(select).toHaveValue('Food');
    expect(screen.getByRole('option', { name: 'Travel' })).toBeInTheDocument();
  });

  it('notifies the consumer when the selected item changes', async () => {
    const user = userEvent.setup();
    const setSelected = vi.fn();

    render(
      <CustomSelect
        label='Expense type'
        items={categories}
        selected='Food'
        setSelected={setSelected}
      />
    );

    await user.selectOptions(screen.getByLabelText('Expense type'), 'Travel');

    expect(setSelected).toHaveBeenCalledWith('Travel');
  });

  it('is reachable for keyboard users through the tab order', async () => {
    const user = userEvent.setup();
    const setSelected = vi.fn();

    render(
      <CustomSelect
        label='Expense type'
        items={categories}
        selected='Food'
        setSelected={setSelected}
      />
    );

    const select = screen.getByRole('combobox', { name: 'Expense type' });

    await user.tab();

    expect(select).toHaveFocus();
  });

  it('applies Tailwind class props to its label and native select', () => {
    render(
      <CustomSelect
        label='Expense type'
        items={categories}
        selected='Food'
        setSelected={vi.fn()}
        labelClassName='text-app-subtle'
        selectClassName='rounded-md border-app-border'
      />
    );

    expect(screen.getByText('Expense type')).toHaveClass('text-app-subtle');
    expect(screen.getByRole('combobox', { name: 'Expense type' })).toHaveClass(
      'rounded-md',
      'border-app-border'
    );
  });

  it('disables the select when no items are available', () => {
    render(
      <CustomSelect label='Expense type' items={[]} selected='' setSelected={vi.fn()} />
    );

    expect(screen.getByRole('combobox', { name: 'Expense type' })).toBeDisabled();
  });
});

describe('useCustomSelect', () => {
  it('uses the first item when no initial value is supplied', () => {
    render(<HookProbe />);

    expect(screen.getByLabelText('selected value')).toHaveTextContent('Food');
  });

  it('uses a valid initial value', () => {
    render(<HookProbe initialValue='Software' />);

    expect(screen.getByLabelText('selected value')).toHaveTextContent(
      'Software'
    );
  });

  it('rejects an initial value outside the items list', () => {
    expect(() =>
      getInitialCustomSelectValue(categories as readonly string[], 'Rent')
    ).toThrow('The initial value must belong to the items array');
  });
});
