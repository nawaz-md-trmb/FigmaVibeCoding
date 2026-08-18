import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ModusWcAccordion,
  ModusWcAlert,
  ModusWcAutocomplete,
  ModusWcBadge,
  ModusWcBreadcrumbs,
  ModusWcButton,
  ModusWcCard,
  ModusWcCheckbox,
  ModusWcChip,
  ModusWcCollapse,
  ModusWcDate,
  ModusWcDropdownMenu,
  ModusWcMenuItem,
  ModusWcModal,
  ModusWcPagination,
  ModusWcProgress,
  ModusWcSelect,
  ModusWcSkeleton,
  ModusWcSlider,
  ModusWcStepper,
  ModusWcSwitch,
  ModusWcTable,
  ModusWcTabs,
  ModusWcTextInput,
  ModusWcToast,
  ModusWcTooltip,
  ModusWcTypography,
  ModusWcUtilityPanel,
} from '@trimble-oss/moduswebcomponents-react'
import { FLEET, SITES, TRADES, type OrderStatus, type WorkOrder } from './lib/data'
import { readInputChecked, readInputString } from './lib/formEvents'

export type Route = 'board' | 'orders' | 'new-order' | 'fleet' | 'assistant' | 'sync'

type Toast = { title: string; variant: 'success' | 'info' | 'warning' | 'error' }

export type AppState = {
  route: Route
  setRoute: (route: Route) => void
  orders: WorkOrder[]
  setOrders: (orders: WorkOrder[]) => void
  toast: Toast | null
  notify: (toast: Toast) => void
  online: boolean
  setOnline: (online: boolean) => void
}

const STATUS_LABEL: Record<OrderStatus, string> = {
  open: 'Open',
  'in-progress': 'In progress',
  blocked: 'Blocked',
  done: 'Done',
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const color = status === 'done' ? 'success' : status === 'blocked' ? 'danger' : status === 'in-progress' ? 'warning' : 'primary'
  return <ModusWcBadge color={color}>{STATUS_LABEL[status]}</ModusWcBadge>
}

function Crumbs({ items }: { items: { label: string }[] }) {
  const ref = useRef<HTMLModusWcBreadcrumbsElement | null>(null)
  useEffect(() => {
    if (ref.current) ref.current.items = items
  }, [items])
  return <ModusWcBreadcrumbs ref={ref} aria-label="Breadcrumb" />
}

export function BoardPage({ state }: { state: AppState }) {
  const [view, setView] = useState<'kpis' | 'timeline'>('kpis')
  const open = state.orders.filter((o) => o.status !== 'done').length
  return (
    <section className="page">
      <Crumbs items={[{ label: 'Yard Command' }, { label: 'North Yard' }, { label: 'Board' }]} />
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <div>
          <ModusWcTypography hierarchy="h1" size="xl" weight="semibold" label="North Yard board" />
          <ModusWcTypography hierarchy="p" size="sm" label="Live mix of stats, widgets, and today’s timeline — same chrome you’d ship in a product." />
        </div>
        <div className="row">
          <ModusWcChip label="Map" active={view === 'kpis'} onChipClick={() => setView('kpis')} />
          <ModusWcChip label="Timeline" active={view === 'timeline'} onChipClick={() => setView('timeline')} />
          <ModusWcButton onButtonClick={() => state.setRoute('new-order')}>New work order</ModusWcButton>
        </div>
      </div>
      <ModusWcSwitch label={state.online ? 'Online' : 'Offline'} value={state.online} onInputChange={(e) => state.setOnline(readInputChecked(e))} />
      <div className="stats">
        <ModusWcCard>
          <ModusWcTypography slot="title" hierarchy="h3" size="md" weight="semibold" label="Open work" />
          <ModusWcTypography hierarchy="h2" size="xl" weight="semibold" label={String(open)} />
        </ModusWcCard>
        <ModusWcCard>
          <ModusWcTypography slot="title" hierarchy="h3" size="md" weight="semibold" label="Machines" />
          <ModusWcTypography hierarchy="h2" size="xl" weight="semibold" label={String(FLEET.length)} />
        </ModusWcCard>
        <ModusWcCard>
          <ModusWcTypography slot="title" hierarchy="h3" size="md" weight="semibold" label="On grade" />
          <ModusWcProgress value={82} max={100} label="82%" />
        </ModusWcCard>
        <ModusWcCard>
          <ModusWcTypography slot="title" hierarchy="h3" size="md" weight="semibold" label="Sync" />
          <ModusWcBadge color={state.online ? 'success' : 'warning'}>{state.online ? 'Live' : 'Queued'}</ModusWcBadge>
        </ModusWcCard>
      </div>
      {view === 'kpis' ? (
        <ModusWcCard>
          <ModusWcTypography slot="title" hierarchy="h3" size="md" weight="semibold" label="Today’s widgets" />
          <div className="row">
            {FLEET.map((m) => (
              <ModusWcCard key={m.id}>
                <ModusWcTypography slot="title" hierarchy="h4" size="sm" weight="semibold" label={`${m.id} · ${m.name}`} />
                <ModusWcTypography hierarchy="p" size="sm" label={`${m.yard} · ${m.hours} hrs`} />
                <ModusWcProgress value={m.grade} max={100} />
              </ModusWcCard>
            ))}
          </div>
        </ModusWcCard>
      ) : (
        <ModusWcCard>
          <ModusWcTypography slot="title" hierarchy="h3" size="md" weight="semibold" label="Shift timeline" />
          <ModusWcStepper
            steps={[
              { label: 'Gate check', color: 'success' },
              { label: 'Grade pass', color: 'primary' },
              { label: 'Survey', color: 'neutral' },
            ]}
          />
        </ModusWcCard>
      )}
    </section>
  )
}

