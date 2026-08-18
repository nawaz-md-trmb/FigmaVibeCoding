// @ts-nocheck
import { useState, useEffect } from 'react';
import { ModusWcCard, ModusWcTextarea, ModusWcBadge, ModusWcTypography } from '@trimble-oss/moduswebcomponents-react';

export function AutoSaveSync() {
  const [content, setContent] = useState('');
  const [saveStatus, setSaveStatus] = useState('saved');
  const [lastSaved, setLastSaved] = useState(null);

  useEffect(() => {
    if (content.length === 0) {
      setSaveStatus('saved');
      return;
    }

    setSaveStatus('unsaved');
    const timer = setTimeout(() => {
      setSaveStatus('saving');
      // Simulate save
      setTimeout(() => {
        setSaveStatus('saved');
        setLastSaved(new Date());
      }, 500);
    }, 2000);

    return () => clearTimeout(timer);
  }, [content]);

  const getBadgeProps = () => {
    switch (saveStatus) {
      case 'saving':
        return { variant: 'outlined', color: 'tertiary', label: 'Saving...' };
      case 'saved':
        return { variant: 'filled', color: 'success', label: 'Saved' };
      default:
        return { variant: 'outlined', color: 'tertiary', label: 'Unsaved changes' };
    }
  };
  const badgeProps = getBadgeProps();

  return (
    <ModusWcCard customClass="max-w-2xl mx-auto">
      <div slot="title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '1rem' }}>
        <div>
          <ModusWcTypography hierarchy="h4" size="md" weight="semibold" label="Document Editor" />
          {lastSaved && saveStatus === 'saved' && (
            <ModusWcTypography 
              hierarchy="p" 
              size="xs" 
              customClass="text-[var(--muted-foreground)]" 
              label={`Last saved: ${lastSaved.toLocaleTimeString()}`} 
            />
          )}
        </div>
        <ModusWcBadge key={saveStatus} variant={badgeProps.variant} color={badgeProps.color}>
          {badgeProps.label}
        </ModusWcBadge>
      </div>
      <div>
        <ModusWcTextarea
          value={content}
          onInputChange={(e) => setContent(e.detail?.target?.value || '')}
          placeholder="Start typing... Your changes will be saved automatically."
          customClass="min-h-[100px]"
        />
      </div>
    </ModusWcCard>
  );
}

export default AutoSaveSync;
