import './spinner.css';
import React from 'react';

export default function Spinner({
  fill = 'var(--text-two)',
  height = '3rem',
  width = '3rem',
  marginTop = 0,
}) {
  const style = {
    fill: fill,
    width: width,
    height: height,
    marginTop: marginTop,
  };
  return (
    <div className='spinner-container'>
      <svg className='spinner' style={style}>
        <use href='/icons/spinner-icon.svg#Layer_1'></use>
      </svg>
    </div>
  );
}
