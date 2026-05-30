import { useRef, useState, type CSSProperties } from 'react';
import './customselect.css';

//#dcdfe4

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
  menuHeight?: CSSProperties['height'];
  chevronFill?: CSSProperties['fill'];
};

type CustomSelectProps<T extends string> = {
  styles?: CustomSelectStyles;
  items?: readonly T[];
  selected: T;
  setSelected: (item: T) => void;
};

type ChevronProps = {
  fill?: CSSProperties['fill'];
  isOpen?: boolean;
};

export function useCustomSelect<T extends string>(
  items: readonly T[],
  init?: T
) {
  const initialValue = init ?? items[0];

  if (initialValue === undefined || !items.includes(initialValue))
    throw new Error('The initial value must belong to the items array');

  return useState<T>(initialValue);
}

function Chevron({ fill, isOpen = false }: ChevronProps) {
  const style: CSSProperties = {
    fill: fill || 'black',
    transform: 'rotate(-90deg)',
    width: '1em',
    height: '1em',
    transition: 'transform 200ms ease-in-out',
    marginLeft: '1em',
  };
  return (
    <svg
      style={{ ...style, ...(isOpen && { transform: 'rotate(-270deg)' }) }}
      version='1.1'
      id='Layer_1'
      xmlns='http://www.w3.org/2000/svg'
      x='0px'
      y='0px'
      viewBox='0 0 512.001 512.001'
    >
      <path
        d='M388.819,239.537L156.092,6.816c-9.087-9.089-23.824-9.089-32.912,0.002
        c-9.087,9.089-9.087,23.824,0.002,32.912l216.27,216.266L123.179,472.272c-9.087,9.089-9.087,23.824,0.002,32.912
        c4.543,4.544,10.499,6.816,16.455,6.816c5.956,0,11.913-2.271,16.457-6.817L388.819,272.45c4.366-4.364,6.817-10.283,6.817-16.455
        C395.636,249.822,393.185,243.902,388.819,239.537z'
      />
    </svg>
  );
}

export default function CustomSelect<T extends string>({
  styles,
  items = [],
  selected,
  setSelected,
}: CustomSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [itemsHeight, setItemsHeight] = useState('0px');

  const selectItemsRef = useRef<HTMLDivElement>(null);

  function toggle() {
    setIsOpen((prev) => !prev);
    const nextHeight = selectItemsRef.current?.scrollHeight ?? 0;
    setItemsHeight(isOpen ? '0px' : `${nextHeight}px`);
  }

  function select(item: T) {
    setSelected(item);
    toggle();
  }

  const customSelectStyle: CSSProperties = {
    color: styles?.color || 'black',
    minWidth: styles?.minWidth || '200px',
    backgroundColor: styles?.background || 'transparent',
    border: styles?.border || '1px solid #dcdfe4',
    borderRadius: styles?.borderRadius || '5px',
    textAlign: styles?.align || 'left',
    fontFamily: styles?.font || 'sans-serif',
    margin: styles?.margin || 0,
    fontSize: styles?.fontSize || '1em',
  };

  const menuStyle: CSSProperties = {
    height: styles?.menuHeight || '40px',
    color: styles?.color || 'black',
  };

  const itemsStyle: CSSProperties = {
    background: styles?.background || 'transparent',
    borderTop: 'none',
    border: isOpen ? styles?.border || '1px solid #dcdfe4' : undefined,
    borderRadius: '0 0 5px 5px',
    color: styles?.color || 'black',
  };

  return (
    <div className='custom-select' style={customSelectStyle}>
      <div className='custom-select-menu' style={menuStyle} onClick={toggle}>
        {selected} <Chevron isOpen={isOpen} fill={styles?.chevronFill} />
      </div>
      <div
        ref={selectItemsRef}
        className='custom-select-items'
        style={{ ...itemsStyle, height: `${itemsHeight}` }}
      >
        {items.map((item, i) => (
          <div
            key={i}
            className='custom-select-items-item'
            onClick={() => select(item)}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
