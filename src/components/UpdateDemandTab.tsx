import { useState, FormEvent } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_DEMAND } from '../apollo/client';
import { Product } from '../types';
import { useToast } from '../contexts/ToastContext';

interface UpdateDemandTabProps {
  product: Product;
  onUpdate: () => void;
  onTabChange: (tab: string) => void;
}

const UpdateDemandTab = ({ product, onUpdate, onTabChange }: UpdateDemandTabProps): JSX.Element => {
  const [demandValue, setDemandValue] = useState<number>(product.demand);
  const [validationError, setValidationError] = useState<string>('');
  const { success, error } = useToast();

  const [updateDemand, { loading: updatingDemand }] = useMutation(UPDATE_DEMAND, {
    onCompleted: () => {
      success('Demand Updated', `Demand for ${product.name} updated to ${demandValue.toLocaleString()}`);
      setValidationError(''); // Clear any validation errors
      onUpdate();
      onTabChange('details');
    },
    onError: (graphqlError) => {
      const errorMessage = graphqlError.message || 'Failed to update demand';
      error('Update Failed', errorMessage, 0); // 0 duration means manual dismiss
      setValidationError(errorMessage);
    }
  });

  const handleDemandUpdate = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setValidationError(''); // Clear validation error on submit

    // Client-side validation
    if (demandValue < 0) {
      const errorMsg = 'Demand cannot be negative';
      setValidationError(errorMsg);
      error('Validation Error', errorMsg);
      return;
    }

    if (demandValue === product.demand) {
      const errorMsg = 'New demand value must be different from current value';
      setValidationError(errorMsg);
      error('Validation Error', errorMsg);
      return;
    }

    updateDemand({
      variables: {
        id: product.id,
        demand: demandValue
      }
    });
  };

  const handleDemandChange = (value: number) => {
    setDemandValue(value);
    setValidationError(''); // Clear validation error when user types
  };

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-lg font-medium text-brand-grayText dark:text-brand-grayLight">Update Demand</h4>
        <p className="mt-1 text-sm text-brand-grayText/70 dark:text-brand-grayLight/70">
          Adjust the demand forecast for {product.name}
        </p>
      </div>

      <form onSubmit={handleDemandUpdate} className="space-y-4">
        <div>
          <label htmlFor="demand" className="block text-sm font-medium text-brand-grayText dark:text-brand-grayLight">
            New Demand Value
          </label>
          <input
            type="number"
            id="demand"
            min="0"
            value={demandValue}
            onChange={(e) => handleDemandChange(parseInt(e.target.value) || 0)}
            className={`mt-1 block w-full border rounded-md px-3 py-2 bg-white dark:bg-brand-navy text-brand-grayText dark:text-brand-grayLight focus:outline-none transition-colors ${
              validationError 
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                : 'border-brand-grayMid dark:border-brand-navy/60 focus:ring-brand-blue focus:border-brand-blue'
            }`}
            required
            aria-invalid={validationError ? 'true' : 'false'}
            aria-describedby={validationError ? 'demand-error' : undefined}
          />
          {validationError && (
            <p id="demand-error" className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
              <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {validationError}
            </p>
          )}
        </div>

        <div className="bg-brand-blue/10 dark:bg-brand-blue/20 p-4 rounded-lg">
          <div className="text-sm text-brand-grayText dark:text-brand-grayLight">
            <strong>Current Demand:</strong> {product.demand.toLocaleString()}
          </div>
          <div className="text-sm text-brand-grayText dark:text-brand-grayLight mt-1">
            <strong>New Demand:</strong> {demandValue.toLocaleString()}
          </div>
        </div>

        <button
          type="submit"
          disabled={updatingDemand || demandValue === product.demand}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-brand-blue hover:bg-brand-blue/80 dark:hover:bg-brand-blue/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {updatingDemand ? 'Updating...' : 'Update Demand'}
        </button>
      </form>
    </div>
  );
};

export default UpdateDemandTab;