export function OrdersPage({ state }: { state: AppState }) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'all' | OrderStatus>('all')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<WorkOrder | null>(null)
  const [drawer, setDrawer] = useState(false)
  const pageSize = 4

  const filtered = useMemo(() => {
    return state.orders.filter((row) => {
      if (status !== 'all' && row.status !== status) return false
      if (query && !`${row.id} ${row.site} ${row.trade}`.toLowerCase().includes(query.toLowerCase())) return false
      return true
    })
  }, [query, status, state.orders])

  const count = Math.max(1, Math.ceil(filtered.length / pageSize))
  const rows = filtered.slice((page - 1) * pageSize, page * pageSize)

  const refresh = () => {
    setLoading(true)
    window.setTimeout(() => setLoading(false), 700)
  }

  return (
    <section className="page order-page">
      <Crumbs items={[{ label: 'Yard Command' }, { label: 'Work orders' }]} />
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <ModusWcTypography hierarchy="h1" size="xl" weight="semibold" label="Work orders" />
        <div className="row">
          <ModusWcButton variant="outlined" color="tertiary" onButtonClick={refresh}>
            Refresh
          </ModusWcButton>
          <ModusWcButton onButtonClick={() => state.setRoute('new-order')}>New work order</ModusWcButton>
        </div>
      </div>
      <div className="row">
        <ModusWcTextInput
          label="Search"
          includeSearch
          value={query}
          onInputChange={(e) => {
            setQuery(readInputString(e))
            setPage(1)
          }}
        />
        {(['all', 'open', 'in-progress', 'blocked', 'done'] as const).map((item) => (
          <ModusWcChip
            key={item}
            label={item === 'all' ? 'All' : STATUS_LABEL[item]}
            active={status === item}
            onChipClick={() => {
              setStatus(item)
              setPage(1)
            }}
          />
        ))}
      </div>
      {loading ? (
        <div className="stack">
          <ModusWcSkeleton height="2rem" />
          <ModusWcSkeleton height="12rem" />
        </div>
      ) : filtered.length === 0 ? (
        <ModusWcAlert variant="info" alertTitle="No matching work orders" alertDescription="Clear filters or create a new work order." />
      ) : (
        <>
          <div className="min-w-0">
            <ModusWcTable
              caption="Work orders"
              zebra
              hover
              columns={[
                { id: 'id', accessor: 'id', header: 'ID', sortable: true },
                { id: 'site', accessor: 'site', header: 'Site' },
                { id: 'trade', accessor: 'trade', header: 'Trade' },
                { id: 'status', accessor: 'status', header: 'Status' },
                { id: 'owner', accessor: 'owner', header: 'Owner' },
                { id: 'updated', accessor: 'updated', header: 'Updated' },
              ]}
              data={rows}
              onRowClick={(e) => {
                const row = e.detail?.row as WorkOrder | undefined
                if (!row) return
                const found = state.orders.find((o) => o.id === row.id)
                if (found) {
                  setSelected(found)
                  setDrawer(true)
                }
              }}
            />
          </div>
          <div className="row" style={{ justifyContent: 'space-between' }}>
            {rows.map((row) => (
              <ModusWcDropdownMenu
                key={row.id}
                buttonAriaLabel={`Actions ${row.id}`}
                buttonVariant="outlined"
                buttonColor="tertiary"
                buttonSize="sm"
              >
                <span slot="button">{row.id}</span>
                <div slot="menu">
                  <ModusWcMenuItem
                    label="Inspect"
                    value="inspect"
                    onItemSelect={() => {
                      setSelected(row)
                      setDrawer(true)
                    }}
                  />
                  <ModusWcMenuItem
                    label="Mark done"
                    value="done"
                    onItemSelect={() => {
                      state.setOrders(state.orders.map((o) => (o.id === row.id ? { ...o, status: 'done' } : o)))
                      state.notify({ title: `${row.id} marked done`, variant: 'success' })
                    }}
                  />
                </div>
              </ModusWcDropdownMenu>
            ))}
            <ModusWcPagination page={page} count={count} onPageChange={(e) => setPage(e.detail.newPage)} />
          </div>
        </>
      )}

      <ModusWcUtilityPanel
        expanded={drawer}
        pushContent={false}
        onPanelClosed={() => setDrawer(false)}
      >
        <ModusWcTypography slot="header" hierarchy="h3" size="md" weight="semibold" label={selected?.id ?? 'Inspector'} />
        <div slot="body" className="stack" style={{ padding: '1rem' }}>
          {selected ? (
            <>
              <StatusBadge status={selected.status} />
              <ModusWcTypography hierarchy="p" size="sm" label={`${selected.site} · ${selected.trade} · ${selected.crews} crews`} />
              <ModusWcTypography hierarchy="p" size="sm" label={`Owner ${selected.owner}`} />
              <ModusWcButton
                size="sm"
                onButtonClick={() => {
                  state.notify({ title: `Synced ${selected.id}`, variant: 'success' })
                  setDrawer(false)
                }}
              >
                Save inspector
              </ModusWcButton>
            </>
          ) : null}
        </div>
      </ModusWcUtilityPanel>
    </section>
  )
}

