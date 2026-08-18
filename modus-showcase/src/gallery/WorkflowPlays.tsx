import { useState } from 'react'
import { ModusWcAlert, ModusWcButton, ModusWcCard, ModusWcTypography } from '@trimble-oss/moduswebcomponents-react'
import { PatternDemo } from './PatternDemo'
import { PATTERN_META } from './patternMeta'

type Play = {
  id: string
  title: string
  story: string
  steps: { patternId: string; action: string }[]
}

const PLAYS: Play[] = [
  {
    id: 'yard-board',
    title: '1. North Yard job board',
    story:
      'A superintendent opens the yard board Monday morning. Empty and loading states show first, then KPIs, the table, filters, and paging as data arrives.',
    steps: [
      { patternId: 'empty-states', action: 'No jobs yet — empty state before the first sync.' },
      { patternId: 'loading-states', action: 'Pull to refresh — skeleton/loading while sites load.' },
      { patternId: 'stat', action: 'Dashboard KPIs render as soon as counts exist.' },
      { patternId: 'filter-header', action: 'Narrow by status from the header chips.' },
      { patternId: 'data-table', action: 'Scan the work-order table.' },
      { patternId: 'collapsible-table', action: 'Expand one row for crew notes.' },
      { patternId: 'pagination-footer', action: 'Jump pages from the table footer.' },
      { patternId: 'load-more', action: 'Mobile: tap Load more instead of pager.' },
    ],
  },
  {
    id: 'edit-wo',
    title: '2. Edit a work order',
    story:
      'A coordinator opens a list, inspects in a drawer, confirms in a modal, then edits cells or walks a wizard for a new job.',
    steps: [
      { patternId: 'list-view', action: 'Pick a work order from the list.' },
      { patternId: 'drawer', action: 'Open inspector — right rail with fields.' },
      { patternId: 'modal', action: 'Save with conflicts — confirm in a modal.' },
      { patternId: 'inline-editable-table', action: 'Double-click a cell to edit inline.' },
      { patternId: 'editable-table', action: 'Row pencil for a full-row editor.' },
      { patternId: 'fieldset', action: 'Grouped fields on the details form.' },
      { patternId: 'multi-step-form', action: 'New job: Next through the wizard.' },
      { patternId: 'auto-save-sync', action: 'Idle on the form — autosave toast.' },
    ],
  },
  {
    id: 'find',
    title: '3. Find a record fast',
    story:
      'Power users search, filter, and jump with a command palette instead of walking the tree.',
    steps: [
      { patternId: 'command-palette', action: 'Press ⌘K / Ctrl+K or the button.' },
      { patternId: 'kbd', action: 'Shortcut legend in help.' },
      { patternId: 'search-filter', action: 'Type in the toolbar search.' },
      { patternId: 'autocomplete', action: 'Pick a known site from suggestions.' },
      { patternId: 'hierarchical-autocomplete', action: 'Search by region, then yard.' },
      { patternId: 'multi-select-dropdown', action: 'Add multiple trade chips.' },
      { patternId: 'infinite-scroll', action: 'Keep scrolling the long result list.' },
    ],
  },
  {
    id: 'help-site',
    title: '4. Help center and marketing',
    story:
      'A first-time visitor lands on help.trimble.com-style chrome: hero, mega menu, article nav, footer.',
    steps: [
      { patternId: 'hero', action: 'Land on the marketing hero.' },
      { patternId: 'section-hero', action: 'Scroll to a section hero band.' },
      { patternId: 'help-center-hero', action: 'Help home search hero.' },
      { patternId: 'help-center-mega-menu', action: 'Hover Products in the top nav.' },
      { patternId: 'help-center-navigation', action: 'Article tree on the left.' },
      { patternId: 'logo-marquee', action: 'Trusted-by logo row.' },
      { patternId: 'footer', action: 'Footer links and legal.' },
    ],
  },
  {
    id: 'copilot',
    title: '5. Site AI copilot',
    story:
      'An estimator asks the assistant to draft a summary, cites sources, hits a safety wall, then hands off to a person.',
    steps: [
      { patternId: 'ai-ux-initial-cta', action: 'Empty canvas: first “Ask AI” CTA.' },
      { patternId: 'ai-ux-suggestion', action: 'Tap a starter prompt chip.' },
      { patternId: 'ai-ux-floating-prompt', action: 'Doc-anchored prompt bar while reviewing.' },
      { patternId: 'agentic-basic-chat', action: 'Full chat transcript.' },
      { patternId: 'ai-ux-sources', action: 'Open citations under an answer.' },
      { patternId: 'ai-confidence-indicators', action: 'Low confidence badge on a guess.' },
      { patternId: 'ai-error-handling', action: 'Model timeout — retry UI.' },
      { patternId: 'ai-human-handoff', action: 'Escalate to a specialist.' },
      { patternId: 'ai-data-consent', action: 'First-run data consent gate.' },
    ],
  },
  {
    id: 'model-review',
    title: '6. Model and machine review',
    story:
      'A modeler compares surfaces in 3D, swaps map vs schematic, then an operator glances at in-cab grade.',
    steps: [
      { patternId: '3d-toolbar', action: 'Floating tools beside the viewport.' },
      { patternId: '3d-canvas', action: 'Split views around the scene.' },
      { patternId: 'swap', action: 'Toggle map vs schematic.' },
      { patternId: 'dock', action: 'Bottom dock for view modes.' },
      { patternId: 'in-cab-viewport-pane', action: 'Cab camera pane.' },
      { patternId: 'in-cab-status-metric', action: 'On-grade offset readout.' },
      { patternId: 'grade-indicator-bar', action: 'Remaining cut bar.' },
      { patternId: 'editable-slider', action: 'Set target grade before sending to machine.' },
    ],
  },
  {
    id: 'sync',
    title: '7. Stay in sync in the field',
    story:
      'Connectivity drops at the quarry. The app queues edits, shows status, then batch-syncs when back online.',
    steps: [
      { patternId: 'status-indicator', action: 'Connection pill turns warning.' },
      { patternId: 'offline-sync', action: 'Offline banner + queued edits.' },
      { patternId: 'manual-sync', action: 'Tap Sync now when the radio returns.' },
      { patternId: 'batch-sync', action: 'Push a batch of stored work orders.' },
      { patternId: 'real-time-sync', action: 'Live toasts as other crews save.' },
      { patternId: 'progress-bar', action: 'Export/upload progress.' },
      { patternId: 'stacked-alerts', action: 'Several sync messages stack.' },
    ],
  },
]

