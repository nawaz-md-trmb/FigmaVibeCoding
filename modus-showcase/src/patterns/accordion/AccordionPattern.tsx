// @ts-nocheck
import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import { ModusWcAccordion, ModusWcCollapse } from '@trimble-oss/moduswebcomponents-react';

export function BasicAccordion() {
  const collapse1Ref = useRef(null) as RefObject<HTMLModusWcCollapseElement | null>;
  const collapse2Ref = useRef(null) as RefObject<HTMLModusWcCollapseElement | null>;

  useEffect(() => {
    if (collapse1Ref.current) {
      collapse1Ref.current.options = { title: 'Is it accessible?' };
    }
    if (collapse2Ref.current) {
      collapse2Ref.current.options = { title: 'Is it styled?' };
    }
  }, []);

  return (
    <ModusWcAccordion customClass="w-full">
          <ModusWcCollapse
            ref={collapse1Ref}
            expanded={false}
          >
            <div slot="content">
              Yes. It adheres to the WAI-ARIA design pattern.
            </div>
          </ModusWcCollapse>
          <ModusWcCollapse
            ref={collapse2Ref}
            expanded={false}
          >
            <div slot="content">
              Yes. It comes with default styles that match the other components aesthetic.
            </div>
          </ModusWcCollapse>
    </ModusWcAccordion>
  );
}

export default BasicAccordion;
