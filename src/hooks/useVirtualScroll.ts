import { useState, useEffect, useCallback, useMemo } from 'react';

interface UseVirtualScrollProps {
  itemCount: number;
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

interface VirtualScrollResult {
  totalHeight: number;
  startIndex: number;
  endIndex: number;
  visibleItems: Array<{
    index: number;
    offsetTop: number;
  }>;
  scrollToIndex: (index: number) => void;
}

export const useVirtualScroll = ({
  itemCount,
  itemHeight,
  containerHeight,
  overscan = 5
}: UseVirtualScrollProps): VirtualScrollResult => {
  const [scrollTop, setScrollTop] = useState(0);

  // Calculate total height of all items
  const totalHeight = useMemo(() => itemCount * itemHeight, [itemCount, itemHeight]);

  // Calculate which items are visible
  const { startIndex, endIndex } = useMemo(() => {
    const viewportStart = Math.floor(scrollTop / itemHeight);
    const viewportEnd = Math.min(
      itemCount - 1,
      Math.floor((scrollTop + containerHeight) / itemHeight)
    );

    return {
      startIndex: Math.max(0, viewportStart - overscan),
      endIndex: Math.min(itemCount - 1, viewportEnd + overscan)
    };
  }, [scrollTop, itemHeight, containerHeight, itemCount, overscan]);

  // Create array of visible items with their positions
  const visibleItems = useMemo(() => {
    const items = [];
    for (let i = startIndex; i <= endIndex; i++) {
      items.push({
        index: i,
        offsetTop: i * itemHeight
      });
    }
    return items;
  }, [startIndex, endIndex, itemHeight]);

  // Function to scroll to a specific index
  const scrollToIndex = useCallback((index: number) => {
    const targetScrollTop = index * itemHeight;
    setScrollTop(targetScrollTop);
  }, [itemHeight]);

  return {
    totalHeight,
    startIndex,
    endIndex,
    visibleItems,
    scrollToIndex
  };
};

// Hook to handle scroll events
export const useScrollHandler = (
  onScroll: (scrollTop: number) => void
) => {
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    onScroll(scrollTop);
  }, [onScroll]);

  return handleScroll;
};
