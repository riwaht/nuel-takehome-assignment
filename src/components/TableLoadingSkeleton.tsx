const TableLoadingSkeleton = (): JSX.Element => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
      </div>
      <div className="divide-y divide-gray-200">
        {[...Array(10)].map((_, index) => (
          <div key={index} className="px-6 py-4">
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableLoadingSkeleton;
