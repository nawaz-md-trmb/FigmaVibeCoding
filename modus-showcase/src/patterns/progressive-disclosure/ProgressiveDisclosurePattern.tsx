// @ts-nocheck
import { useState, useEffect, useRef } from 'react';
import { ModusWcCard, ModusWcTextInput, ModusWcButton, ModusWcCollapse, ModusWcTypography } from '@trimble-oss/moduswebcomponents-react';

export function ProgressiveDisclosure() {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const collapseRef = useRef(null);

  useEffect(() => {
    if (collapseRef.current) {
      collapseRef.current.options = { title: 'Advanced Settings' };
    }
  }, []);

  return (
    <ModusWcCard customClass="max-w-md mx-auto">
        <ModusWcTypography slot="title" hierarchy="h4" size="md" weight="semibold" label="User Settings" />
        <div className="grid gap-2">
          <ModusWcTextInput label="Name" placeholder="Enter your name" />
          <ModusWcTextInput label="Email" placeholder="Enter your email" type="email" />

            <ModusWcCollapse
              ref={collapseRef}
              expanded={showAdvanced}
              onExpandedChange={(e) => setShowAdvanced(e.detail.expanded)}
              bordered={false}
            >
              <div slot="content" className="grid gap-2 pt-2">
                <ModusWcTextInput label="API Key" placeholder="Enter API key" type="password" />
                <ModusWcTextInput label="Webhook URL" placeholder="Enter webhook URL" />
              </div>
            </ModusWcCollapse>
        </div>
      </ModusWcCard>
  );
}

export default ProgressiveDisclosure;
