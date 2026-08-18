// @ts-nocheck
import { useLayoutEffect, useRef, useCallback } from 'react';
import { ModusWcBreadcrumbs } from '@trimble-oss/moduswebcomponents-react';

export function Breadcrumbs() {
  const breadcrumbsRef = useRef(null);
  
  const defaultItems = [
    { label: 'Home', url: '#' },
    { label: 'Products', url: '#' },
    { label: 'Electronics', url: '#' },
    { label: 'Current Page' }
  ];

  const setItems = useCallback(() => {
    if (breadcrumbsRef.current) {
      breadcrumbsRef.current.items = defaultItems;
    }
  }, []);

  // Use callback ref to set items immediately when component mounts
  const breadcrumbsCallbackRef = useCallback((node) => {
    breadcrumbsRef.current = node;
    if (node) {
      node.items = defaultItems;
    }
  }, []);

  // Also use useLayoutEffect to set items synchronously
  useLayoutEffect(() => {
    setItems();
    // Set again after a microtask to ensure it's set
    const timeoutId = setTimeout(setItems, 0);
    return () => clearTimeout(timeoutId);
  }, [setItems]);

  return (
    <ModusWcBreadcrumbs
      ref={breadcrumbsCallbackRef}
      aria-label="Breadcrumb"
      customClass="text-sm"
    />
  );
}

export default Breadcrumbs;
