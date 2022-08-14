import React from 'react';
import './square.css';

const Square = ({ active, value, onClick }) => (
    <div
      className = {
        'tonesquare ' +
        (value ? 'filled ' : '') +
        (active ? 'live ' : '')
      }
      onClick={onClick}
    >
    </div>
);

export default Square;