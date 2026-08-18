// @ts-nocheck
import './rich-text-editor-pattern.css';
import type { ChangeEvent, MutableRefObject } from 'react';
import type { ISelectOption } from '@trimble-oss/moduswebcomponents/types/components';
import {
  ModusWcButton,
  ModusWcCard,
  ModusWcIcon,
  ModusWcModal,
  ModusWcSelect,
  ModusWcTextInput,
  ModusWcTypography,
} from '@trimble-oss/moduswebcomponents-react';
import {
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

const LINK_MODAL_ID = 'rte-pattern-link-modal';

/** Dialog lives inside `modus-wc-modal` (shadow root in production builds). */
function dialogFromLinkModalHost(host: HTMLElement | null): HTMLDialogElement | null {
  if (!host) return null;
  const sr = host.shadowRoot;
  if (sr) {
    const byId = sr.getElementById(LINK_MODAL_ID);
    if (byId instanceof HTMLDialogElement) return byId;
    const inShadow = sr.querySelector('dialog');
    if (inShadow instanceof HTMLDialogElement) return inShadow;
  }
  const light = host.querySelector('dialog');
  return light instanceof HTMLDialogElement ? light : null;
}

/** Never grab an unrelated `modus-wc-modal` from the app shell — stay inside this pattern root. */
function resolveLinkModalHost(
  refHost: HTMLElement | null,
  editorEl: HTMLElement | null,
): HTMLElement | null {
  if (refHost) return refHost;
  const scope =
    editorEl?.closest?.('.rte-pattern-host') ??
    (typeof document !== 'undefined'
      ? document.querySelector('.rte-pattern-host')
      : null);
  if (!(scope instanceof HTMLElement)) return null;
  const byAttr = scope.querySelector(
    'modus-wc-modal[modal-id="' + LINK_MODAL_ID + '"]',
  );
  return byAttr instanceof HTMLElement ? byAttr : null;
}

function readInputString(e: CustomEvent): string {
  const t = (e.detail as { target?: { value?: string } })?.target?.value ?? '';
  return typeof t === 'string' ? t : '';
}

function execFmt(cmd: string, value?: string) {
  if (typeof document === 'undefined') return;
  try {
    document.execCommand(cmd, false, value);
  } catch {
    /* demo — unsupported commands no-op */
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttr(text: string): string {
  return escapeHtml(text);
}

/** formatBlock expects bracketed tag names in Chromium (for example "<h2>"). */
function formatBlockValue(tag: string): string {
  return '<' + tag + '>';
}

function normalizeLinkUrl(raw: string): string {
  const t = raw.trim();
  if (!t) return '';
  const lower = t.toLowerCase();
  const hasScheme =
    lower.indexOf('http://') === 0 ||
    lower.indexOf('https://') === 0 ||
    t.indexOf('mailto:') === 0 ||
    t.indexOf('/') === 0;
  return hasScheme ? t : 'https://' + t;
}

/** Walk from range endpoints inside `editor` to find enclosing `<a href>`. */
function getLinkHrefFromRange(editor: HTMLElement, range: Range): string {
  const anchorHrefFromNode = (container: Node): string => {
    let node: Node | null = container;
    if (node.nodeType === Node.TEXT_NODE) node = node.parentElement;
    while (node && node !== editor && editor.contains(node)) {
      if (node instanceof HTMLAnchorElement) {
        return node.getAttribute('href') ?? '';
      }
      node = node.parentElement;
    }
    return '';
  };

  if (!editor.contains(range.commonAncestorContainer)) return '';

  const startHref = anchorHrefFromNode(range.startContainer);
  const endHref = anchorHrefFromNode(range.endContainer);
  if (startHref && endHref && startHref === endHref) return startHref;
  if (startHref) return startHref;
  if (endHref) return endHref;
  return '';
}

const HEADING_OPTIONS: ISelectOption[] = [
  { label: 'Paragraph', value: 'p' },
  { label: 'Heading 1', value: 'h1' },
  { label: 'Heading 2', value: 'h2' },
  { label: 'Heading 3', value: 'h3' },
  { label: 'Heading 4', value: 'h4' },
];

const FONT_OPTIONS: ISelectOption[] = [
  { label: 'Sans Serif', value: 'sans' },
  { label: 'Serif', value: 'serif' },
  { label: 'Monospace', value: 'mono' },
];

const SIZE_OPTIONS: ISelectOption[] = [
  { label: '12px', value: '12' },
  { label: '14px', value: '14' },
  { label: '16px', value: '16' },
];

/** Maps dropdown value to execCommand fontSize bucket (1–7). */
const FONT_SIZE_MAP: Record<string, string> = {
  '12': '2',
  '14': '3',
  '16': '4',
};

/** URL state stays here so typing in the modal does not re-render the `contentEditable` host (which would wipe DOM and break saved ranges). */
const RichTextEditorLinkModal = forwardRef<
  HTMLElement | null,
  {
    openNonce: number;
    /** Last href read when opening (mutable so parent does not re-render the editor). */
    prefillHrefRef: MutableRefObject<string>;
    onApply: (normalizedUrl: string) => void;
    onCancel: () => void;
  }
>(function RichTextEditorLinkModal({ openNonce, prefillHrefRef, onApply, onCancel }, ref) {
  const [linkDraftUrl, setLinkDraftUrl] = useState('');

  useEffect(() => {
    if (openNonce > 0) {
      setLinkDraftUrl(prefillHrefRef.current);
    }
  }, [openNonce, prefillHrefRef]);

  return (
    <ModusWcModal
      ref={ref}
      modalId={LINK_MODAL_ID}
      backdrop="default"
      position="center"
      showClose={true}
      aria-label="Insert link"
    >
      <span slot="header">Insert link</span>
      <div slot="content" className="flex flex-col gap-2">
        <ModusWcTypography
          hierarchy="p"
          size="sm"
          label="Select text in the editor, then use the toolbar link control. If the selection is already inside a link, its URL appears here so you can edit it. Plain text gets an empty field—enter a URL (relative paths and mailto: are allowed)."
        />
        <ModusWcTextInput
          label="URL"
          type="url"
          size="sm"
          placeholder="https://example.com"
          value={linkDraftUrl}
          onInputChange={(e: CustomEvent) => setLinkDraftUrl(readInputString(e))}
        />
      </div>
      <div slot="footer" className="flex w-full justify-end gap-2">
        <ModusWcButton variant="outlined" color="tertiary" size="sm" onButtonClick={onCancel}>
          Cancel
        </ModusWcButton>
        <ModusWcButton
          variant="filled"
          color="primary"
          size="sm"
          onButtonClick={() => {
            const url = normalizeLinkUrl(linkDraftUrl);
            if (!url) return;
            onApply(url);
          }}
        >
          <ModusWcIcon decorative name="link" size="xs" variant="solid" />
          Insert link
        </ModusWcButton>
      </div>
    </ModusWcModal>
  );
});

export function RichTextEditorPattern() {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const blobUrlsRef = useRef<string[]>([]);
  const savedLinkRangeRef = useRef<Range | null>(null);
  const linkModalHostRef = useRef<HTMLElement | null>(null);
  /** Initial URL when opening the link modal (linked selection); avoids parent state that would re-render contenteditable. */
  const linkModalPrefillHrefRef = useRef('');
  const linkCloseListenerAttachedRef = useRef(false);

  useEffect(() => {
    return () => {
      linkCloseListenerAttachedRef.current = false;
    };
  }, []);

  const [headingTag, setHeadingTag] = useState('p');
  const [fontKey, setFontKey] = useState('sans');
  const [sizeKey, setSizeKey] = useState('12');
  /** Bumps after toolbar “Insert link”; opening runs in `useLayoutEffect` like Image gallery preview. */
  const [linkModalOpenNonce, setLinkModalOpenNonce] = useState(0);

  useEffect(() => {
    const urls = blobUrlsRef.current;
    return () => {
      urls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, []);

  const fmt = useCallback((cmd: string, value?: string) => {
    editorRef.current?.focus();
    execFmt(cmd, value);
  }, []);

  const closeLinkModal = useCallback(() => {
    dialogFromLinkModalHost(
      resolveLinkModalHost(linkModalHostRef.current, editorRef.current),
    )?.close();
  }, []);

  /** Snapshot selection while it still lives in the editor (toolbar clicks clear it). */
  const stashEditorLinkSelection = useCallback(() => {
    const ed = editorRef.current;
    const sel = typeof window !== 'undefined' ? window.getSelection() : null;
    if (!ed || !sel || sel.rangeCount === 0) {
      return;
    }
    const range = sel.getRangeAt(0);
    if (!ed.contains(range.commonAncestorContainer)) {
      return;
    }
    savedLinkRangeRef.current = range.cloneRange();
  }, []);

  useEffect(() => {
    const ed = editorRef.current;
    if (!ed) return;

    const onKeyUp = (e: KeyboardEvent) => {
      const nav =
        e.key === 'ArrowLeft' ||
        e.key === 'ArrowRight' ||
        e.key === 'ArrowUp' ||
        e.key === 'ArrowDown' ||
        e.key === 'Home' ||
        e.key === 'End' ||
        e.key === 'PageUp' ||
        e.key === 'PageDown';
      const selectAll =
        (e.ctrlKey || e.metaKey) && String(e.key).toLowerCase() === 'a';
      if (nav || selectAll) {
        stashEditorLinkSelection();
      }
    };

    ed.addEventListener('mouseup', stashEditorLinkSelection);
    ed.addEventListener('keyup', onKeyUp);
    return () => {
      ed.removeEventListener('mouseup', stashEditorLinkSelection);
      ed.removeEventListener('keyup', onKeyUp);
    };
  }, [stashEditorLinkSelection]);

  const cancelLinkModal = useCallback(() => {
    savedLinkRangeRef.current = null;
    closeLinkModal();
  }, [closeLinkModal]);

  const queueOpenLinkModal = useCallback(() => {
    stashEditorLinkSelection();
    const ed = editorRef.current;
    const r = savedLinkRangeRef.current;
    linkModalPrefillHrefRef.current =
      ed && r && ed.contains(r.commonAncestorContainer)
        ? getLinkHrefFromRange(ed, r)
        : '';
    setLinkModalOpenNonce((n) => n + 1);
  }, [stashEditorLinkSelection]);

  useLayoutEffect(() => {
    if (linkModalOpenNonce === 0) return;

    let cancelled = false;
    let intervalId = 0;

    const attachCloseOnce = (dialog: HTMLDialogElement) => {
      if (linkCloseListenerAttachedRef.current) return;
      linkCloseListenerAttachedRef.current = true;
      dialog.addEventListener('close', () => {
        savedLinkRangeRef.current = null;
      });
    };

    const tryShow = (): boolean => {
      if (cancelled) return true;
      const host = resolveLinkModalHost(linkModalHostRef.current, editorRef.current);
      const dialog = dialogFromLinkModalHost(host);
      if (!dialog || typeof dialog.showModal !== 'function') return false;
      try {
        attachCloseOnce(dialog);
        dialog.showModal();
        return true;
      } catch {
        return false;
      }
    };

    const scheduleRetries = () => {
      if (tryShow()) return;
      requestAnimationFrame(() => {
        if (cancelled) return;
        if (tryShow()) return;
        requestAnimationFrame(() => {
          if (cancelled) return;
          if (tryShow()) return;
          if (typeof customElements !== 'undefined' && customElements.whenDefined) {
            void customElements.whenDefined('modus-wc-modal').then(() => {
              if (cancelled) return;
              if (tryShow()) return;
              let n = 0;
              intervalId = window.setInterval(() => {
                n += 1;
                if (tryShow() || n >= 40) {
                  window.clearInterval(intervalId);
                  intervalId = 0;
                }
              }, 50);
            });
          } else {
            window.setTimeout(() => {
              if (!cancelled) tryShow();
            }, 0);
          }
        });
      });
    };

    scheduleRetries();

    return () => {
      cancelled = true;
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [linkModalOpenNonce]);

  const applyLink = useCallback(
    (url: string) => {
      if (!url) return;
      const ed = editorRef.current;
      if (!ed) return;
      const saved = savedLinkRangeRef.current;
      closeLinkModal();
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          ed.focus();
          const sel = window.getSelection();
          if (sel && saved && ed.contains(saved.commonAncestorContainer)) {
            try {
              sel.removeAllRanges();
              sel.addRange(saved);
            } catch {
              /* cloned range may not survive DOM churn */
            }
          }
          try {
            document.execCommand('styleWithCSS', false, true);
          } catch {
            /* demo */
          }
          execFmt('createLink', url);
          savedLinkRangeRef.current = null;
        });
      });
    },
    [closeLinkModal],
  );

  const onHeadingChange = useCallback((e: CustomEvent) => {
    const v = readInputString(e);
    setHeadingTag(v);
    editorRef.current?.focus();
    execFmt('formatBlock', formatBlockValue(v));
  }, []);

  const onFontChange = useCallback((e: CustomEvent) => {
    const v = readInputString(e);
    setFontKey(v);
    editorRef.current?.focus();
  }, []);

  const onSizeChange = useCallback((e: CustomEvent) => {
    const v = readInputString(e);
    setSizeKey(v);
    const sz = FONT_SIZE_MAP[v] ?? '3';
    editorRef.current?.focus();
    execFmt('fontSize', sz);
  }, []);

  const onFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    editorRef.current?.focus();
    Array.from(files).forEach((file) => {
      const objectUrl = URL.createObjectURL(file);
      blobUrlsRef.current.push(objectUrl);
      const nameAttr = escapeAttr(file.name);
      const nameText = escapeHtml(file.name);
      const isImage =
        file.type.startsWith('image/') ||
        /\.(gif|jpe?g|png|webp|bmp|svg|avif|heic)$/i.test(file.name);
      const html = isImage
        ? '<figure class="rte-attachment rte-attachment-image">' +
          '<a href="' +
          objectUrl +
          '" download="' +
          nameAttr +
          '" target="_blank" rel="noopener noreferrer">' +
          '<img src="' +
          objectUrl +
          '" alt="' +
          nameAttr +
          '" loading="lazy" draggable="false" />' +
          '</a>' +
          '<figcaption>' +
          nameText +
          '</figcaption>' +
          '</figure>'
        : '<p class="rte-attachment">' +
          '<a href="' +
          objectUrl +
          '" download="' +
          nameAttr +
          '" target="_blank" rel="noopener noreferrer">' +
          nameText +
          '</a>' +
          '</p>';
      execFmt('insertHTML', html);
    });
    e.target.value = '';
  }, []);

  const ToolbarSep = () => (
    <div
      className="mx-1 hidden h-6 w-px shrink-0 bg-[var(--modus-wc-color-base-200)] sm:block"
      aria-hidden
    />
  );

  return (
    <div className="rte-pattern-host max-w-4xl min-w-0">
      <ModusWcCard bordered={true} padding="compact" customClass="min-w-0">
        <div className="flex min-w-0 flex-col gap-1">
        <div
          role="toolbar"
          aria-label="Formatting"
          className="min-w-0 touch-pan-x overflow-x-auto overflow-y-hidden overscroll-x-contain border-b border-[var(--modus-wc-color-base-200)] pb-2"
        >
          <div className="inline-flex flex-nowrap items-center gap-1 [&>*]:shrink-0">
          <div className="w-[9.25rem] shrink-0">
          <ModusWcSelect
            options={HEADING_OPTIONS}
            value={headingTag}
            bordered={false}
            size="sm"
            aria-label="Paragraph or heading"
            onInputChange={onHeadingChange}
          />
          </div>
          <div className="w-[10rem] shrink-0">
          <ModusWcSelect
            options={FONT_OPTIONS}
            value={fontKey}
            bordered={false}
            size="sm"
            aria-label="Font family"
            onInputChange={onFontChange}
          />
          </div>
          <div className="w-[5.75rem] shrink-0">
          <ModusWcSelect
            options={SIZE_OPTIONS}
            value={sizeKey}
            bordered={false}
            size="sm"
            aria-label="Font size"
            onInputChange={onSizeChange}
          />
          </div>

          <ToolbarSep />

          <ModusWcButton
            variant="borderless"
            color="tertiary"
            shape="square"
            size="sm"
            aria-label="Bold"
            onButtonClick={() => fmt('bold')}
          >
            <ModusWcIcon decorative name="text_bold" size="xs" variant="solid" />
          </ModusWcButton>
          <ModusWcButton
            variant="borderless"
            color="tertiary"
            shape="square"
            size="sm"
            aria-label="Italic"
            onButtonClick={() => fmt('italic')}
          >
            <ModusWcIcon decorative name="text_italic" size="xs" variant="solid" />
          </ModusWcButton>
          <ModusWcButton
            variant="borderless"
            color="tertiary"
            shape="square"
            size="sm"
            aria-label="Underline"
            onButtonClick={() => fmt('underline')}
          >
            <ModusWcIcon decorative name="text_underlined" size="xs" variant="solid" />
          </ModusWcButton>
          <ModusWcButton
            variant="borderless"
            color="tertiary"
            shape="square"
            size="sm"
            aria-label="Strikethrough"
            onButtonClick={() => fmt('strikeThrough')}
          >
            <ModusWcIcon decorative name="text_strikethrough" size="xs" variant="solid" />
          </ModusWcButton>

          <ToolbarSep />

          <ModusWcButton
            variant="borderless"
            color="tertiary"
            shape="square"
            size="sm"
            aria-label="Align left"
            onButtonClick={() => fmt('justifyLeft')}
          >
            <ModusWcIcon decorative name="text_align_left" size="xs" variant="solid" />
          </ModusWcButton>
          <ModusWcButton
            variant="borderless"
            color="tertiary"
            shape="square"
            size="sm"
            aria-label="Align center"
            onButtonClick={() => fmt('justifyCenter')}
          >
            <ModusWcIcon decorative name="text_centered" size="xs" variant="solid" />
          </ModusWcButton>
          <ModusWcButton
            variant="borderless"
            color="tertiary"
            shape="square"
            size="sm"
            aria-label="Align right"
            onButtonClick={() => fmt('justifyRight')}
          >
            <ModusWcIcon decorative name="text_align_right" size="xs" variant="solid" />
          </ModusWcButton>

          <ToolbarSep />

          <ModusWcButton
            variant="borderless"
            color="tertiary"
            shape="square"
            size="sm"
            aria-label="Bulleted list"
            onButtonClick={() => fmt('insertUnorderedList')}
          >
            <ModusWcIcon decorative name="list_bulleted" size="xs" variant="solid" />
          </ModusWcButton>
          <ModusWcButton
            variant="borderless"
            color="tertiary"
            shape="square"
            size="sm"
            aria-label="Numbered list"
            onButtonClick={() => fmt('insertOrderedList')}
          >
            <ModusWcIcon decorative name="list_numbered" size="xs" variant="solid" />
          </ModusWcButton>

          <ToolbarSep />

          <ModusWcButton
            variant="borderless"
            color="tertiary"
            shape="square"
            size="sm"
            aria-label="Insert link"
            onButtonClick={queueOpenLinkModal}
          >
            <ModusWcIcon decorative name="link" size="xs" variant="solid" />
          </ModusWcButton>
          <ModusWcButton
            variant="borderless"
            color="tertiary"
            shape="square"
            size="sm"
            aria-label="Attach files"
            onButtonClick={() => fileInputRef.current?.click()}
          >
            <ModusWcIcon decorative name="upload" size="xs" variant="solid" />
          </ModusWcButton>
          </div>
        </div>

        <div
          ref={editorRef}
          data-rich-text-editor-host
          role="textbox"
          aria-multiline="true"
          aria-label="Rich text body"
          contentEditable
          suppressContentEditableWarning
          className={'rte-pattern-editor rte-pattern-editor-font-' + fontKey + ' min-h-[12rem] w-full resize-y overflow-auto rounded-md border border-[var(--modus-wc-color-base-200)] bg-[var(--modus-wc-color-base-page)] px-5 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[var(--modus-wc-color-primary)] [&_li]:ms-0 [&_ol]:list-inside [&_ol]:my-1 [&_ol]:ps-7 [&_ul]:list-inside [&_ul]:my-1 [&_ul]:ps-7'}
        />

        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="sr-only"
          tabIndex={-1}
          aria-hidden={true}
          onChange={onFileChange}
        />
        </div>
      </ModusWcCard>

      <RichTextEditorLinkModal
        ref={linkModalHostRef}
        openNonce={linkModalOpenNonce}
        prefillHrefRef={linkModalPrefillHrefRef}
        onApply={applyLink}
        onCancel={cancelLinkModal}
      />
    </div>
  );
}

export default RichTextEditorPattern;