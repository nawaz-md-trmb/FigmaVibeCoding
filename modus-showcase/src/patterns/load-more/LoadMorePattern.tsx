// @ts-nocheck
import { useState } from 'react';
import { ModusWcCard, ModusWcButton, ModusWcTypography, ModusWcLoader } from '@trimble-oss/moduswebcomponents-react';

export function LoadMore() {
  const [items, setItems] = useState(
    Array.from({ length: 5 }, (_, i) => ({ id: i + 1, title: 'Item ' + (i + 1) }))
  );
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const handleLoadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setItems(prev => {
        const prevArray = Array.isArray(prev) ? prev : [];
        const newItems = Array.from({ length: 5 }, (_, i) => ({
          id: prevArray.length + i + 1,
          title: 'Item ' + (prevArray.length + i + 1)
        }));
        const updatedItems = [...prevArray, ...newItems];
        setHasMore(updatedItems.length < 20);
        return updatedItems;
      });
      setLoading(false);
    }, 1000);
  };

  const itemsArray = Array.isArray(items) ? items : [];

  return (
    <div className="grid gap-2">
      {itemsArray.map((item) => (
        <ModusWcCard key={item.id}>
          <ModusWcTypography slot="title" hierarchy="h4" size="md" weight="semibold" label={item.title} />
          <ModusWcTypography hierarchy="p" size="sm" customClass="text-[var(--muted-foreground)]" label="Click the button below to load more items." />
        </ModusWcCard>
      ))}
      {hasMore && (
        <div className="flex justify-center py-4">
          <ModusWcButton
            onButtonClick={handleLoadMore}
            disabled={loading}
            variant="outlined"
            color="tertiary"
          >
            {loading ? (
              <>
                <ModusWcLoader variant="spinner" size="sm" color="primary" customClass="mr-2" aria-label="Loading" />
                Loading...
              </>
            ) : (
              'Load More'
            )}
          </ModusWcButton>
        </div>
      )}
      {!hasMore && (
        <div className="text-center py-4">
          <ModusWcTypography hierarchy="p" size="sm" customClass="text-[var(--muted-foreground)]" label="No more items to load" />
        </div>
      )}
    </div>
  );
}

export default LoadMore;
