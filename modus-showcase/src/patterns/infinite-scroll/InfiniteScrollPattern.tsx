// @ts-nocheck
import { useState, useEffect, useRef } from 'react';
import { ModusWcCard, ModusWcTypography, ModusWcLoader } from '@trimble-oss/moduswebcomponents-react';

export function InfiniteScroll() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef(null);

  useEffect(() => {
    const loadInitialItems = () => {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setItems(prev => {
          const currentItems = Array.isArray(prev) ? prev : [];
          const newItems = Array.from({ length: 10 }, (_, i) => ({
            id: currentItems.length + i + 1,
            title: 'Item ' + (currentItems.length + i + 1)
          }));
          const updatedItems = [...currentItems, ...newItems];
          setHasMore(updatedItems.length < 50);
          return updatedItems;
        });
        setLoading(false);
      }, 1000);
    };

    loadInitialItems();
  }, []);

  useEffect(() => {
    const loadMoreItems = () => {
      if (loading || !hasMore) return;
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setItems(prev => {
          const currentItems = Array.isArray(prev) ? prev : [];
          const newItems = Array.from({ length: 10 }, (_, i) => ({
            id: currentItems.length + i + 1,
            title: 'Item ' + (currentItems.length + i + 1)
          }));
          const updatedItems = [...currentItems, ...newItems];
          setHasMore(updatedItems.length < 50);
          return updatedItems;
        });
        setLoading(false);
      }, 1000);
    };

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          loadMoreItems();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, loading]);

  const itemsArray = Array.isArray(items) ? items : [];

  return (
    <div className="grid gap-2">
      {itemsArray.map((item) => (
        <ModusWcCard key={item.id}>
          <ModusWcTypography slot="title" hierarchy="h4" size="md" weight="semibold" label={item.title} />
          <div className="p-4">
            <ModusWcTypography hierarchy="p" size="sm" customClass="text-[var(--muted-foreground)]" label="Scroll down to load more items..." />
          </div>
        </ModusWcCard>
      ))}
      <div ref={observerTarget} className="flex justify-center py-4">
        {loading && <ModusWcLoader variant="spinner" size="md" color="primary" aria-label="Loading" />}
        {!hasMore && <ModusWcTypography hierarchy="p" size="sm" customClass="text-[var(--muted-foreground)]" label="No more items to load" />}
      </div>
    </div>
  );
}

export default InfiniteScroll;
