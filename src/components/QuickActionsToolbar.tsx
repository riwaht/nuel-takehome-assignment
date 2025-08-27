import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { 
  Plus, 
  Download, 
  ArrowRightLeft, 
  TrendingUp,
  FileText,
  Settings,
  X
} from 'lucide-react';
import { Product, Warehouse } from '../types';

interface QuickActionsToolbarProps {
  products: Product[];
  warehouses: Warehouse[];
  onExportData: (format: 'csv' | 'json') => void;
  onBulkTransfer: () => void;
  onReorderSuggestions: () => void;
  onViewPresets: () => void;
}

const QuickActionsToolbar = ({ 
  products, 
  warehouses, 
  onExportData, 
  onBulkTransfer,
  onReorderSuggestions,
  onViewPresets 
}: QuickActionsToolbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 24, y: 24 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [hasDragged, setHasDragged] = useState(false);
  const [menuDirection, setMenuDirection] = useState<'up' | 'down'>('up');
  const [menuAlignment, setMenuAlignment] = useState<'left' | 'right'>('left');
  const toolbarRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  const currentPositionRef = useRef({ x: 24, y: 24 });
  
  // Initialize position ref
  useEffect(() => {
    currentPositionRef.current = position;
  }, [position]);

  // Memoized actions configuration to prevent recreation on every render
  const actions = useMemo(() => [
    {
      id: 'export-csv',
      label: 'Export CSV',
      icon: <Download size={20} />,
      action: () => onExportData('csv'),
      description: 'Download current data as CSV'
    },
    {
      id: 'export-json',
      label: 'Export JSON',
      icon: <FileText size={20} />,
      action: () => onExportData('json'),
      description: 'Download current data as JSON'
    },
    {
      id: 'bulk-transfer',
      label: 'Bulk Transfer',
      icon: <ArrowRightLeft size={20} />,
      action: onBulkTransfer,
      description: 'Transfer stock between warehouses'
    },
    {
      id: 'reorder-suggestions',
      label: 'Reorder Alert',
      icon: <TrendingUp size={20} />,
      action: onReorderSuggestions,
      description: 'View items needing reorder'
    },
    {
      id: 'view-presets',
      label: 'View Presets',
      icon: <Settings size={20} />,
      action: onViewPresets,
      description: 'Saved filter presets'
    }
  ], [onExportData, onBulkTransfer, onReorderSuggestions, onViewPresets]);

  // Optimized dragging with useCallback - prevent menu opening after drag
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isOpen) return; // Don't drag when menu is open
    e.preventDefault();
    setIsDragging(true);
    setHasDragged(false); // Reset drag state
    const rect = toolbarRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  }, [isOpen]);

  // Handle toolbar click - only open if we didn't drag
  const handleToolbarClick = useCallback(() => {
    if (!hasDragged) {
      setIsOpen(!isOpen);
    }
  }, [hasDragged, isOpen]);

  // Ultra-fast dragging with CSS transforms and minimal state updates
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      // Mark that we've moved - prevents menu opening
      if (!hasDragged) {
        setHasDragged(true);
      }
      
      // Cancel previous animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      // Use CSS transform for instant, smooth movement
      animationFrameRef.current = requestAnimationFrame(() => {
        const newX = Math.max(24, Math.min(window.innerWidth - 80, e.clientX - dragOffset.x));
        const newY = Math.max(24, Math.min(window.innerHeight - 80, e.clientY - dragOffset.y));
        
        // Store position in ref for immediate access without re-renders
        currentPositionRef.current = { x: newX, y: newY };
        
        // Apply transform directly to DOM for maximum performance
        if (toolbarRef.current) {
          toolbarRef.current.style.transform = `translate(${newX}px, ${newY}px)`;
        }
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      
      // Update state with final position after drag completes
      setPosition(currentPositionRef.current);
      
      // Cancel any pending animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = undefined;
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove, { passive: true });
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isDragging, dragOffset, hasDragged]);

  // Memoized menu positioning calculations - only recalculate when needed
  const menuPositioning = useMemo(() => {
    if (!isOpen) return { direction: menuDirection, alignment: menuAlignment };
    
    const menuHeight = actions.length * 72 + 50; // Updated for larger buttons and spacing
    const menuWidth = 320; // Updated for larger tooltips
    
    // Vertical positioning
    const shouldOpenDown = position.y < window.innerHeight / 3 || position.y < menuHeight;
    const direction = shouldOpenDown ? 'down' : 'up';
    
    // Horizontal positioning  
    const spaceOnRight = window.innerWidth - position.x - 70;
    const shouldAlignRight = spaceOnRight < menuWidth && position.x > menuWidth;
    const alignment = shouldAlignRight ? 'right' : 'left';
    
    return { direction, alignment };
  }, [position, actions.length, isOpen, menuDirection, menuAlignment]);
  
  // Update state only when positioning actually changes
  useEffect(() => {
    if (menuPositioning.direction !== menuDirection) {
      setMenuDirection(menuPositioning.direction);
    }
    if (menuPositioning.alignment !== menuAlignment) {
      setMenuAlignment(menuPositioning.alignment);
    }
  }, [menuPositioning, menuDirection, menuAlignment]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Memoized action click handler
  const handleActionClick = useCallback((action: typeof actions[0]) => {
    action.action();
    setIsOpen(false);
  }, []);
  
  // Memoized critical products count for better performance
  const criticalProductsCount = useMemo(() => {
    return products.filter(p => p.stock < p.demand).length;
  }, [products]);

  return (
    <div
      ref={toolbarRef}
      className="fixed z-50 transition-all duration-200"
      style={{
        left: '0px',
        top: '0px',
        transform: `translate(${position.x}px, ${position.y}px) ${isOpen ? 'scale(1)' : 'scale(1)'}`,
        cursor: isDragging ? 'grabbing' : isOpen ? 'default' : 'grab'
      }}
    >
      {/* Main FAB Button */}
      <div className="relative">
        <button
          className={`w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group ${
            isOpen ? 'rotate-45 ring-4 ring-blue-300/50 animate-pulse' : 'rotate-0'
          }`}
          onClick={handleToolbarClick}
          onMouseDown={handleMouseDown}
          aria-label="Quick Actions Menu"
        >
          {isOpen ? <X size={20} /> : <Plus size={20} />}
        </button>

        {/* Actions Menu - Right next to main button */}
        {isOpen && (
          <div className={`absolute space-y-2 animate-in fade-in duration-200 ${
            menuDirection === 'up' 
              ? 'bottom-14 slide-in-from-bottom-2' 
              : 'top-14 slide-in-from-top-2'
          } ${
            menuAlignment === 'left' ? 'left-0' : 'right-0'
          }`}>
            {actions.map((action, index) => (
                              <div
                key={action.id}
                className={`flex items-center gap-3 group cursor-pointer ${
                  menuAlignment === 'right' ? 'flex-row-reverse' : ''
                }`}
                style={{ 
                  animationDelay: `${index * 50}ms`,
                  animation: `${menuDirection === 'up' ? 'fadeInUp' : 'fadeInDown'} 200ms ease-out forwards`,
                  opacity: 0,
                  transform: menuDirection === 'up' ? 'translateY(10px)' : 'translateY(-10px)'
                }}
                onClick={() => handleActionClick(action)}
              >
                {/* Enhanced Tooltip */}
                <div className="bg-gray-900 dark:bg-gray-800 text-white px-4 py-3 rounded-xl text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-2xl border border-gray-700 dark:border-gray-600 backdrop-blur-sm">
                  <div className="font-semibold text-white">{action.label}</div>
                  <div className="text-xs text-gray-300 mt-1">{action.description}</div>
                </div>

                {/* Enhanced Action Button */}
                <button
                  className="w-14 h-14 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center border-2 border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:scale-110 active:scale-95 backdrop-blur-sm"
                  aria-label={action.label}
                >
                  <div className="transform transition-transform duration-200 group-hover:scale-110">
                    {action.icon}
                  </div>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Enhanced Statistics Badge */}
      {!isOpen && criticalProductsCount > 0 && (
        <div className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white text-xs rounded-full w-7 h-7 flex items-center justify-center font-bold shadow-xl animate-bounce border-2 border-white dark:border-gray-800">
          {criticalProductsCount}
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInDown {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default QuickActionsToolbar;