export function NewOrderPage({ state }: { state: AppState }) {
  const [step, setStep] = useState(0)
  const [site, setSite] = useState('north')
  const [trade, setTrade] = useState('grade')
  const [notes, setNotes] = useState('')
  const [night, setNight] = useState(false)
  const [accept, setAccept] = useState(false)
  const [when, setWhen] = useState('2026-08-18')
  const modalId = 'confirm-create-wo'

  const create = () => {
    const siteLabel = SITES.find((s) => s.value === site)?.label ?? site
    const tradeLabel = TRADES.find((t) => t.value === trade)?.label ?? trade
    const id = `WO-${1210 + state.orders.length}`
    state.setOrders([
      { id, site: siteLabel, trade: tradeLabel, status: 'open', crews: 1, owner: 'You', updated: 'now' },
      ...state.orders,
    ])
    state.notify({ title: `${id} created`, variant: 'success' })
    const modal = document.getElementById(modalId) as HTMLDialogElement | null
    modal?.close()
    state.setRoute('orders')
  }

  return (
    <section className="page">
      <Crumbs items={[{ label: 'Yard Command' }, { label: 'Work orders' }, { label: 'New' }]} />
      <ModusWcTypography hierarchy="h1" size="xl" weight="semibold" label="New work order" />
      <ModusWcStepper
        interactive
        steps={[
          { label: 'Site', color: step === 0 ? 'primary' : 'success' },
          { label: 'Scope', color: step === 1 ? 'primary' : step > 1 ? 'success' : 'neutral' },
          { label: 'Confirm', color: step === 2 ? 'primary' : 'neutral' },
        ]}
        onStepClick={(e) => setStep(e.detail.index)}
      />
      {step === 0 ? (
        <div className="stack" style={{ maxWidth: '28rem' }}>
          <ModusWcSelect label="Site" value={site} options={SITES} onInputChange={(e) => setSite(readInputString(e))} />
          <ModusWcDate label="Start date" value={when} onInputChange={(e) => setWhen(readInputString(e))} />
          <ModusWcButton onButtonClick={() => setStep(1)}>Next</ModusWcButton>
        </div>
      ) : null}
      {step === 1 ? (
        <div className="stack" style={{ maxWidth: '28rem' }}>
          <ModusWcAutocomplete
            label="Trade"
            items={TRADES.map((item) => ({ ...item, visibleInMenu: true }))}
            value={trade}
            onItemSelect={(e) => setTrade(String(e.detail?.value ?? trade))}
          />
          <ModusWcTextInput label="Notes" value={notes} onInputChange={(e) => setNotes(readInputString(e))} />
          <ModusWcSwitch label="Night shift" value={night} onInputChange={(e) => setNight(readInputChecked(e))} />
          <div className="row">
            <ModusWcButton variant="outlined" color="tertiary" onButtonClick={() => setStep(0)}>
              Back
            </ModusWcButton>
            <ModusWcButton onButtonClick={() => setStep(2)}>Next</ModusWcButton>
          </div>
        </div>
      ) : null}
      {step === 2 ? (
        <div className="stack" style={{ maxWidth: '28rem' }}>
          <ModusWcAlert variant="info" alertTitle="Ready to create" alertDescription={`${SITES.find((s) => s.value === site)?.label} · ${TRADES.find((t) => t.value === trade)?.label}`} />
          <ModusWcCheckbox label="I confirm this crew is available" value={accept} onInputChange={(e) => setAccept(readInputChecked(e))} />
          <div className="row">
            <ModusWcButton variant="outlined" color="tertiary" onButtonClick={() => setStep(1)}>
              Back
            </ModusWcButton>
            <ModusWcButton
              disabled={!accept}
              onButtonClick={() => (document.getElementById(modalId) as HTMLDialogElement | null)?.showModal()}
            >
              Create
            </ModusWcButton>
          </div>
        </div>
      ) : null}
      <ModusWcModal modalId={modalId}>
        <ModusWcTypography slot="header" hierarchy="h2" size="lg" weight="semibold" label="Create work order?" />
        <div slot="content">This posts to the yard board and notifies the site owner.</div>
        <div slot="footer" className="row">
          <ModusWcButton variant="outlined" color="tertiary" onButtonClick={() => (document.getElementById(modalId) as HTMLDialogElement | null)?.close()}>
            Cancel
          </ModusWcButton>
          <ModusWcButton onButtonClick={create}>Confirm</ModusWcButton>
        </div>
      </ModusWcModal>
    </section>
  )
}

