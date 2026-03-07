import React, { useEffect } from 'react';
import { PRIORITY_OPTIONS } from '../utils/constants';

const TodoForm = ({ 
  register, 
  errors, 
  onSubmit, 
  handleSubmit, 
  editingTodo,
  onCancel,
  trigger
}) => {
  useEffect(() => {
    if (editingTodo) {
      trigger();
    }
  }, [editingTodo, trigger]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
      <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            {...register('title')}
            type="text"
            className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter task title"
            autoFocus
          />
          {errors.title && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <span>⚠️</span> {errors.title.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
            Priority <span className="text-red-500">*</span>
          </label>
          <select
            {...register('priority')}
            className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
              errors.priority ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select Priority</option>
            {PRIORITY_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.priority && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <span>⚠️</span> {errors.priority.message}
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register('description')}
            rows="3"
            className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter task description"
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <span>⚠️</span> {errors.description.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
        <button
          type="submit"
          className="w-full sm:flex-1 px-4 py-2.5 sm:py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg cursor-pointer hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all font-medium shadow-md hover:shadow-lg text-sm sm:text-base"
        >
          {editingTodo ? 'Update Task' : 'Create Task'}
        </button>
        
        <button
          type="button"
          onClick={onCancel}
          className="w-full sm:w-auto px-4 py-2.5 sm:py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all font-medium text-sm sm:text-base"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default React.memo(TodoForm);