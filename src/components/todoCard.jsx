import React, { useState, useRef, useEffect } from 'react';
import PriorityBadge from './PriorityBadge';
import { STATUS_PERMISSIONS } from '../utils/constants';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';

const TodoCard = ({ todo, onStatusChange, onEdit, onDelete }) => {
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);
    const buttonRef = useRef(null);

    const permissions = STATUS_PERMISSIONS[todo.status];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target) &&
                !buttonRef.current.contains(event.target)
            ) {
                setShowMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                setShowMenu(false);
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.addEventListener('keydown', handleEscape);
    }, []);

    const handleStatusChange = (newStatus) => {
        if (todo.status === 'list' && newStatus === 'done') return;
        onStatusChange(todo.id, newStatus);
        setShowMenu(false);
    };

    const handleEdit = () => {
        onEdit(todo);
        setShowMenu(false);
    };

    const handleDelete = () => {
        onDelete(todo.id);
        setShowMenu(false);
    };

    const getNextStatus = () => {
        if (todo.status === 'list') return 'progress';
        if (todo.status === 'progress') return 'done';
        return null;
    };

    const getNextStatusLabel = () => {
        if (todo.status === 'list') return 'Move to In Progress';
        if (todo.status === 'progress') return 'Move to Done';
        return null;
    };

    const nextStatus = getNextStatus();
    const nextStatusLabel = getNextStatusLabel();

    if (todo.status === 'done') {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium sm:font-semibold text-gray-800 text-sm sm:text-base pr-2">
                        {todo.title}
                    </h3>
                    <PriorityBadge priority={todo.priority} />
                </div>
                <p className="text-gray-600 text-xs sm:text-sm line-clamp-2">
                    {todo.description}
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 hover:shadow-md transition-shadow relative">
            <div className="flex justify-between items-start gap-2">
                <div className="flex-1 min-w-0">
                    <h3 className="font-medium sm:font-semibold text-gray-800 text-sm sm:text-base mb-1 break-words">
                        {todo.title}
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 break-words">
                        {todo.description}
                    </p>
                </div>

                <div className="flex items-start gap-1 flex-shrink-0">
                    <div className="hidden sm:block">
                        <PriorityBadge priority={todo.priority} />
                    </div>

                    <button
                        ref={buttonRef}
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors relative focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Task options"
                    >
                        <EllipsisVerticalIcon className="h-5 w-5 text-gray-600" />
                    </button>
                </div>
            </div>

            <div className="mt-2 sm:hidden">
                <PriorityBadge priority={todo.priority} />
            </div>

            {showMenu && (
                <div
                    ref={menuRef}
                    className="absolute right-2 top-12 z-50 bg-white rounded-lg shadow-xl border border-gray-200 py-1 min-w-[180px] sm:min-w-[200px] animate-in fade-in zoom-in duration-200"
                >
                    <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-xs text-gray-500 truncate">{todo.title}</p>
                    </div>

                    <div className="py-1">
                        {nextStatus && (
                            <button
                                onClick={() => handleStatusChange(nextStatus)}
                                className="w-full text-left px-4 py-2.5 sm:py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors flex items-center gap-3"
                            >
                                <span className="text-lg">
                                    {todo.status === 'list' ? '⏩' : '✅'}
                                </span>
                                <span className="flex-1">{nextStatusLabel}</span>
                                <span className="text-xs text-gray-400">→</span>
                            </button>
                        )}

                        {permissions.edit && (
                            <button
                                onClick={handleEdit}
                                className="w-full text-left px-4 py-2.5 sm:py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors flex items-center gap-3"
                            >
                                <span className="text-lg">✏️</span>
                                <span className="flex-1">Edit Task</span>
                            </button>
                        )}

                        {permissions.delete && (
                            <button
                                onClick={handleDelete}
                                className="w-full text-left px-4 py-2.5 sm:py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3 border-t border-gray-100 mt-1"
                            >
                                <span className="text-lg">🗑️</span>
                                <span className="flex-1">Delete Task</span>
                            </button>
                        )}
                    </div>

                    <div className="border-t border-gray-100 py-1">
                        <button
                            onClick={() => setShowMenu(false)}
                            className="w-full text-left px-4 py-2.5 sm:py-2 text-sm text-gray-500 hover:bg-gray-50 transition-colors flex items-center gap-3"
                        >
                            <span className="text-lg">✕</span>
                            <span className="flex-1">Close</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default React.memo(TodoCard);