// @ts-nocheck
import { useState, useEffect, useRef } from 'react';
import { ModusWcCard, ModusWcBadge, ModusWcIcon, ModusWcTypography, ModusWcAvatar, ModusWcLoader } from '@trimble-oss/moduswebcomponents-react';

export function RealTimeSync() {
  const [syncStatus, setSyncStatus] = useState('synced');
  const intervalRef = useRef(null);
  const collaborators = [
    { id: '1', name: 'Alice', isActive: true },
    { id: '2', name: 'Bob', isActive: true }
  ];

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      setSyncStatus(prev => prev === 'synced' ? 'syncing' : 'synced');
    }, 3000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const badgeVariant = syncStatus === 'synced' ? 'filled' : 'outlined';
  const badgeColor = syncStatus === 'synced' ? 'success' : 'tertiary';
  const badgeText = syncStatus === 'synced' ? 'Synced' : 'Syncing...';

  return (
    <ModusWcCard customClass="max-w-md mx-auto">
      <div slot="title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '2rem' }}>
        <ModusWcTypography hierarchy="h4" size="md" weight="semibold" label="Real-time Sync" />
        <ModusWcBadge key={syncStatus} variant={badgeVariant} color={badgeColor}>
          {badgeText}
        </ModusWcBadge>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-2">
          <ModusWcTypography hierarchy="h5" size="sm" weight="semibold" label="Active Collaborators" />
          {collaborators.map((collab) => (
            <div key={collab.id} className="flex items-center justify-between border border-[var(--modus-wc-color-base-200)] rounded-lg">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ModusWcAvatar 
                  displayText={collab.name.charAt(0)} 
                  size="24"
                />
                <ModusWcTypography hierarchy="p" size="sm" label={collab.name} />
              </div>
              {collab.isActive && (
                <ModusWcBadge variant="filled" color="success">
                  Active
                </ModusWcBadge>
              )}
            </div>
          ))}
        </div>

        <ModusWcTypography 
          hierarchy="p" 
          size="xs" 
          customClass="text-[var(--muted-foreground)]" 
          label="Changes sync automatically in real-time" 
        />
      </div>
    </ModusWcCard>
  );
}

export default RealTimeSync;
