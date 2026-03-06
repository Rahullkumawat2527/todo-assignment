import React from 'react';
import { PRIORITY_OPTIONS } from '../utils/constants';

const PriorityBadge = ({ priority }) => {
  const priorityConfig = PRIORITY_OPTIONS.find(p => p.value === priority);
  
  const colorClasses = {
    green: 'bg-green-100 text-green-800 border-green-200',
    yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    red: 'bg-red-100 text-red-800 border-red-200'
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${colorClasses[priorityConfig?.color]}`}>
      {priorityConfig?.label}
    </span>
  );
};

export default PriorityBadge;