import { Product, StatusInfo } from '../types';

interface ProductRowProps {
  product: Product;
  onProductSelect: (product: Product) => void;
}

const ProductRow = ({ product, onProductSelect }: ProductRowProps): JSX.Element => {
  const getStatusInfo = (product: Product): StatusInfo => {
    if (product.stock > product.demand) {
      return {
        status: 'healthy',
        label: 'Healthy',
        color: 'bg-green-100 text-green-800',
        rowColor: ''
      };
    } else if (product.stock === product.demand) {
      return {
        status: 'low',
        label: 'Low',
        color: 'bg-yellow-100 text-yellow-800',
        rowColor: ''
      };
    } else {
      return {
        status: 'critical',
        label: 'Critical',
        color: 'bg-red-100 text-red-800',
        rowColor: 'bg-red-50'
      };
    }
  };

  const statusInfo = getStatusInfo(product);

  return (
    <tr
      key={product.id}
      onClick={() => onProductSelect(product)}
      className={`hover:bg-gray-50 cursor-pointer transition-colors duration-200 ${statusInfo.rowColor}`}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div>
          <div className="text-sm font-medium text-gray-900">{product.name}</div>
          <div className="text-sm text-gray-500">{product.id}</div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{product.sku}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{product.warehouse}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{product.stock.toLocaleString()}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{product.demand.toLocaleString()}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`status-pill ${
          statusInfo.status === 'healthy' ? 'status-healthy' : 
          statusInfo.status === 'low' ? 'status-low' : 'status-critical'
        }`}>
          <span className={`w-2 h-2 rounded-full mr-2 ${
            statusInfo.status === 'healthy' ? 'bg-green-500' :
            statusInfo.status === 'low' ? 'bg-yellow-500' : 'bg-red-500'
          }`}></span>
          {statusInfo.label}
        </span>
      </td>
    </tr>
  );
};

export default ProductRow;
