const TableLoadingSkeleton = (): JSX.Element => {
  return (
    <div className="bg-white dark:bg-brand-navy rounded-2xl shadow-lg border border-brand-grayMid/30 dark:border-brand-navy/50 overflow-hidden">
      <div className="px-8 py-6 border-b border-brand-grayMid/30 dark:border-brand-grayLight/20 bg-gradient-to-r from-brand-grayLight dark:from-brand-navy/80 to-white dark:to-brand-navy">
        <div className="w-48 h-6 bg-brand-grayMid dark:bg-brand-navy/60 rounded animate-pulse"></div>
      </div>
      <div className="divide-y divide-brand-grayMid/30 dark:divide-brand-grayLight/15">
        {[...Array(10)].map((_, index) => {
          const isEven = index % 2 === 0;
          const alternatingBg = isEven 
            ? 'bg-white dark:bg-brand-navy' 
            : 'bg-brand-grayLight/20 dark:bg-brand-navy/40';
          
          return (
            <div key={index} className={`px-6 py-4 ${alternatingBg} border-b border-brand-grayMid/20 dark:border-brand-grayLight/10`}>
              <div className="animate-pulse flex space-x-4">
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-brand-grayMid dark:bg-brand-grayLight/20 rounded w-3/4"></div>
                  <div className="h-4 bg-brand-grayMid dark:bg-brand-grayLight/20 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TableLoadingSkeleton;
