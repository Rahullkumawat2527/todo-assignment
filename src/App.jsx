import React, { useState, lazy, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useLocalStorage } from './hooks/useLocalStorage';
import { COLUMNS } from './utils/constants';

// Lazy load components that aren't needed immediately
const TodoColumn = lazy(() => import('./components/TodoColumn'));
const SearchBar = lazy(() => import('./components/SearchBar'));
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

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onBlur' // Validate on blur for better performance
  });

  // Memoized filtered todos
  const filteredTodos = React.useMemo(() => {
    const searchLower = searchTerm.toLowerCase();
    return todos.filter(todo =>
      todo.title.toLowerCase().includes(searchLower) ||
      todo.description.toLowerCase().includes(searchLower)
    );
  }, [todos, searchTerm]);

  // Memoized todos by status
  const getTodosByStatus = React.useCallback((status) => {
    return filteredTodos.filter(todo => todo.status === status);
  }, [filteredTodos]);

  // Optimized handlers
  const onSubmit = React.useCallback((data) => {
    setTodos(prevTodos => {
      if (editingTodo) {
        return prevTodos.map(todo =>
          todo.id === editingTodo.id ? { ...todo, ...data } : todo
        );
      }
      return [...prevTodos, {
        ...data,
        id: Date.now(),
        status: 'list',
        createdAt: new Date().toISOString()
      }];
    });
    
    reset();
    setEditingTodo(null);
  }, [editingTodo, reset, setTodos]);

  const handleEdit = React.useCallback((todo) => {
    setEditingTodo(todo);
    setValue('title', todo.title);
    setValue('description', todo.description);
    setValue('priority', todo.priority);
  }, [setValue]);

  const handleDelete = React.useCallback((id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    }
  }, [setTodos]);

  const handleStatusChange = React.useCallback((id, newStatus) => {
    setTodos(prevTodos => prevTodos.map(todo => {
      if (todo.id === id) {
        if (todo.status === 'list' && newStatus === 'done') {
          alert('Cannot move task directly from List to Done!');
          return todo;
        }
        return { ...todo, status: newStatus };
      }
      return todo;
    }));
  }, [setTodos]);

  // Memoized column counts
  const columnCounts = React.useMemo(() => ({
    list: getTodosByStatus('list').length,
    progress: getTodosByStatus('progress').length,
    done: getTodosByStatus('done').length
  }), [getTodosByStatus]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="todo-container">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            TaskFlow Todo
          </h1>
          <p className="text-gray-600">
            Manage your tasks efficiently with our advanced todo application
          </p>
        </header>

        <Suspense fallback={<LoadingFallback />}>
          <TodoForm
            register={register}
            errors={errors}
            onSubmit={onSubmit}
            handleSubmit={handleSubmit}
            editingTodo={editingTodo}
            reset={reset}
          />

          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

          <footer className="mt-8 text-center text-gray-500 text-sm">
            <p>Total Tasks: {todos.length} • List: {columnCounts.list} • In Progress: {columnCounts.progress} • Done: {columnCounts.done}</p>
          </footer>
        </Suspense>
      </div>
    </div>
  );
};

export default React.memo(App);