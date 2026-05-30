import {
  useId,
  useState,
  type ChangeEvent,
  type CSSProperties,
} from 'react';
import './customselect.css';

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
    color: styles?.color || 'black',
    minWidth: styles?.minWidth || '200px',
    textAlign: styles?.align || 'left',
    fontFamily: styles?.font || 'sans-serif',
    margin: styles?.margin || 0,
    fontSize: styles?.fontSize || '1em',
  };

  const selectStyle: CSSProperties = {
    backgroundColor: styles?.background || 'transparent',
    border: styles?.border || '1px solid #dcdfe4',
    borderRadius: styles?.borderRadius || '10px',
    color: styles?.color || 'black',
    fontFamily: styles?.font || 'sans-serif',
    fontSize: styles?.fontSize || '1em',
  };

  return (
    <div
      className={`custom-select ${className}`.trim()}
      style={customSelectStyle}
    >
      <label className='custom-select-label' htmlFor={selectId}>
        {label}
      </label>
      <div className='custom-select-control'>
        <select
          id={selectId}
          className='custom-select-input'
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
          className='custom-select-chevron'
          style={{ borderTopColor: styles?.chevronFill || 'currentColor' }}
        />
      </div>
    </div>
  );
}
