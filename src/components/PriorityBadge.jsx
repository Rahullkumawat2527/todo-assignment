import React from 'react';
import { PRIORITY_OPTIONS } from '../utils/constants';

const priorityStyles = {
  low: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  high: 'bg-red-100 text-red-800 border-red-200'
};

const PriorityBadge = React.memo(({ priority }) => {
  const priorityConfig = PRIORITY_OPTIONS.find(p => p.value === priority);
  
  return (
    <span className={`px-2 py-0.5 sm:px-2 sm:py-1 text-[10px] sm:text-xs font-medium rounded-full border ${priorityStyles[priority]}`}>
      {priorityConfig?.label}
    </span>
  );
});

PriorityBadge.displayName = 'PriorityBadge';

export default PriorityBadge;