import React from 'react';

const SortingArrow = ({ direction }) => (
  <span className="sort-indicator">
    {direction === 'ascending' ? '▲' : '▼'}
  </span>
);

export default SortingArrow;
