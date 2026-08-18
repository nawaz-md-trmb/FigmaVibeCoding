import { Suspense, type ComponentType, type LazyExoticComponent } from 'react'
import { ModusWcSkeleton, ModusWcTypography } from '@trimble-oss/moduswebcomponents-react'
import { PATTERN_LOADERS } from './patternLoaders'

export function PatternDemo({ id }: { id: string }) {
  const Loader = PATTERN_LOADERS[id] as LazyExoticComponent<ComponentType<Record<string, never>>> | undefined
  if (!Loader) {
    return <ModusWcTypography hierarchy="p" size="sm" label={`Pattern ${id} is not loaded.`} />
  }
  return (
    <Suspense
      fallback={
        <div className="demo-stack">
          <ModusWcSkeleton height="1.5rem" />
          <ModusWcSkeleton height="8rem" />
        </div>
      }
    >
      <div className="pattern-live">
        <Loader />
      </div>
    </Suspense>
  )
}