export function FleetPage({ state }: { state: AppState }) {
  const [tab, setTab] = useState(0)
  const [grade, setGrade] = useState(4.5)
  const collapseRef = useRef<HTMLModusWcCollapseElement | null>(null)
  useEffect(() => {
    if (collapseRef.current) collapseRef.current.options = { title: 'Maintenance hold' }
  }, [])

  return (
    <section className="page">
      <Crumbs items={[{ label: 'Yard Command' }, { label: 'Fleet' }]} />
      <ModusWcTypography hierarchy="h1" size="xl" weight="semibold" label="Fleet" />
      <ModusWcTabs
        tabs={[{ label: 'Machines' }, { label: 'Grade setup' }]}
        activeTabIndex={tab}
        onTabChange={(e) => setTab(e.detail.newTab)}
      />
      {tab === 0 ? (
        <div className="stats">
          {FLEET.map((m) => (
            <ModusWcCard key={m.id}>
              <ModusWcTypography slot="title" hierarchy="h3" size="md" weight="semibold" label={m.name} />
              <ModusWcTypography slot="subtitle" hierarchy="p" size="sm" label={m.id} />
              <ModusWcTypography hierarchy="p" size="sm" label={`${m.yard} yard · ${m.hours} hours`} />
              <ModusWcProgress value={m.grade} max={100} />
              <ModusWcButton
                size="sm"
                variant="outlined"
                color="tertiary"
                onButtonClick={() => state.notify({ title: `${m.id} inspected`, variant: 'info' })}
              >
                Inspect
              </ModusWcButton>
            </ModusWcCard>
          ))}
        </div>
      ) : (
        <div className="stack" style={{ maxWidth: '28rem' }}>
          <ModusWcSlider
            label={`Target grade ${grade.toFixed(1)}%`}
            min={0}
            max={12}
            step={0.1}
            value={grade}
            onInputChange={(e) => {
              const next = Number((e.detail as { target?: { value?: string } })?.target?.value)
              if (!Number.isNaN(next)) setGrade(next)
            }}
          />
          <ModusWcAccordion>
            <ModusWcCollapse ref={collapseRef}>
              <div slot="content">Hold EQ-91 until hydraulic leak is signed off.</div>
            </ModusWcCollapse>
          </ModusWcAccordion>
        </div>
      )}
    </section>
  )
}

