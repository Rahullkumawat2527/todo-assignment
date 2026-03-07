export const Footer = ({columnCounts,todos}) => {
    return (
        <div className="mt-8 bg-white rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-center text-sm">
                <div className="text-gray-600">
                    <span className="font-semibold text-gray-800">Total Tasks:</span> {todos.length}
                </div>
                <div className="flex gap-6">
                    <span className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span>List: {columnCounts.list}</span>
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                        <span>In Progress: {columnCounts.progress}</span>
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span>Done: {columnCounts.done}</span>
                    </span>
                </div>
            </div>
        </div>
    )
}