import React from 'react';
import PriorityBadge from './PriorityBadge';
import { STATUS_PERMISSIONS } from '../utils/constants';

const TodoCard = ({ todo, onStatusChange, onEdit, onDelete }) => {
  const permissions = STATUS_PERMISSIONS[todo.status];

  const handleStatusChange = (newStatus) => {
    if (todo.status === 'list' && newStatus === 'done') return;
    onStatusChange(todo.id, newStatus);
  };

  const getNextStatus = () => {
    if (todo.status === 'list') return 'progress';
    if (todo.status === 'progress') return 'done';
    return null;
  };

  const nextStatus = getNextStatus();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-800">{todo.title}</h3>
        <PriorityBadge priority={todo.priority} />
      </div>
      
      <p className="text-gray-600 text-sm mb-3">{todo.description}</p>
      
      <div className="flex items-center justify-between mt-3">
        <div className="flex gap-2">
          {permissions.edit && (
            <button
              onClick={() => onEdit(todo)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Edit
            </button>
          )}
          {permissions.delete && (
            <button
              onClick={() => onDelete(todo.id)}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Delete
            </button>
          )}
        </div>
        
        {nextStatus && (
          <button
            onClick={() => handleStatusChange(nextStatus)}
            className="text-gray-600 hover:text-gray-800 text-sm bg-gray-100 px-3 py-1 rounded-full"
          >
            Move to {nextStatus === 'progress' ? 'In Progress' : 'Done'} →
          </button>
        )}
      </div>
    </div>
  );
};

export default TodoCard;