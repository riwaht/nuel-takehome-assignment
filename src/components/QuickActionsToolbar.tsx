import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
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
  const [hasDragged, setHasDragged] = useState(false);
  
  // Use refs to minimize state updates and improve performance
  const toolbarRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const currentPositionRef = useRef({ x: 24, y: 24 });
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const criticalCountRef = useRef(0);
  const justClosedMenuRef = useRef(false);
  
  // Initialize position ref
  useEffect(() => {
    currentPositionRef.current = position;
  }, [position]);

  // Memoized actions configuration to prevent recreation on every render
  const actions = useMemo(() => [
    {
      id: 'export-csv',
      label: 'Export CSV',
      icon: <Download size={18} />,
      action: () => onExportData('csv'),
      description: 'Download current data as CSV'
    },
    {
      id: 'export-json',
      label: 'Export JSON',
      icon: <FileText size={18} />,
      action: () => onExportData('json'),
      description: 'Download current data as JSON'
    },
    {
      id: 'bulk-transfer',
      label: 'Bulk Transfer',
      icon: <ArrowRightLeft size={18} />,
      action: onBulkTransfer,
      description: 'Transfer stock between warehouses'
    },
    {
      id: 'reorder-suggestions',
      label: 'Reorder Alert',
      icon: <TrendingUp size={18} />,
      action: onReorderSuggestions,
      description: 'View items needing reorder'
    },
    {
      id: 'view-presets',
      label: 'View Presets',
      icon: <Settings size={18} />,
      action: onViewPresets,
      description: 'Saved filter presets'
    }
  ], [onExportData, onBulkTransfer, onReorderSuggestions, onViewPresets]);

  // Memoized critical products count for performance
  const criticalProductsCount = useMemo(() => {
    const count = products.filter(p => p.stock < p.demand).length;
    criticalCountRef.current = count;
    return count;
  }, [products]);

  // Calculate optimal tooltip direction based on available space and collision avoidance
  const calculateOptimalTooltipDirection = useCallback((
    buttonX: number, 
    buttonY: number, 
    toolbarScreenX: number, 
    toolbarScreenY: number,
    allButtonPositions: Array<{ x: number; y: number }>,
    currentIndex: number
  ): 'left' | 'right' | 'top' | 'bottom' => {
    const screenWidth = window.innerWidth || 1000;
    const screenHeight = window.innerHeight || 800;
    const tooltipWidth = 280; // Match max-w-[280px] from CSS
    const tooltipHeight = 85; // Updated for px-4 py-3 padding and two-line content with better spacing
    const margin = 10; // Safety margin from screen edges
    const buttonSize = 44;
    
    // Calculate button's screen position
    const buttonScreenX = toolbarScreenX + buttonX - buttonSize / 2;
    const buttonScreenY = toolbarScreenY + buttonY - buttonSize / 2;
    
    // Calculate available space in each direction
    const spaceLeft = buttonScreenX - margin;
    const spaceRight = screenWidth - (buttonScreenX + buttonSize) - margin;
    const spaceTop = buttonScreenY - margin;
    const spaceBottom = screenHeight - (buttonScreenY + buttonSize) - margin;
    
    // Check for collisions with other buttons in each direction
    const checkCollision = (direction: 'left' | 'right' | 'top' | 'bottom'): boolean => {
      let tooltipBounds: { left: number; right: number; top: number; bottom: number };
      
      switch (direction) {
        case 'left':
          tooltipBounds = {
            left: buttonScreenX - tooltipWidth - 8,
            right: buttonScreenX - 8,
            top: buttonScreenY - tooltipHeight / 2,
            bottom: buttonScreenY + buttonSize + tooltipHeight / 2
          };
          break;
        case 'right':
          tooltipBounds = {
            left: buttonScreenX + buttonSize + 8,
            right: buttonScreenX + buttonSize + tooltipWidth + 8,
            top: buttonScreenY - tooltipHeight / 2,
            bottom: buttonScreenY + buttonSize + tooltipHeight / 2
          };
          break;
        case 'top':
          tooltipBounds = {
            left: buttonScreenX - tooltipWidth / 2,
            right: buttonScreenX + buttonSize + tooltipWidth / 2,
            top: buttonScreenY - tooltipHeight - 8,
            bottom: buttonScreenY - 8
          };
          break;
        case 'bottom':
          tooltipBounds = {
            left: buttonScreenX - tooltipWidth / 2,
            right: buttonScreenX + buttonSize + tooltipWidth / 2,
            top: buttonScreenY + buttonSize + 8,
            bottom: buttonScreenY + buttonSize + tooltipHeight + 8
          };
          break;
      }
      
      // Check collision with other buttons
      for (let i = 0; i < allButtonPositions.length; i++) {
        if (i === currentIndex) continue;
        
        const otherButton = allButtonPositions[i];
        const otherButtonScreenX = toolbarScreenX + otherButton.x - buttonSize / 2;
        const otherButtonScreenY = toolbarScreenY + otherButton.y - buttonSize / 2;
        
        const buttonBounds = {
          left: otherButtonScreenX,
          right: otherButtonScreenX + buttonSize,
          top: otherButtonScreenY,
          bottom: otherButtonScreenY + buttonSize
        };
        
        // Check if tooltip bounds intersect with button bounds
        if (!(tooltipBounds.right < buttonBounds.left || 
              tooltipBounds.left > buttonBounds.right || 
              tooltipBounds.bottom < buttonBounds.top || 
              tooltipBounds.top > buttonBounds.bottom)) {
          return true; // Collision detected
        }
      }
      
      return false;
    };
    
    // Score each direction (higher is better)
    const directions = [
      { dir: 'right' as const, space: spaceRight, hasCollision: checkCollision('right') },
      { dir: 'left' as const, space: spaceLeft, hasCollision: checkCollision('left') },
      { dir: 'bottom' as const, space: spaceBottom, hasCollision: checkCollision('bottom') },
      { dir: 'top' as const, space: spaceTop, hasCollision: checkCollision('top') }
    ];
    
    // Filter out directions with insufficient space or collisions
    const validDirections = directions.filter(d => 
      d.space >= (d.dir === 'left' || d.dir === 'right' ? tooltipWidth : tooltipHeight) &&
      !d.hasCollision
    );
    
    // If no valid directions, use the one with most space
    const candidates = validDirections.length > 0 ? validDirections : directions;
    
    // Sort by available space (descending)
    candidates.sort((a, b) => b.space - a.space);
    
    return candidates[0].dir;
  }, []);

  // Calculate positions for action buttons - circular in center, linear on sides
  const calculateCircularPositions = useMemo((): Array<{ x: number; y: number; tooltipDirection: 'left' | 'right' | 'top' | 'bottom' }> => {
    if (!isOpen) return [];
    
    const radius = 70;
    const centerX = 28; // Half of button width (56px)
    const centerY = 28; // Half of button height (56px)
    const buttonSize = 44; // Button size
    const spacing = 52; // Spacing between buttons in linear layout
    const positions: Array<{ x: number; y: number; tooltipDirection: 'left' | 'right' | 'top' | 'bottom' }> = [];
    
    // Calculate screen bounds
    const screenWidth = window.innerWidth || 1000;
    const screenHeight = window.innerHeight || 800;
    const toolbarScreenX = position.x;
    const toolbarScreenY = position.y;
    
    // Determine if we should use side layout based on proximity to edges
    const distanceFromLeft = toolbarScreenX;
    const distanceFromRight = screenWidth - toolbarScreenX;
    const distanceFromTop = toolbarScreenY;
    const distanceFromBottom = screenHeight - toolbarScreenY;
    
    const edgeThreshold = 150; // Distance from edge to trigger side layout
    const isNearLeftEdge = distanceFromLeft < edgeThreshold;
    const isNearRightEdge = distanceFromRight < edgeThreshold;
    const isNearTopEdge = distanceFromTop < edgeThreshold;
    const isNearBottomEdge = distanceFromBottom < edgeThreshold;
    
    const isNearAnyEdge = isNearLeftEdge || isNearRightEdge || isNearTopEdge || isNearBottomEdge;
    
    // First pass: calculate button positions
    const buttonPositions: Array<{ x: number; y: number }> = [];
    
    if (isNearAnyEdge) {
      // Use linear side layout when near edges
      const totalHeight = (actions.length - 1) * spacing;
      const startY = centerY - totalHeight / 2;
      
      let sideOffset: number;
      
      if (isNearLeftEdge) {
        sideOffset = 65; // To the right of main button
      } else if (isNearRightEdge) {
        sideOffset = -65; // To the left of main button  
      } else {
        sideOffset = 0; // Centered horizontally
      }
      
      actions.forEach((_, index) => {
        let x, y;
        
        if (isNearTopEdge || isNearBottomEdge) {
          // Vertical layout
          x = centerX + sideOffset;
          y = isNearTopEdge ? centerY + 65 + (index * spacing) : centerY - 65 - (index * spacing);
        } else {
          // Horizontal layout  
          x = centerX + sideOffset;
          y = startY + (index * spacing);
        }
        
        buttonPositions.push({ x, y });
      });
    } else {
      // Use circular layout when in center of screen
      const startAngle = -Math.PI / 2; // Start at top
      const angleStep = (2 * Math.PI) / actions.length;
      
      actions.forEach((_, index) => {
        const angle = startAngle + (index * angleStep);
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        
        buttonPositions.push({ x, y });
      });
    }
    
    // Second pass: calculate optimal tooltip directions
    buttonPositions.forEach((pos, index) => {
      const tooltipDirection = calculateOptimalTooltipDirection(
        pos.x, 
        pos.y, 
        toolbarScreenX, 
        toolbarScreenY,
        buttonPositions,
        index
      );
      
      positions.push({ ...pos, tooltipDirection });
    });
    
    return positions;
  }, [isOpen, position.x, position.y, actions.length, calculateOptimalTooltipDirection]);

  // Optimized dragging with useCallback - close menu and allow drag
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    
    // If menu is open, close it and mark that we just closed it
    if (isOpen) {
      setIsOpen(false);
      justClosedMenuRef.current = true;
      // Reset the flag after a short delay to allow normal clicking later
      setTimeout(() => {
        justClosedMenuRef.current = false;
      }, 100);
    } else {
      justClosedMenuRef.current = false;
    }
    
    setIsDragging(true);
    setHasDragged(false); // Reset drag state
    const rect = toolbarRef.current?.getBoundingClientRect();
    if (rect) {
      dragOffsetRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  }, [isOpen]);

  // Handle toolbar click - only open if we didn't drag and didn't just close menu
  const handleToolbarClick = useCallback(() => {
    if (!hasDragged && !justClosedMenuRef.current) {
      setIsOpen(!isOpen);
    }
  }, [hasDragged, isOpen]);

  // Ultra-fast dragging with CSS transforms and minimal state updates
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      // Mark that we've moved - prevents menu opening and reset close flag
      if (!hasDragged) {
        setHasDragged(true);
        justClosedMenuRef.current = false; // Reset since we're actually dragging
      }
      
      // Cancel previous animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      // Use CSS transform for instant, smooth movement
      animationFrameRef.current = requestAnimationFrame(() => {
        const newX = Math.max(24, Math.min(window.innerWidth - 80, e.clientX - dragOffsetRef.current.x));
        const newY = Math.max(24, Math.min(window.innerHeight - 80, e.clientY - dragOffsetRef.current.y));
        
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
  }, [isDragging, hasDragged]);



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

  return (
    <div
      ref={toolbarRef}
      className="fixed z-50 transition-all duration-200"
      style={{
        left: '0px',
        top: '0px',
        transform: `translate(${position.x}px, ${position.y}px)`,
        cursor: isDragging ? 'grabbing' : isOpen ? 'default' : 'grab'
      }}
    >
      {/* Circular Action Buttons */}
      {isOpen && (
        <>
          {actions.map((action, index) => {
            // Use circular positioning if available, otherwise use simple fallback
            const buttonPosition = calculateCircularPositions[index];
            let leftPos, topPos;
            
            if (buttonPosition) {
              leftPos = buttonPosition.x - 22;
              topPos = buttonPosition.y - 22;
            } else {
              // Fallback: simple vertical stack to the right of the main button
              leftPos = 65; // 65px to the right of center
              topPos = -104 + (index * 52); // Stack vertically with proper spacing
            }
            
            // Debug positions (uncomment if needed)
            // console.log(`Button ${index}: x=${leftPos}, y=${topPos}, hasCircularPos=${!!buttonPosition}`);
            
            return (
              <div
                key={action.id}
                className="absolute group cursor-pointer circular-button-animate z-10"
                style={{
                  left: `${leftPos}px`,
                  top: `${topPos}px`,
                  '--animation-delay': `${index * 80}ms`
                } as React.CSSProperties}
                onClick={() => handleActionClick(action)}
              >
                {/* Action Button */}
                <button
                  className="w-11 h-11 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center border-2 border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:scale-110 active:scale-95 backdrop-blur-sm"
                  aria-label={action.label}
                >
                  <div className="transform transition-transform duration-200 group-hover:scale-110">
                    {action.icon}
                  </div>
                </button>

                {/* Smart Tooltip with Optimal Positioning */}
                <div 
                  className={`absolute bg-gray-900 dark:bg-gray-800 text-white px-4 py-3 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-xl border border-gray-700 dark:border-gray-600 backdrop-blur-sm z-30 w-max max-w-[280px] ${
                    buttonPosition?.tooltipDirection === 'top'
                      ? 'bottom-full mb-2 left-1/2 -translate-x-1/2'
                      : buttonPosition?.tooltipDirection === 'bottom'
                      ? 'top-full mt-2 left-1/2 -translate-x-1/2'
                      : buttonPosition?.tooltipDirection === 'left'
                      ? 'right-full mr-2 top-1/2 -translate-y-1/2'
                      : 'left-full ml-2 top-1/2 -translate-y-1/2'
                  }`}
                  style={{
                    pointerEvents: 'none'
                  }}
                >
                  <div className="font-semibold text-white leading-tight break-words">{action.label}</div>
                  <div className="text-xs text-gray-300 mt-1 leading-relaxed break-words">{action.description}</div>
                  
                  {/* Tooltip Arrow */}
                  <div 
                    className={`absolute w-0 h-0 ${
                      buttonPosition?.tooltipDirection === 'top'
                        ? 'top-full left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-t-gray-900 dark:border-t-gray-800 border-l-transparent border-r-transparent'
                        : buttonPosition?.tooltipDirection === 'bottom'
                        ? 'bottom-full left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-b-4 border-b-gray-900 dark:border-b-gray-800 border-l-transparent border-r-transparent'
                        : buttonPosition?.tooltipDirection === 'left'
                        ? 'top-1/2 -translate-y-1/2 left-full border-t-4 border-b-4 border-l-4 border-l-gray-900 dark:border-l-gray-800 border-t-transparent border-b-transparent'
                        : 'top-1/2 -translate-y-1/2 right-full border-t-4 border-b-4 border-r-4 border-r-gray-900 dark:border-r-gray-800 border-t-transparent border-b-transparent'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </>
      )}

      {/* Main FAB Button */}
      <div className="relative">
        <button
          className={`w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group relative z-20 ${
            isOpen ? 'rotate-45 ring-4 ring-blue-300/50 scale-110' : 'rotate-0 scale-100'
          }`}
          onClick={handleToolbarClick}
          onMouseDown={handleMouseDown}
          aria-label="Quick Actions Menu"
        >
          {isOpen ? <X size={20} /> : <Plus size={20} />}
        </button>

        {/* Enhanced Statistics Badge */}
        {!isOpen && criticalProductsCount > 0 && (
          <div className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg animate-bounce border-2 border-white dark:border-gray-800 z-30">
            {criticalProductsCount}
          </div>
        )}
      </div>

      <style>{`
        .circular-button-animate {
          opacity: 0;
          transform: scale(0.3) rotate(180deg);
          animation: circularFadeIn 400ms ease-out forwards;
          animation-delay: var(--animation-delay);
        }
        
        @keyframes circularFadeIn {
          0% {
            opacity: 0;
            transform: scale(0.3) rotate(180deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }
        
        /* Enhanced tooltip styling */
        .group:hover [class*="bg-gray-900"],
        .group:hover [class*="dark:bg-gray-800"] {
          /* Ensure proper text containment */
          word-wrap: break-word;
          hyphens: auto;
        }
      `}</style>
    </div>
  );
};

export default QuickActionsToolbar;
