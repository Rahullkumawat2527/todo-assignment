import React from 'react';
import TodoCard from './TodoCard';

const TodoColumn = ({ 
  column, 
  todos, 
  onStatusChange, 
  onEdit, 
  onDelete 
}) => {
  return (
    <div className={`${column.bgColor} rounded-lg p-3 sm:p-4 relative`}>
      <div className="flex justify-between items-center mb-3 sm:mb-4">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center gap-1">
          <span className="text-lg sm:text-xl">{column.icon}</span>
          <span>{column.title}</span>
        </h2>
        <span className="bg-white px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium shadow-sm">
          {todos.length}
        </span>
      </div>
      
      <div className="space-y-2 sm:space-y-3 min-h-[300px] sm:min-h-[400px]">
        {todos.length === 0 ? (
          <div className="text-center py-6 sm:py-8 text-gray-500 bg-white/50 rounded-lg text-sm sm:text-base">
            No tasks
          </div>
        ) : (
          todos.map(todo => (
            <TodoCard
              key={todo.id}
              todo={todo}
              onStatusChange={onStatusChange}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default React.memo(TodoColumn);