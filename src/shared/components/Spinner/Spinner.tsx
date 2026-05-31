import type { CSSProperties } from 'react';

type SpinnerProps = {
  fill?: CSSProperties['fill'];
  height?: CSSProperties['height'];
  width?: CSSProperties['width'];
  marginTop?: CSSProperties['marginTop'];
};

export default function Spinner({
  fill = 'currentColor',
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
    <div className='flex items-center justify-center justify-self-center self-center'>
      <svg
        aria-hidden='true'
        className='relative z-[8] animate-spin'
        focusable='false'
        style={style}
      >
        <use href='/icons/spinner-icon.svg#Layer_1'></use>
      </svg>
    </div>
  );
}
