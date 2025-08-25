import React from 'react';
import '../styles/DirectionToggle.css';

function DirectionToggle({ onToggle }) {
  return (
    <button className="toggle-button" onClick={onToggle}>
      <svg className="toggle-icon" viewBox="0 0 24 24">
        <path d="M6 10L3 7L6 4V6H13V8H6V10ZM18 14L21 17L18 20V18H11V16H18V14Z" />
      </svg>
    </button>
  );
}

export default DirectionToggle;