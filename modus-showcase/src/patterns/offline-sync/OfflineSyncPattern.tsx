// @ts-nocheck
import { useState, useEffect } from 'react';
import { ModusWcCard, ModusWcBadge, ModusWcButton, ModusWcIcon, ModusWcTypography, ModusWcAlert, ModusWcLoader } from '@trimble-oss/moduswebcomponents-react';

export function OfflineSync() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [queuedItems, setQueuedItems] = useState([
    { id: '1', action: 'Update document', timestamp: new Date(), status: 'pending' },
    { id: '2', action: 'Create note', timestamp: new Date(), status: 'pending' }
  ]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (isOnline && queuedItems.some(q => q.status === 'pending')) {
      setQueuedItems(prev => prev.map(q => 
        q.status === 'pending' ? { ...q, status: 'syncing' } : q
      ));
      
      setTimeout(() => {
        setQueuedItems(prev => prev.map(q => 
          q.status === 'syncing' ? { ...q, status: 'completed' } : q
        ));
      }, 2000);
    }
  }, [isOnline, queuedItems]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <ModusWcIcon name="check_circle" size="sm" customClass="text-green-600" />;
      case 'syncing':
        return <ModusWcLoader variant="spinner" size="sm" color="primary" aria-label="Syncing" />;
      case 'failed':
        return <ModusWcIcon name="warning" size="sm" customClass="text-red-600" />;
      default:
        return <ModusWcIcon name="clock" size="sm" customClass="text-[var(--muted-foreground)]" />;
    }
  };

  const pendingCount = queuedItems.filter(q => q.status === 'pending').length;

  return (
    <ModusWcCard customClass="max-w-2xl mx-auto">
      {!isOnline && (
        <ModusWcAlert
          variant="warning"
          icon="wifi_off"
          alertDescription="You're currently offline. Changes will sync when connection is restored."
        />
      )}
      <div slot="title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '1rem' }}>
        <ModusWcTypography hierarchy="h4" size="md" weight="semibold" label="Sync Queue" />
        <ModusWcBadge key={isOnline ? 'online' : 'offline'} variant={isOnline ? 'filled' : 'outlined'} color={isOnline ? 'success' : 'warning'}>
          {isOnline ? 'Online' : 'Offline'}
        </ModusWcBadge>
      </div>

      <div className="grid gap-4">
        {pendingCount > 0 && (
          <ModusWcTypography 
            hierarchy="p" 
            size="sm" 
            customClass="text-[var(--muted-foreground)]" 
            label={`${pendingCount} ${pendingCount !== 1 ? 'items' : 'item'} pending sync`} 
          />
        )}

        <div className="grid gap-2">
          {queuedItems.map((qItem) => {
            const getBadgeProps = () => {
              switch (qItem.status) {
                case 'completed':
                  return { variant: 'filled', color: 'success', label: 'Completed' };
                case 'syncing':
                  return { variant: 'outlined', color: 'primary', label: 'Syncing' };
                case 'failed':
                  return { variant: 'filled', color: 'danger', label: 'Failed' };
                default:
                  return { variant: 'outlined', color: 'tertiary', label: 'Pending' };
              }
            };
            const badgeProps = getBadgeProps();
            
            return (
              <div key={qItem.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', border: '1px solid var(--modus-wc-color-base-200)', borderRadius: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {getStatusIcon(qItem.status)}
                  <div>
                    <ModusWcTypography hierarchy="p" size="sm" weight="semibold" label={qItem.action} />
                    <ModusWcTypography 
                      hierarchy="p" 
                      size="xs" 
                      customClass="text-[var(--muted-foreground)]" 
                      label={qItem.timestamp.toLocaleString()} 
                    />
                  </div>
                </div>
                <ModusWcBadge key={qItem.status} variant={badgeProps.variant} color={badgeProps.color}>
                  {badgeProps.label}
                </ModusWcBadge>
              </div>
            );
          })}
        </div>

        {!isOnline && pendingCount > 0 && (
          <ModusWcButton 
            variant="outlined" 
            color="tertiary" 
            customClass="w-full"
            disabled
          >
            Waiting for connection...
          </ModusWcButton>
        )}
      </div>
    </ModusWcCard>
  );
}

export default OfflineSync;
