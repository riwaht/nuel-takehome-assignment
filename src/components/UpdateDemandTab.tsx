import { useState, FormEvent } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_DEMAND } from '../apollo/client';
import { Product } from '../types';

interface UpdateDemandTabProps {
  product: Product;
  onUpdate: () => void;
  onTabChange: (tab: string) => void;
}

const UpdateDemandTab = ({ product, onUpdate, onTabChange }: UpdateDemandTabProps): JSX.Element => {
  const [demandValue, setDemandValue] = useState<number>(product.demand);

  const [updateDemand, { loading: updatingDemand }] = useMutation(UPDATE_DEMAND, {
    onCompleted: () => {
      onUpdate();
      onTabChange('details');
    },
    onError: (error) => {
      alert(`Error updating demand: ${error.message}`);
    }
  });

  const handleDemandUpdate = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    updateDemand({
      variables: {
        id: product.id,
        demand: demandValue
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-lg font-medium text-gray-900">Update Demand</h4>
        <p className="mt-1 text-sm text-gray-600">
          Adjust the demand forecast for {product.name}
        </p>
      </div>

      <form onSubmit={handleDemandUpdate} className="space-y-4">
        <div>
          <label htmlFor="demand" className="block text-sm font-medium text-gray-700">
            New Demand Value
          </label>
          <input
            type="number"
            id="demand"
            min="0"
            value={demandValue}
            onChange={(e) => setDemandValue(parseInt(e.target.value) || 0)}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-sm text-gray-700">
            <strong>Current Demand:</strong> {product.demand.toLocaleString()}
          </div>
          <div className="text-sm text-gray-700 mt-1">
            <strong>New Demand:</strong> {demandValue.toLocaleString()}
          </div>
        </div>

        <button
          type="submit"
          disabled={updatingDemand || demandValue === product.demand}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {updatingDemand ? 'Updating...' : 'Update Demand'}
        </button>
      </form>
    </div>
  );
};

export default UpdateDemandTab;
