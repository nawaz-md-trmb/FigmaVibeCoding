// @ts-nocheck
import { useState, useEffect, useRef } from 'react';
import { ModusWcModal, ModusWcTextInput, ModusWcButton, ModusWcIcon, ModusWcTypography, ModusWcBadge } from '@trimble-oss/moduswebcomponents-react';

export function CommandPalette() {
  const modalId = 'command-palette-modal';
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  const commands = [
    { id: '1', label: 'New Document', category: 'File', icon: 'file_new', shortcut: '⌘N' },
    { id: '2', label: 'Open File', category: 'File', icon: 'folder_open', shortcut: '⌘O' },
    { id: '3', label: 'Save', category: 'File', icon: 'save_disk', shortcut: '⌘S' },
    { id: '4', label: 'Search', category: 'Edit', icon: 'search', shortcut: '⌘F' },
    { id: '5', label: 'Settings', category: 'Preferences', icon: 'settings', shortcut: '⌘,' }
  ];

  const filteredCommands = query.length === 0 
    ? commands 
    : commands.filter(cmd =>
        cmd.label.toLowerCase().includes(query.toLowerCase()) ||
        cmd.category.toLowerCase().includes(query.toLowerCase())
      );

  const handleOpenModal = () => {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.showModal();
    }
  };

  const handleCloseModal = () => {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.close();
    }
    setQuery('');
  };

  const handleSelect = (command) => {
    console.log('Selected:', command.label);
    handleCloseModal();
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        handleOpenModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <ModusWcButton variant="outlined" color="tertiary" onButtonClick={handleOpenModal}>
        Open Command Palette (⌘K)
      </ModusWcButton>
      <ModusWcModal modalId={modalId} customClass="sm:max-w-lg">
        <ModusWcTypography slot="header" hierarchy="h2" size="lg" weight="semibold" label="Command Palette" />
        <div slot="content" className="grid gap-4">
          <ModusWcTextInput
            ref={inputRef}
            value={query}
            onInputChange={(e) => {
              const newValue = e.detail?.target?.value || '';
              setQuery(newValue);
              setSelectedIndex(0);
            }}
            placeholder="Type a command or search..."
            includeSearch={true}
          />
          <div className="max-h-64 overflow-y-auto">
            {filteredCommands.length > 0 ? (
              <div className="grid gap-1">
                {filteredCommands.map((command, index) => (
                  <ModusWcButton
                    key={command.id}
                    variant="borderless"
                    color="tertiary"
                    customClass={`w-full ${index === selectedIndex ? 'bg-[var(--muted)]/20' : ''}`}
                    onButtonClick={() => handleSelect(command)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <ModusWcIcon name={command.icon} size="sm" decorative />
                        <div className="text-left">
                          <ModusWcTypography hierarchy="p" size="sm" label={command.label} />
                          <ModusWcTypography hierarchy="p" size="xs" customClass="text-[var(--muted-foreground)]" label={command.category} />
                        </div>
                      </div>
                      {command.shortcut && (
                        <ModusWcBadge variant="outlined" color="tertiary">
                          {command.shortcut}
                        </ModusWcBadge>
                      )}
                    </div>
                  </ModusWcButton>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ModusWcTypography hierarchy="p" size="sm" customClass="text-[var(--muted-foreground)]" label="No commands found" />
              </div>
            )}
          </div>
        </div>
      </ModusWcModal>
    </>
  );
}

export default CommandPalette;
