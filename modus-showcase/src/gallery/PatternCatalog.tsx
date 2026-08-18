import { useMemo, useState } from 'react'
import {
  ModusWcButton,
  ModusWcCard,
  ModusWcChip,
  ModusWcTextInput,
  ModusWcTypography,
} from '@trimble-oss/moduswebcomponents-react'
import { PatternDemo } from './PatternDemo'
import { PATTERN_CATEGORIES, PATTERN_META } from './patternMeta'
import { readInputString } from './formEvents'

export function PatternCatalog() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string>('all')
  const [openId, setOpenId] = useState<string | null>(null)

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return PATTERN_META.filter((pattern) => {
      if (category !== 'all' && pattern.category !== category) return false
      if (!q) return true
      return `${pattern.title} ${pattern.description} ${pattern.workflow} ${pattern.trigger}`
        .toLowerCase()
        .includes(q)
    })
  }, [category, query])

  return (
    <section className="gallery-section">
      <div>
        <ModusWcTypography hierarchy="h1" size="xl" weight="semibold" label="All Modus patterns" />
        <ModusWcTypography
          hierarchy="p"
          size="sm"
          customClass="text-[var(--modus-wc-color-base-content-low-contrast)]"
          label={`${PATTERN_META.length} patterns from modus.trimble.com/patterns. Each card is a field-software scenario: when it appears, what click or key opens it, then the live official demo.`}
        />
      </div>

      <ModusWcTextInput
        label="Search patterns"
        value={query}
        includeSearch
        onInputChange={(event) => setQuery(readInputString(event))}
      />

      <div className="demo-row">
        <ModusWcChip label={`All (${PATTERN_META.length})`} active={category === 'all'} onChipClick={() => setCategory('all')} />
        {PATTERN_CATEGORIES.map((item) => (
          <ModusWcChip
            key={item}
            label={item.replace(' Patterns', '')}
            active={category === item}
            onChipClick={() => setCategory(item)}
          />
        ))}
      </div>

      <ModusWcTypography hierarchy="p" size="sm" label={`${visible.length} shown. Run a pattern to mount the live demo.`} />

      {visible.map((pattern) => {
        const open = openId === pattern.id
        return (
          <ModusWcCard key={pattern.id}>
            <ModusWcTypography slot="title" hierarchy="h3" size="md" weight="semibold" label={pattern.title} />
            <ModusWcTypography slot="subtitle" hierarchy="p" size="sm" label={pattern.category} />
            <div className="demo-stack" style={{ maxWidth: '100%' }}>
              <ModusWcTypography hierarchy="p" size="sm" label={pattern.description} />
              <ModusWcTypography hierarchy="p" size="sm" weight="semibold" label={`Scenario · ${pattern.workflow}`} />
              <ModusWcTypography hierarchy="p" size="sm" label={`Trigger · ${pattern.trigger}`} />
              <ModusWcButton
                size="sm"
                variant={open ? 'outlined' : 'filled'}
                color={open ? 'tertiary' : 'primary'}
                onButtonClick={() => setOpenId(open ? null : pattern.id)}
              >
                {open ? 'Hide live demo' : 'Run this pattern'}
              </ModusWcButton>
              {open ? <PatternDemo id={pattern.id} /> : null}
            </div>
          </ModusWcCard>
        )
      })}
    </section>
  )
}
