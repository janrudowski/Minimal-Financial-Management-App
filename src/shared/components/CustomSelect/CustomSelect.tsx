import {
  useId,
  useState,
  type ChangeEvent,
  type CSSProperties,
} from 'react';
import { cn } from '../../utils/cn';

type CustomSelectStyles = {
  color?: CSSProperties['color'];
  minWidth?: CSSProperties['minWidth'];
  background?: CSSProperties['backgroundColor'];
  border?: CSSProperties['border'];
  borderRadius?: CSSProperties['borderRadius'];
  align?: CSSProperties['textAlign'];
  font?: CSSProperties['fontFamily'];
  margin?: CSSProperties['margin'];
  fontSize?: CSSProperties['fontSize'];
  chevronFill?: CSSProperties['fill'];
};

type CustomSelectProps<T extends string> = {
  id?: string;
  label: string;
  styles?: CustomSelectStyles;
  items?: readonly T[];
  selected: T;
  setSelected: (item: T) => void;
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
  controlClassName?: string;
  selectClassName?: string;
  chevronClassName?: string;
};

export function getInitialCustomSelectValue<T extends string>(
  items: readonly T[],
  init?: T
) {
  const initialValue = init ?? items[0];

  if (initialValue === undefined || !items.includes(initialValue))
    throw new Error('The initial value must belong to the items array');

  return initialValue;
}

export function useCustomSelect<T extends string>(
  items: readonly T[],
  init?: T
) {
  return useState<T>(getInitialCustomSelectValue(items, init));
}

export default function CustomSelect<T extends string>({
  id,
  label,
  styles,
  items = [],
  selected,
  setSelected,
  disabled = false,
  className = '',
  labelClassName,
  controlClassName,
  selectClassName,
  chevronClassName,
}: CustomSelectProps<T>) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const hasItems = items.length > 0;
  const isDisabled = disabled || !hasItems;
  const value = items.includes(selected) ? selected : '';

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    setSelected(event.target.value as T);
  }

  const customSelectStyle: CSSProperties = {
    color: styles?.color,
    minWidth: styles?.minWidth,
    textAlign: styles?.align,
    fontFamily: styles?.font,
    margin: styles?.margin,
    fontSize: styles?.fontSize,
  };

  const selectStyle: CSSProperties = {
    backgroundColor: styles?.background,
    border: styles?.border,
    borderRadius: styles?.borderRadius,
    color: styles?.color,
    fontFamily: styles?.font,
    fontSize: styles?.fontSize,
  };

  return (
    <div
      className={cn('w-full max-w-full', className)}
      style={customSelectStyle}
    >
      <label
        className={cn(
          'mb-1.5 block text-sm font-semibold leading-tight text-inherit',
          labelClassName
        )}
        htmlFor={selectId}
      >
        {label}
      </label>
      <div className={cn('relative w-full', controlClassName)}>
        <select
          id={selectId}
          className={cn(
            'min-h-11 w-full cursor-pointer appearance-none rounded-[10px] border border-app-border bg-transparent px-4 py-3 pr-11 text-base leading-tight text-app-text outline-none transition focus-visible:border-app-text focus-visible:ring-4 focus-visible:ring-app-accent/30 disabled:cursor-not-allowed disabled:opacity-60 dark:border-app-dark-border dark:text-slate-50 sm:text-sm',
            selectClassName
          )}
          disabled={isDisabled}
          onChange={handleChange}
          style={selectStyle}
          value={value}
        >
          {!hasItems && <option value=''>No options available</option>}
          {items.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <span
          aria-hidden='true'
          className={cn(
            'pointer-events-none absolute right-4 top-1/2 h-0 w-0 -translate-y-1/3 border-x-[0.32rem] border-t-[0.38rem] border-x-transparent border-t-current text-app-text dark:text-slate-50',
            chevronClassName
          )}
          style={{ borderTopColor: styles?.chevronFill || 'currentColor' }}
        />
      </div>
    </div>
  );
}
