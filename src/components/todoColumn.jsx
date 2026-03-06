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
    <div className={`${column.bgColor} rounded-lg p-4`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          {column.title}
        </h2>
        <span className="bg-white px-3 py-1 rounded-full text-sm font-medium shadow-sm">
          {todos.length}
        </span>
      </div>
      
      <div className="space-y-3 min-h-[400px]">
        {todos.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-white/50 rounded-lg">
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

export default TodoColumn;