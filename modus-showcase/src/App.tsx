import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  ModusWcIcon,
  ModusWcMenu,
  ModusWcMenuItem,
  ModusWcNavbar,
  ModusWcSideNavigation,
  ModusWcThemeSwitcher,
  ModusWcTypography,
} from '@trimble-oss/moduswebcomponents-react'
import './App.css'
import {
  ButtonsSection,
  DataSection,
  FeedbackSection,
  FiltersSection,
  FormsSection,
  NavigationSection,
  OverviewSection,
  ThemeSection,
} from './gallery/sections'
import { PatternCatalog } from './gallery/PatternCatalog'
import { WorkflowPlays } from './gallery/WorkflowPlays'

const RAIL_MAX = '256px'
const RAIL_MIN = '4rem'
const NAVBAR_VISIBILITY = {
  ai: false,
  apps: false,
  help: false,
  logo: true,
  mainMenu: true,
  notifications: false,
  search: false,
  searchInput: false,
  user: false,
}

type SectionId =
  | 'overview'
  | 'buttons'
  | 'forms'
  | 'feedback'
  | 'data'
  | 'navigation'
  | 'filters'
  | 'theme'
  | 'workflows'
  | 'patterns'

const NAV_ITEMS: { id: SectionId; label: string; icon: string }[] = [
  { id: 'overview', label: 'Overview', icon: 'home' },
  { id: 'workflows', label: 'Workflows', icon: 'timeline' },
  { id: 'patterns', label: 'All patterns', icon: 'folder_open' },
  { id: 'buttons', label: 'Buttons', icon: 'apps' },
  { id: 'forms', label: 'Forms', icon: 'text_input' },
  { id: 'feedback', label: 'Feedback', icon: 'notifications' },
  { id: 'data', label: 'Data', icon: 'table' },
  { id: 'navigation', label: 'Navigation', icon: 'view_list' },
  { id: 'filters', label: 'Filters', icon: 'filter' },
  { id: 'theme', label: 'Theme', icon: 'contrast' },
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

function renderSection(section: SectionId) {
  switch (section) {
    case 'buttons':
      return <ButtonsSection />
    case 'forms':
      return <FormsSection />
    case 'feedback':
      return <FeedbackSection />
    case 'data':
      return <DataSection />
    case 'navigation':
      return <NavigationSection />
    case 'filters':
      return <FiltersSection />
    case 'theme':
      return <ThemeSection />
    case 'workflows':
      return <WorkflowPlays />
    case 'patterns':
      return <PatternCatalog />
    default:
      return <OverviewSection />
  }
}

export default function App() {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const isXl = useMediaQuery('(min-width: 1280px)')
  const [sideNavExpanded, setSideNavExpanded] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 1280px)').matches,
  )
  const [section, setSection] = useState<SectionId>('overview')
  const [navbarHeight, setNavbarHeight] = useState(56)
  const navbarRef = useRef<HTMLModusWcNavbarElement | null>(null)
  const railRef = useRef<HTMLDivElement | null>(null)
  const mainRef = useRef<HTMLElement | null>(null)

  const mode = isDesktop ? 'push' : 'overlay'

  useEffect(() => {
    setSideNavExpanded(isXl)
  }, [isXl])

  useEffect(() => {
    if (!isDesktop) {
      setSideNavExpanded(false)
    }
  }, [section, isDesktop])

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
    if (navbar) {
      navbar.mainMenuOpen = isDesktop ? false : sideNavExpanded
    }

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

  useLayoutEffect(() => {
    const rail = railRef.current
    if (!rail) return
    if (!isDesktop && !sideNavExpanded) {
      const active = document.activeElement
      if (active instanceof HTMLElement && rail.contains(active)) {
        mainRef.current?.focus()
      }
      rail.setAttribute('inert', '')
    } else {
      rail.removeAttribute('inert')
    }
  }, [isDesktop, sideNavExpanded])

  const railWidth = !isDesktop
    ? sideNavExpanded
      ? RAIL_MAX
      : '0'
    : sideNavExpanded
      ? RAIL_MAX
      : RAIL_MIN

  return (
    <div className={`app-shell${isDesktop && sideNavExpanded ? ' rail-expanded' : ''}`}>
      <ModusWcNavbar
        ref={navbarRef}
        logoName="trimble"
        customClass="sticky top-0 z-[120] flex-shrink-0"
        visibility={NAVBAR_VISIBILITY}
        mainMenuOpen={isDesktop ? false : sideNavExpanded}
        onMainMenuOpenChange={(event) => {
          if (isDesktop) {
            setSideNavExpanded((prev) => !prev)
          } else {
            setSideNavExpanded(Boolean(event.detail))
          }
        }}
      >
        <ModusWcTypography slot="center" hierarchy="h3" size="sm" weight="semibold" label="Modus Gallery" />
        <ModusWcThemeSwitcher slot="end" aria-label="Theme toggle" />
      </ModusWcNavbar>

      <div className="app-body">
        <div
          ref={railRef}
          className="side-rail"
          data-collapsed-overlay={!isDesktop && !sideNavExpanded ? 'true' : 'false'}
          style={{
            top: navbarHeight,
            height: `calc(100dvh - ${navbarHeight}px)`,
            width: railWidth,
          }}
        >
          <ModusWcSideNavigation
            mode={mode}
            expanded={sideNavExpanded}
            maxWidth={RAIL_MAX}
            targetContent="#main-content"
            collapseOnClickOutside={!isDesktop}
            onExpandedChange={(event) => setSideNavExpanded(Boolean(event.detail))}
          >
            <ModusWcMenu size="md">
              {NAV_ITEMS.map((item) => (
                <ModusWcMenuItem
                  key={item.id}
                  label={item.label}
                  value={item.id}
                  size="md"
                  selected={section === item.id}
                  onItemSelect={() => setSection(item.id)}
                >
                  <ModusWcIcon slot="start-icon" name={item.icon} size="md" decorative />
                </ModusWcMenuItem>
              ))}
            </ModusWcMenu>
          </ModusWcSideNavigation>
        </div>

        <main id="main-content" ref={mainRef} tabIndex={-1}>
          {renderSection(section)}
        </main>
      </div>
    </div>
  )
}
