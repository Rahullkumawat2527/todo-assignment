import React, { useState, lazy, Suspense, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useLocalStorage } from './hooks/useLocalStorage';
import { COLUMNS } from './utils/constants';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

// Lazy load components
const TodoColumn = lazy(() => import('./components/TodoColumn'));
const TodoForm = lazy(() => import('./components/TodoForm'));

// Loading fallback
const LoadingFallback = () => (
  <div className="flex justify-center items-center h-32">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

const schema = yup.object({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  priority: yup.string().required('Priority is required')
});

const App = () => {
  const [todos, setTodos] = useLocalStorage('todos', []);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingTodo, setEditingTodo] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    trigger
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onBlur'
  });

  // Memoized filtered todos
  const filteredTodos = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();
    return todos.filter(todo =>
      todo.title.toLowerCase().includes(searchLower) ||
      todo.description.toLowerCase().includes(searchLower)
    );
  }, [todos, searchTerm]);

  // Memoized todos by status
  const getTodosByStatus = useCallback((status) => {
    return filteredTodos.filter(todo => todo.status === status);
  }, [filteredTodos]);

  const handleCreateClick = () => {
    setShowForm(true);
    setEditingTodo(null);
    reset();
    // Scroll to form on mobile
    setTimeout(() => {
      document.getElementById('todo-form-container')?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }, 100);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingTodo(null);
    reset();
  };

  const onSubmit = useCallback(async (data) => {
    try {
      if (editingTodo) {
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.id === editingTodo.id ? { ...todo, ...data } : todo
          )
        );
      } else {
        setTodos(prevTodos => [...prevTodos, {
          ...data,
          id: Date.now(),
          status: 'list',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }]);
      }
      
      setShowForm(false);
      setEditingTodo(null);
      reset();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  }, [editingTodo, reset, setTodos]);

  const handleEdit = useCallback((todo) => {
    setEditingTodo(todo);
    setShowForm(true);
    setValue('title', todo.title);
    setValue('description', todo.description);
    setValue('priority', todo.priority);
    // Scroll to form on mobile
    setTimeout(() => {
      document.getElementById('todo-form-container')?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }, 100);
  }, [setValue]);

  const handleDelete = useCallback((id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    }
  }, [setTodos]);

  const handleStatusChange = useCallback((id, newStatus) => {
    setTodos(prevTodos => prevTodos.map(todo => {
      if (todo.id === id) {
        if (todo.status === 'list' && newStatus === 'done') {
          alert('⚠️ Cannot move task directly from List to Done!\n\nTasks must go through "In Progress" first.');
          return todo;
        }
        return { 
          ...todo, 
          status: newStatus,
          updatedAt: new Date().toISOString()
        };
      }
      return todo;
    }));
  }, [setTodos]);

  // Memoized column counts
  const columnCounts = useMemo(() => ({
    list: getTodosByStatus('list').length,
    progress: getTodosByStatus('progress').length,
    done: getTodosByStatus('done').length
  }), [getTodosByStatus]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 relative">
        {/* Header */}
        <div className="mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-1 sm:mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            TaskFlow Todo
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Organize your tasks efficiently
          </p>
        </div>

        {/* Search and Create Bar - Fixed positioning context */}
        <div className="sticky top-0 z-20 bg-gradient-to-br from-gray-50 to-gray-100 pt-2 pb-3 -mt-2">
          <div className="bg-white rounded-xl shadow-md p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search tasks..."
                  className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              
              {!showForm ? (
                <button
                  onClick={handleCreateClick}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg text-sm sm:text-base"
                >
                  <PlusIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Create Task</span>
                </button>
              ) : (
                <button
                  onClick={handleCancelForm}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <XMarkIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Cancel</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Form Container - Higher z-index on mobile */}
        <div 
          id="todo-form-container"
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            showForm ? 'max-h-96 mb-4 sm:mb-6 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="relative z-30 bg-white rounded-xl shadow-lg p-4 sm:p-6 border-l-4 border-blue-500">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
              {editingTodo ? '✏️ Edit Task' : '✨ Create New Task'}
            </h2>
            <Suspense fallback={<LoadingFallback />}>
              <TodoForm
                register={register}
                errors={errors}
                onSubmit={onSubmit}
                handleSubmit={handleSubmit}
                editingTodo={editingTodo}
                onCancel={handleCancelForm}
                trigger={trigger}
              />
            </Suspense>
          </div>
        </div>

        {/* Columns Container - Lower z-index */}
        <div className="relative z-10">
          <Suspense fallback={<LoadingFallback />}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {COLUMNS.map(column => (
                <TodoColumn
                  key={column.id}
                  column={column}
                  todos={getTodosByStatus(column.status)}
                  onStatusChange={handleStatusChange}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </Suspense>
        </div>

        {/* Footer Stats */}
        <div className="mt-4 sm:mt-8 bg-white rounded-lg shadow-sm p-3 sm:p-4 relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs sm:text-sm gap-2 sm:gap-0">
            <div className="text-gray-600">
              <span className="font-semibold text-gray-800">Total:</span> {todos.length}
            </div>
            <div className="flex flex-wrap gap-3 sm:gap-6">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>List: {columnCounts.list}</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                <span>Progress: {columnCounts.progress}</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Done: {columnCounts.done}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(App);