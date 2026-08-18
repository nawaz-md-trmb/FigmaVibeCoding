export function readInputString(event: CustomEvent): string {
  const detail = event.detail as { target?: { value?: string } } | undefined
  return String(detail?.target?.value ?? '')
}

export function readInputChecked(event: CustomEvent): boolean {
  const detail = event.detail as { target?: { checked?: boolean } } | undefined
  return Boolean(detail?.target?.checked)
}