function patternTitle(id: string) {
  return PATTERN_META.find((item) => item.id === id)?.title ?? id
}

export function WorkflowPlays() {
  const [playId, setPlayId] = useState(PLAYS[0].id)
  const [step, setStep] = useState(0)
  const play = PLAYS.find((item) => item.id === playId) ?? PLAYS[0]
  const current = play.steps[Math.min(step, play.steps.length - 1)]

  return (
    <section className="gallery-section">
      <div>
        <ModusWcTypography hierarchy="h1" size="xl" weight="semibold" label="Workflow plays" />
        <ModusWcTypography
          hierarchy="p"
          size="sm"
          customClass="text-[var(--modus-wc-color-base-content-low-contrast)]"
          label="Seven Trimble-style tasks. Walk the numbered triggers — each step mounts the official pattern that would appear in that moment."
        />
      </div>

      <div className="demo-row">
        {PLAYS.map((item) => (
          <ModusWcButton
            key={item.id}
            size="sm"
            variant={item.id === play.id ? 'filled' : 'outlined'}
            color={item.id === play.id ? 'primary' : 'tertiary'}
            onButtonClick={() => {
              setPlayId(item.id)
              setStep(0)
            }}
          >
            {item.title}
          </ModusWcButton>
        ))}
      </div>

      <ModusWcAlert variant="info" alertTitle={play.title} alertDescription={play.story} />

      <ol className="workflow-steps">
        {play.steps.map((item, index) => (
          <li key={`${play.id}-${item.patternId}`}>
            <ModusWcButton
              size="sm"
              variant={index === step ? 'filled' : 'outlined'}
              color={index === step ? 'primary' : 'tertiary'}
              onButtonClick={() => setStep(index)}
            >
              {index + 1}. {patternTitle(item.patternId)}
            </ModusWcButton>
            <ModusWcTypography hierarchy="p" size="sm" label={item.action} />
          </li>
        ))}
      </ol>

      <ModusWcCard>
        <ModusWcTypography slot="title" hierarchy="h3" size="md" weight="semibold" label={patternTitle(current.patternId)} />
        <ModusWcTypography slot="subtitle" hierarchy="p" size="sm" label={current.action} />
        <PatternDemo id={current.patternId} />
      </ModusWcCard>
    </section>
  )
}
