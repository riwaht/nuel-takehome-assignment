import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const TablePagination = ({ currentPage, totalPages, onPageChange }: TablePaginationProps): JSX.Element => {
  if (totalPages <= 1) return <></>;

  return (
    <div className="bg-white dark:bg-brand-navy px-4 py-3 flex items-center justify-between border-t border-brand-grayMid/30 dark:border-brand-navy/50 sm:px-6">
      <div className="flex-1 flex justify-between sm:hidden">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center px-4 py-2 border border-brand-grayMid dark:border-brand-navy/60 text-sm font-medium rounded-md text-brand-grayText dark:text-brand-grayLight bg-white dark:bg-brand-navy hover:bg-brand-grayLight/50 dark:hover:bg-brand-navy/60 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="ml-3 relative inline-flex items-center px-4 py-2 border border-brand-grayMid dark:border-brand-navy/60 text-sm font-medium rounded-md text-brand-grayText dark:text-brand-grayLight bg-white dark:bg-brand-navy hover:bg-brand-grayLight/50 dark:hover:bg-brand-navy/60 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-brand-grayText dark:text-brand-grayLight">
            Page <span className="font-medium">{currentPage}</span> of{' '}
            <span className="font-medium">{totalPages}</span>
          </p>
        </div>
        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-brand-grayMid dark:border-brand-navy/60 bg-white dark:bg-brand-navy text-sm font-medium text-brand-grayText/70 dark:text-brand-grayLight/70 hover:bg-brand-grayLight/50 dark:hover:bg-brand-navy/60 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;
              return (
                <button
                  key={pageNumber}
                  onClick={() => onPageChange(pageNumber)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    currentPage === pageNumber
                      ? 'z-10 bg-brand-blue/10 border-brand-blue text-brand-blue'
                      : 'bg-white dark:bg-brand-navy border-brand-grayMid dark:border-brand-navy/60 text-brand-grayText/70 dark:text-brand-grayLight/70 hover:bg-brand-grayLight/50 dark:hover:bg-brand-navy/60'
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
            
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-brand-grayMid dark:border-brand-navy/60 bg-white dark:bg-brand-navy text-sm font-medium text-brand-grayText/70 dark:text-brand-grayLight/70 hover:bg-brand-grayLight/50 dark:hover:bg-brand-navy/60 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Next</span>
              <ChevronRight className="h-5 w-5" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default TablePagination;
