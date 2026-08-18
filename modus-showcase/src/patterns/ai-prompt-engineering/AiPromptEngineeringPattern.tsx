// @ts-nocheck
import { useState } from 'react';
import { ModusWcCard, ModusWcTextarea, ModusWcButton, ModusWcTypography, ModusWcBadge } from '@trimble-oss/moduswebcomponents-react';

export function PromptEngineering() {
  const [prompt, setPrompt] = useState('');
  const [suggestions] = useState([
    'Add more context',
    'Be more specific',
    'Include examples',
    'Clarify the goal'
  ]);

  return (
    <ModusWcCard customClass="max-w-2xl mx-auto">
      <ModusWcTypography slot="title" hierarchy="h4" size="md" weight="semibold" label="Craft Your Prompt" />
      <div className="p-4 space-y-4">
        <ModusWcTextarea
          value={prompt}
          onInputChange={(e: CustomEvent) => setPrompt(e.detail?.target?.value || '')}
          placeholder="Enter your prompt here..."
          customClass="min-h-[200px]"
        />
        <div>
          <ModusWcTypography hierarchy="h5" size="sm" weight="medium" label="Suggestions" />
          <div className="flex flex-wrap gap-2 mt-2">
            {suggestions.map((suggestion, index) => (
              <ModusWcBadge
                key={index}
                variant="outlined"
                color="tertiary"
                customClass="cursor-pointer hover:bg-[var(--muted)]/20"
                onClick={() => setPrompt(prev => prev + ' ' + suggestion)}
              >
                {suggestion}
              </ModusWcBadge>
            ))}
          </div>
        </div>
        <ModusWcButton customClass="w-full">
          Generate Response
        </ModusWcButton>
      </div>
    </ModusWcCard>
  );
}

export default PromptEngineering;