export function AssistantPage({ state }: { state: AppState }) {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    { me: false, text: 'I can draft a shift summary, cite the last survey, or hand off to dispatch.' },
  ])

  const send = (text: string) => {
    const prompt = text.trim()
    if (!prompt) return
    setMessages((prev) => [
      ...prev,
      { me: true, text: prompt },
      { me: false, text: `Draft for North Yard: 3 open orders, Harbor paving in progress, Ridge survey blocked. (${prompt})` },
    ])
    setInput('')
    state.notify({ title: 'Assistant replied', variant: 'info' })
  }

  return (
    <section className="page">
      <Crumbs items={[{ label: 'Yard Command' }, { label: 'Assistant' }]} />
      <ModusWcTypography hierarchy="h1" size="xl" weight="semibold" label="Site copilot" />
      <div className="row">
        {['Summarize the shift', 'Why is Ridge blocked?', 'Hand off to dispatch'].map((chip) => (
          <ModusWcChip key={chip} label={chip} onChipClick={() => send(chip)} />
        ))}
      </div>
      <div className="chat">
        {messages.map((m, i) => (
          <div key={i} className={m.me ? 'bubble me' : 'bubble'}>
            {m.text}
          </div>
        ))}
      </div>
      <div className="row">
        <ModusWcTextInput
          label="Ask the copilot"
          value={input}
          onInputChange={(e) => setInput(readInputString(e))}
        />
        <ModusWcTooltip content="Sends a mock response — no model call" position="top" tooltipId="ask-tip">
          <ModusWcButton aria-describedby="ask-tip" onButtonClick={() => send(input)}>
            Ask
          </ModusWcButton>
        </ModusWcTooltip>
      </div>
    </section>
  )
}

export function SyncPage({ state }: { state: AppState }) {
  const [progress, setProgress] = useState(0)
  const syncing = progress > 0 && progress < 100

  return (
    <section className="page">
      <Crumbs items={[{ label: 'Yard Command' }, { label: 'Sync' }]} />
      <ModusWcTypography hierarchy="h1" size="xl" weight="semibold" label="Field sync" />
      <ModusWcAlert
        variant={state.online ? 'success' : 'warning'}
        alertTitle={state.online ? 'Connected' : 'Working offline'}
        alertDescription={state.online ? 'Edits stream to central as they save.' : 'Edits queue on this device until you sync.'}
      />
      <ModusWcSwitch label="Device online" value={state.online} onInputChange={(e) => state.setOnline(readInputChecked(e))} />
      <div className="row">
        <ModusWcButton
          disabled={syncing}
          onButtonClick={() => {
            setProgress(15)
            const id = window.setInterval(() => {
              setProgress((p) => {
                if (p >= 100) {
                  window.clearInterval(id)
                  state.notify({ title: 'Batch sync complete', variant: 'success' })
                  return 100
                }
                return p + 17
              })
            }, 280)
          }}
        >
          Sync now
        </ModusWcButton>
        <ModusWcButton variant="outlined" color="tertiary" onButtonClick={() => setProgress(0)}>
          Reset
        </ModusWcButton>
      </div>
      <ModusWcProgress value={Math.min(progress, 100)} max={100} label={syncing ? 'Uploading…' : progress >= 100 ? 'Done' : 'Idle'} />
    </section>
  )
}

export function CommandPalette({ open, onClose, onGo }: { open: boolean; onClose: () => void; onGo: (route: Route) => void }) {
  const modalId = 'yard-command-palette'
  useEffect(() => {
    const el = document.getElementById(modalId) as HTMLDialogElement | null
    if (open) el?.showModal()
    else el?.close()
  }, [open])

  const go = (route: Route) => {
    onGo(route)
    onClose()
  }

  return (
    <ModusWcModal modalId={modalId}>
      <ModusWcTypography slot="header" hierarchy="h2" size="lg" weight="semibold" label="Jump to" />
      <div slot="content" className="stack">
        <ModusWcTypography hierarchy="p" size="sm" label="⌘K / Ctrl+K from anywhere." />
        {(
          [
            ['board', 'Board'],
            ['orders', 'Work orders'],
            ['new-order', 'New work order'],
            ['fleet', 'Fleet'],
            ['assistant', 'Assistant'],
            ['sync', 'Sync'],
          ] as const
        ).map(([route, label]) => (
          <ModusWcButton key={route} variant="outlined" color="tertiary" onButtonClick={() => go(route)}>
            {label}
          </ModusWcButton>
        ))}
      </div>
      <div slot="footer">
        <ModusWcButton variant="outlined" color="tertiary" onButtonClick={onClose}>
          Close
        </ModusWcButton>
      </div>
    </ModusWcModal>
  )
}

export function AppToast({ toast }: { toast: Toast | null }) {
  if (!toast) return null
  return (
    <ModusWcToast position="top-end" delay={2800}>
      <ModusWcAlert variant={toast.variant} alertTitle={toast.title} />
    </ModusWcToast>
  )
}
