// @ts-nocheck
import { useState, useEffect, useRef } from 'react';
import { ModusWcCard, ModusWcButton, ModusWcProgress, ModusWcBadge, ModusWcIcon, ModusWcTypography } from '@trimble-oss/moduswebcomponents-react';

export function BatchSync() {
  const [syncItems, setSyncItems] = useState([
    { id: '1', name: 'Document 1.pdf', status: 'pending', progress: 0 },
    { id: '2', name: 'Image 2.jpg', status: 'pending', progress: 0 },
    { id: '3', name: 'Spreadsheet.xlsx', status: 'pending', progress: 0 }
  ]);
  const [isSyncing, setIsSyncing] = useState(false);
  const progressRefs = useRef({});
  const intervalsRef = useRef([]);

  // Update progress bar values directly
  useEffect(() => {
    syncItems.forEach((sItem) => {
      if (progressRefs.current[sItem.id]) {
        progressRefs.current[sItem.id].value = sItem.progress;
      }
    });
  }, [syncItems]);

  const startSync = () => {
    // Clear any existing intervals
    intervalsRef.current.forEach(id => clearInterval(id));
    intervalsRef.current = [];
    
    setIsSyncing(true);
    setSyncItems(prev => prev.map(s => ({ ...s, status: 'syncing', progress: 0 })));

    // Create intervals for each item with staggered delays
    syncItems.forEach((sItem, idx) => {
      setTimeout(() => {
        const interval = setInterval(() => {
          setSyncItems(prev => prev.map(s => {
            if (s.id === sItem.id && s.status === 'syncing') {
              const newProgress = Math.min(100, s.progress + 10);
              if (newProgress >= 100) {
                clearInterval(interval);
                return { ...s, progress: 100, status: 'completed' };
              }
              return { ...s, progress: newProgress };
            }
            return s;
          }));
        }, 200);
        intervalsRef.current.push(interval);
      }, idx * 800);
    });

    setTimeout(() => {
      setIsSyncing(false);
    }, 4000);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <ModusWcIcon name="check_circle" size="sm" customClass="text-green-600" />;
      case 'syncing':
        return <ModusWcIcon name="sync" size="sm" customClass="text-[var(--modus-wc-color-primary)]" />;
      default:
        return <ModusWcIcon name="clock" size="sm" customClass="text-[var(--muted-foreground)]" />;
    }
  };

  const getBadgeProps = (status) => {
    switch (status) {
      case 'completed':
        return { variant: 'filled', color: 'success', label: 'Completed' };
      case 'syncing':
        return { variant: 'outlined', color: 'primary', label: 'Syncing' };
      default:
        return { variant: 'outlined', color: 'tertiary', label: 'Pending' };
    }
  };

  return (
    <ModusWcCard customClass="max-w-2xl mx-auto">
      <div slot="title">
        <ModusWcTypography hierarchy="h4" size="md" weight="semibold" label="Batch Sync" />
      </div>
      <div slot="actions" className="pt-4">
        <ModusWcButton 
          key={isSyncing ? 'syncing' : 'idle'}
          onButtonClick={startSync} 
          disabled={isSyncing}
          size="sm"
        >
          {isSyncing ? 'Syncing...' : 'Start Sync'}
        </ModusWcButton>
      </div>
      
      <div className="grid gap-3">
        {syncItems.map((sItem) => {
          const badgeProps = getBadgeProps(sItem.status);
          return (
            <div key={sItem.id} className="grid gap-1">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {getStatusIcon(sItem.status)}
                  <ModusWcTypography hierarchy="p" size="sm" label={sItem.name} />
                </div>
                <ModusWcBadge key={sItem.status} variant={badgeProps.variant} color={badgeProps.color}>
                  {badgeProps.label}
                </ModusWcBadge>
              </div>
              {sItem.status === 'syncing' && (
                <ModusWcProgress 
                  ref={(el) => { progressRefs.current[sItem.id] = el; }}
                  value={sItem.progress} 
                  max={100} 
                  customClass="h-1" 
                />
              )}
            </div>
          );
        })}
      </div>
    </ModusWcCard>
  );
}

export default BatchSync;
