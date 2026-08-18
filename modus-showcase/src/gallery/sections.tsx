import { useMemo, useState } from 'react'
import {
  ModusWcAlert,
  ModusWcButton,
  ModusWcCard,
  ModusWcCheckbox,
  ModusWcChip,
  ModusWcRadio,
  ModusWcSelect,
  ModusWcStepper,
  ModusWcSwitch,
  ModusWcTable,
  ModusWcTextInput,
  ModusWcThemeSwitcher,
  ModusWcToast,
  ModusWcTooltip,
  ModusWcTypography,
} from '@trimble-oss/moduswebcomponents-react'
import AccordionPattern from '../patterns/accordion/AccordionPattern'
import BreadcrumbsPattern from '../patterns/breadcrumbs/BreadcrumbsPattern'
import ModalPattern from '../patterns/modal/ModalPattern'
import PaginationPattern from '../patterns/pagination/PaginationPattern'
import TabsPattern from '../patterns/tabs/TabsPattern'
import { readInputChecked, readInputString } from './formEvents'

function SectionHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <ModusWcTypography hierarchy="h1" size="xl" weight="semibold" label={title} />
      <ModusWcTypography
        hierarchy="p"
        size="sm"
        label={subtitle}
        customClass="text-[var(--modus-wc-color-base-content-low-contrast)]"
      />
    </div>
  )
}

export function OverviewSection() {
  return (
    <section className="gallery-section">
      <SectionHeading
        title="Modus 2.x gallery"
        subtitle="Live Trimble Modus Web Components on Vite + React 19. Use the rail to jump between component groups."
      />
      <ModusWcAlert
        variant="info"
        alertTitle="Standalone showcase"
        alertDescription="This app is independent of the TOS landing page (5173) and the static Trimble homepage clone (4173)."
      />
      <ModusWcCard>
        <ModusWcTypography slot="title" hierarchy="h3" size="md" weight="semibold" label="What is here" />
        <ModusWcTypography
          hierarchy="p"
          size="sm"
          label="Buttons, forms, feedback, tables, navigation, chips, and theme. Workflows walk realistic Trimble-style tasks; All patterns lists every official modus.trimble.com pattern with a scenario and trigger."
        />
      </ModusWcCard>
    </section>
  )
}

export function ButtonsSection() {
  const colors = ['primary', 'secondary', 'tertiary', 'danger', 'success', 'warning', 'neutral'] as const
  const variants = ['filled', 'outlined', 'borderless'] as const
  const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const

  return (
    <section className="gallery-section">
      <SectionHeading title="Buttons" subtitle="Filled, outlined, and borderless variants with colors, sizes, and disabled." />
      {variants.map((variant) => (
        <ModusWcCard key={variant}>
          <ModusWcTypography slot="title" hierarchy="h3" size="md" weight="semibold" label={variant} />
          <div className="demo-row">
            {colors.map((color) => (
              <ModusWcButton key={color} variant={variant} color={color}>
                {color}
              </ModusWcButton>
            ))}
            <ModusWcButton variant={variant} disabled>
              Disabled
            </ModusWcButton>
          </div>
        </ModusWcCard>
      ))}
      <ModusWcCard>
        <ModusWcTypography slot="title" hierarchy="h3" size="md" weight="semibold" label="Sizes" />
        <div className="demo-row">
          {sizes.map((size) => (
            <ModusWcButton key={size} size={size}>
              {size}
            </ModusWcButton>
          ))}
        </div>
      </ModusWcCard>
    </section>
  )
}

export function FormsSection() {
  const [name, setName] = useState('North Yard')
  const [region, setRegion] = useState('west')
  const [notify, setNotify] = useState(true)
  const [accept, setAccept] = useState(false)
  const [channel, setChannel] = useState<'email' | 'sms'>('email')

  return (
    <section className="gallery-section">
      <SectionHeading title="Forms" subtitle="Text, select, checkbox, radio, and switch." />
      <ModusWcCard>
        <div className="demo-stack">
          <ModusWcTextInput
            label="Site name"
            value={name}
            onInputChange={(event) => setName(readInputString(event))}
          />
          <ModusWcSelect
            label="Region"
            value={region}
            options={[
              { label: 'West', value: 'west' },
              { label: 'Central', value: 'central' },
              { label: 'East', value: 'east' },
            ]}
            onInputChange={(event) => setRegion(readInputString(event))}
          />
          <ModusWcCheckbox
            label="I accept the sample terms"
            value={accept}
            onInputChange={(event) => setAccept(readInputChecked(event))}
          />
          <ModusWcRadio
            name="channel"
            label="Email"
            value={channel === 'email'}
            onInputChange={(event) => {
              if (readInputChecked(event)) setChannel('email')
            }}
          />
          <ModusWcRadio
            name="channel"
            label="SMS"
            value={channel === 'sms'}
            onInputChange={(event) => {
              if (readInputChecked(event)) setChannel('sms')
            }}
          />
          <ModusWcSwitch
            label="Send notifications"
            value={notify}
            onInputChange={(event) => setNotify(readInputChecked(event))}
          />
        </div>
      </ModusWcCard>
    </section>
  )
}

