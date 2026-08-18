// @ts-nocheck
import { useState } from 'react';
import { ModusWcCard, ModusWcButton, ModusWcBadge, ModusWcIcon, ModusWcTypography } from '@trimble-oss/moduswebcomponents-react';

export function ManualSync() {
  const [syncStatus, setSyncStatus] = useState('idle');
  const [lastSynced, setLastSynced] = useState(null);

  const handleSync = () => {
    setSyncStatus('syncing');
    setTimeout(() => {
      setSyncStatus('success');
      setLastSynced(new Date());
      setTimeout(() => setSyncStatus('idle'), 2000);
    }, 1500);
  };

  const getBadgeProps = () => {
    switch (syncStatus) {
      case 'syncing':
        return { variant: 'outlined', color: 'tertiary', label: 'Syncing...' };
      case 'success':
        return { variant: 'filled', color: 'success', label: 'Synced' };
      case 'error':
        return { variant: 'filled', color: 'danger', label: 'Error' };
      default:
        return null;
    }
  };
  const badgeProps = getBadgeProps();

  return (
    <ModusWcCard customClass="max-w-md mx-auto">
      <div slot="title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '1rem' }}>
        <ModusWcTypography hierarchy="h4" size="md" weight="semibold" label="Data Sync" />
        {badgeProps && (
          <ModusWcBadge key={syncStatus} variant={badgeProps.variant} color={badgeProps.color}>
            {badgeProps.label}
          </ModusWcBadge>
        )}
      </div>
      
      <div>
        {lastSynced && (
          <ModusWcTypography 
            hierarchy="p" 
            size="sm" 
            customClass="text-[var(--muted-foreground)] mb-4" 
            label={`Last synced: ${lastSynced.toLocaleString()}`} 
          />
        )}

        <ModusWcButton 
          key={syncStatus}
          onButtonClick={handleSync}
          disabled={syncStatus === 'syncing'}
          customClass="w-full"
        >
          <ModusWcIcon name="refresh" size="sm" customClass="mr-2" />
          {syncStatus === 'syncing' ? 'Syncing...' : 'Sync Now'}
        </ModusWcButton>
      </div>
    </ModusWcCard>
  );
}

export default ManualSync;
