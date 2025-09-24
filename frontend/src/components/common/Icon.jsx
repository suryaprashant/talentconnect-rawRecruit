import React from 'react';

const Icon = ({d, size = 20}) => (
  <svg 
    height={size} 
    width={size} 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d={d}/>
  </svg>
);

export default Icon;