export function FeedbackSection() {
  const [showToast, setShowToast] = useState(false)

  return (
    <section className="gallery-section">
      <SectionHeading title="Feedback" subtitle="Modal, toast, tooltip, and alerts." />
      <ModusWcCard>
        <ModusWcTypography slot="title" hierarchy="h3" size="md" weight="semibold" label="Modal" />
        <ModalPattern />
      </ModusWcCard>
      <ModusWcCard>
        <ModusWcTypography slot="title" hierarchy="h3" size="md" weight="semibold" label="Toast" />
        <ModusWcButton
          onButtonClick={() => {
            setShowToast(true)
            window.setTimeout(() => setShowToast(false), 3500)
          }}
        >
          Show toast
        </ModusWcButton>
        {showToast ? (
          <ModusWcToast position="top-end" delay={3000}>
            <ModusWcAlert variant="success" alertTitle="Saved" alertDescription="Gallery toast using ModusWcAlert." />
          </ModusWcToast>
        ) : null}
      </ModusWcCard>
      <ModusWcCard>
        <ModusWcTypography slot="title" hierarchy="h3" size="md" weight="semibold" label="Tooltip" />
        <ModusWcTooltip content="More detail about this action" position="top" tooltipId="gallery-tooltip">
          <ModusWcButton aria-describedby="gallery-tooltip">Hover me</ModusWcButton>
        </ModusWcTooltip>
      </ModusWcCard>
      <div className="demo-stack" style={{ maxWidth: '100%' }}>
        <ModusWcAlert variant="info" alertTitle="Info" alertDescription="Informational message." />
        <ModusWcAlert variant="success" alertTitle="Success" alertDescription="Action completed." />
        <ModusWcAlert variant="warning" alertTitle="Warning" alertDescription="Check this setting." />
        <ModusWcAlert variant="error" alertTitle="Error" alertDescription="Something went wrong." dismissible />
      </div>
    </section>
  )
}

const TABLE_ROWS = [
  { id: '1', site: 'North Yard', status: 'Active', units: 12 },
  { id: '2', site: 'Harbor Dock', status: 'Active', units: 8 },
  { id: '3', site: 'Ridge Quarry', status: 'Paused', units: 4 },
  { id: '4', site: 'West Plant', status: 'Active', units: 19 },
  { id: '5', site: 'South Depot', status: 'Closed', units: 0 },
  { id: '6', site: 'Lake Pit', status: 'Active', units: 7 },
]

export function DataSection() {
  return (
    <section className="gallery-section">
      <SectionHeading title="Data" subtitle="Table with zebra rows plus the official pagination pattern." />
      <ModusWcCard>
        <ModusWcTypography slot="title" hierarchy="h3" size="md" weight="semibold" label="Table" />
        <div className="min-w-0">
          <ModusWcTable
            caption="Sample job sites"
            zebra
            hover
            columns={[
              { id: 'site', accessor: 'site', header: 'Site', sortable: true },
              { id: 'status', accessor: 'status', header: 'Status' },
              { id: 'units', accessor: 'units', header: 'Units', sortable: true },
            ]}
            data={TABLE_ROWS}
          />
        </div>
      </ModusWcCard>
      <ModusWcCard>
        <ModusWcTypography slot="title" hierarchy="h3" size="md" weight="semibold" label="Pagination" />
        <PaginationPattern />
      </ModusWcCard>
    </section>
  )
}

export function NavigationSection() {
  const steps = useMemo(
    () => [
      { label: 'Details', color: 'success' as const },
      { label: 'Review', color: 'primary' as const },
      { label: 'Confirm', color: 'neutral' as const },
    ],
    [],
  )

  return (
    <section className="gallery-section">
      <SectionHeading title="Navigation" subtitle="Tabs, accordion, breadcrumbs, and stepper." />
      <ModusWcCard>
        <ModusWcTypography slot="title" hierarchy="h3" size="md" weight="semibold" label="Breadcrumbs" />
        <BreadcrumbsPattern />
      </ModusWcCard>
      <ModusWcCard>
        <ModusWcTypography slot="title" hierarchy="h3" size="md" weight="semibold" label="Tabs" />
        <TabsPattern />
      </ModusWcCard>
      <ModusWcCard>
        <ModusWcTypography slot="title" hierarchy="h3" size="md" weight="semibold" label="Accordion" />
        <AccordionPattern />
      </ModusWcCard>
      <ModusWcCard>
        <ModusWcTypography slot="title" hierarchy="h3" size="md" weight="semibold" label="Stepper" />
        <ModusWcStepper steps={steps} />
      </ModusWcCard>
    </section>
  )
}

export function FiltersSection() {
  const [active, setActive] = useState('all')
  const chips = [
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active' },
    { id: 'paused', label: 'Paused' },
    { id: 'closed', label: 'Closed' },
  ]

  return (
    <section className="gallery-section">
      <SectionHeading title="Filters and chips" subtitle="Chip filters for status, including disabled and error states." />
      <ModusWcCard>
        <div className="demo-row">
          {chips.map((chip) => (
            <ModusWcChip
              key={chip.id}
              label={chip.label}
              active={active === chip.id}
              onChipClick={() => setActive(chip.id)}
            />
          ))}
          <ModusWcChip label="Disabled" disabled />
          <ModusWcChip label="Error" hasError />
        </div>
      </ModusWcCard>
    </section>
  )
}

export function ThemeSection() {
  return (
    <section className="gallery-section">
      <SectionHeading
        title="Layout and theme"
        subtitle="Toggle light and dark from the navbar switcher or the control below. The shell uses Modus navbar + side navigation."
      />
      <ModusWcCard>
        <ModusWcTypography slot="title" hierarchy="h3" size="md" weight="semibold" label="Theme switcher" />
        <div className="demo-row">
          <ModusWcThemeSwitcher aria-label="Theme toggle" />
          <ModusWcButton color="primary">Primary</ModusWcButton>
          <ModusWcButton color="secondary">Secondary</ModusWcButton>
          <ModusWcChip label="Chip" active />
        </div>
      </ModusWcCard>
    </section>
  )
}

