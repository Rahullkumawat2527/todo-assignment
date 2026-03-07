export const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low', color: 'green' },
  { value: 'medium', label: 'Medium', color: 'yellow' },
  { value: 'high', label: 'High', color: 'red' }
];

export const COLUMNS = [
  { id: 'list', title: '📋 List', status: 'list', bgColor: 'bg-blue-50' },
  { id: 'progress', title: '⚡ In Progress', status: 'progress', bgColor: 'bg-yellow-50' },
  { id: 'done', title: '✅ Done', status: 'done', bgColor: 'bg-green-50' }
];

export const STATUS_PERMISSIONS = {
  list: { edit: true, delete: true },
  progress: { edit: true, delete: false },
  done: { edit: false, delete: false }
};