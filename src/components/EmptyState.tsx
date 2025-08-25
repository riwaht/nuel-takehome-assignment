import React from 'react';

const EmptyState = (): JSX.Element => {
  return (
    <tr>
      <td colSpan={6} className="px-6 py-12 text-center text-brand-grayText/70 dark:text-brand-grayLight/70">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-brand-grayText/50 dark:text-brand-grayLight/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-6a2 2 0 00-2 2v3a2 2 0 01-2-2v-3H4" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-brand-grayText dark:text-brand-grayLight">No products found</h3>
          <p className="mt-1 text-sm text-brand-grayText/70 dark:text-brand-grayLight/70">Try adjusting your filters or search criteria.</p>
        </div>
      </td>
    </tr>
  );
};

export default React.memo(EmptyState);
