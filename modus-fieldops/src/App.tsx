import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  ModusWcButton,
  ModusWcIcon,
  ModusWcMenu,
  ModusWcMenuItem,
  ModusWcNavbar,
  ModusWcSideNavigation,
  ModusWcThemeSwitcher,
  ModusWcTypography,
} from '@trimble-oss/moduswebcomponents-react'
import './App.css'
import { INITIAL_ORDERS, type WorkOrder } from './lib/data'
import {
  AppToast,
  AssistantPage,
  BoardPage,
  CommandPalette,
  FleetPage,
  NewOrderPage,
  OrdersPage,
  SyncPage,
  type AppState,
  type Route,
} from './pages'

const RAIL_MAX = '256px'
const RAIL_MIN = '4rem'
const NAVBAR_VISIBILITY = {
  ai: false,
  apps: false,
  help: false,
  logo: true,
  mainMenu: true,
  notifications: false,
  search: true,
  searchInput: false,
  user: false,
}

const NAV: { id: Route; label: string; icon: string }[] = [
  { id: 'board', label: 'Board', icon: 'home' },
  { id: 'orders', label: 'Work orders', icon: 'table' },
  { id: 'new-order', label: 'New order', icon: 'add' },
  { id: 'fleet', label: 'Fleet', icon: 'apps' },
  { id: 'assistant', label: 'Assistant', icon: 'ai_stars' },
  { id: 'sync', label: 'Sync', icon: 'sync' },
]

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  )
  useEffect(() => {
    const media = window.matchMedia(query)
    const onChange = () => setMatches(media.matches)
    onChange()
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [query])
  return matches
}

export default function App() {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const isXl = useMediaQuery('(min-width: 1280px)')
  const [sideNavExpanded, setSideNavExpanded] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 1280px)').matches,
  )
  const [route, setRoute] = useState<Route>('board')
  const [orders, setOrders] = useState<WorkOrder[]>(INITIAL_ORDERS)
  const [toast, setToast] = useState<AppState['toast']>(null)
  const [online, setOnline] = useState(true)
  const [palette, setPalette] = useState(false)
  const [navbarHeight, setNavbarHeight] = useState(56)
  const navbarRef = useRef<HTMLModusWcNavbarElement | null>(null)
  const railRef = useRef<HTMLDivElement | null>(null)
  const mainRef = useRef<HTMLElement | null>(null)

  const notify: AppState['notify'] = (next) => {
    setToast(next)
    window.setTimeout(() => setToast(null), 3000)
  }

  const state: AppState = { route, setRoute, orders, setOrders, toast, notify, online, setOnline }

  useEffect(() => setSideNavExpanded(isXl), [isXl])
  useEffect(() => {
    if (!isDesktop) setSideNavExpanded(false)
  }, [route, isDesktop])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setPalette((open) => !open)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useLayoutEffect(() => {
    const host = navbarRef.current
    if (!host) return
    const measure = () => setNavbarHeight(host.getBoundingClientRect().height || 56)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(host)
    return () => observer.disconnect()
  }, [])

  useLayoutEffect(() => {
    const navbar = navbarRef.current
    if (navbar) navbar.mainMenuOpen = isDesktop ? false : sideNavExpanded
    const main = mainRef.current
    if (!main) return
    if (!isDesktop) {
      main.style.removeProperty('margin-left')
      return
    }
    const next = sideNavExpanded ? RAIL_MAX : RAIL_MIN
    main.style.marginLeft = next
    let outer = 0
    let inner = 0
    outer = window.requestAnimationFrame(() => {
      inner = window.requestAnimationFrame(() => {
        main.style.marginLeft = next
      })
    })
    return () => {
      window.cancelAnimationFrame(outer)
      window.cancelAnimationFrame(inner)
    }
  }, [isDesktop, sideNavExpanded])

  const railWidth = !isDesktop ? (sideNavExpanded ? RAIL_MAX : '0') : sideNavExpanded ? RAIL_MAX : RAIL_MIN

  let page = <BoardPage state={state} />
  if (route === 'orders') page = <OrdersPage state={state} />
  if (route === 'new-order') page = <NewOrderPage state={state} />
  if (route === 'fleet') page = <FleetPage state={state} />
  if (route === 'assistant') page = <AssistantPage state={state} />
  if (route === 'sync') page = <SyncPage state={state} />

  return (
    <div className={`app-shell${isDesktop && sideNavExpanded ? ' rail-expanded' : ''}`}>
      <ModusWcNavbar
        ref={navbarRef}
        logoName="trimble"
        customClass="sticky top-0 z-[120] flex-shrink-0"
        visibility={NAVBAR_VISIBILITY}
        mainMenuOpen={isDesktop ? false : sideNavExpanded}
        onMainMenuOpenChange={(event) => {
          if (isDesktop) setSideNavExpanded((prev) => !prev)
          else setSideNavExpanded(Boolean(event.detail))
        }}
        onSearchClick={() => setPalette(true)}
      >
        <ModusWcTypography slot="center" hierarchy="h3" size="sm" weight="semibold" label="Yard Command" />
        <div slot="end" className="row">
          <ModusWcButton size="sm" variant="outlined" color="tertiary" onButtonClick={() => setPalette(true)}>
            ⌘K
          </ModusWcButton>
          <ModusWcThemeSwitcher aria-label="Theme toggle" />
        </div>
      </ModusWcNavbar>

      <div className="app-body">
        <div
          ref={railRef}
          className="side-rail"
          data-collapsed-overlay={!isDesktop && !sideNavExpanded ? 'true' : 'false'}
          style={{ top: navbarHeight, height: `calc(100dvh - ${navbarHeight}px)`, width: railWidth }}
        >
          <ModusWcSideNavigation
            mode={isDesktop ? 'push' : 'overlay'}
            expanded={sideNavExpanded}
            maxWidth={RAIL_MAX}
            targetContent="#main-content"
            collapseOnClickOutside={!isDesktop}
            onExpandedChange={(event) => setSideNavExpanded(Boolean(event.detail))}
          >
            <ModusWcMenu size="md">
              {NAV.map((item) => (
                <ModusWcMenuItem
                  key={item.id}
                  label={item.label}
                  value={item.id}
                  size="md"
                  selected={route === item.id}
                  onItemSelect={() => setRoute(item.id)}
                >
                  <ModusWcIcon slot="start-icon" name={item.icon} size="md" decorative />
                </ModusWcMenuItem>
              ))}
            </ModusWcMenu>
          </ModusWcSideNavigation>
        </div>
        <main id="main-content" ref={mainRef} tabIndex={-1}>
          {page}
        </main>
      </div>
      <CommandPalette open={palette} onClose={() => setPalette(false)} onGo={setRoute} />
      <AppToast toast={toast} />
    </div>
  )
}
