import './spinner.css';
import type { CSSProperties } from 'react';

type SpinnerProps = {
  fill?: CSSProperties['fill'];
  height?: CSSProperties['height'];
  width?: CSSProperties['width'];
  marginTop?: CSSProperties['marginTop'];
};

export default function Spinner({
  fill = 'var(--text-two)',
  height = '3rem',
  width = '3rem',
  marginTop = 0,
}: SpinnerProps) {
  const style: CSSProperties = {
    fill,
    width,
    height,
    marginTop,
  };

  return (
    <div className='spinner-container'>
      <svg className='spinner' style={style}>
        <use href='/icons/spinner-icon.svg#Layer_1'></use>
      </svg>
    </div>
  );
}
