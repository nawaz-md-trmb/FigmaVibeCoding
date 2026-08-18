// @ts-nocheck
import './color-picker.css';
import { useState, useRef, useCallback, useEffect } from 'react';
import {
  ModusWcCard,
  ModusWcTypography,
  ModusWcButton,
  ModusWcButtonGroup,
  ModusWcIcon,
  ModusWcSlider,
  ModusWcTextInput,
} from '@trimble-oss/moduswebcomponents-react';

export function ColorPicker() {
  const hsvToRgb = (h, s, v) => {
    s /= 100; v /= 100;
    const c = v * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = v - c;
    let r, g, b;
    if (h < 60) { r = c; g = x; b = 0; }
    else if (h < 120) { r = x; g = c; b = 0; }
    else if (h < 180) { r = 0; g = c; b = x; }
    else if (h < 240) { r = 0; g = x; b = c; }
    else if (h < 300) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }
    return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
  };
  const rgbToHex = (r, g, b) => '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
  const hexToRgb = (hex) => {
    const m = /^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$/i.exec(hex);
    return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : [0, 0, 0];
  };
  const rgbToHsv = (r, g, b) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const d = max - min;
    const s = max === 0 ? 0 : (d / max) * 100;
    const v = max * 100;
    let h = 0;
    if (d !== 0) {
      if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6 * 360;
      else if (max === g) h = ((b - r) / d + 2) / 6 * 360;
      else h = ((r - g) / d + 4) / 6 * 360;
    }
    return [h, s, v];
  };

  const PRESET_COLORS = [
    '#E57373', '#FF8A65', '#FFB74D', '#AED581', '#81C784', '#4DD0E1',
    '#64B5F6', '#7986CB', '#BA68C8', '#F06292', '#FF7043', '#FFCA28',
    '#9CCC65', '#26A69A', '#42A5F5', '#5C6BC0', '#AB47BC', '#EC407A',
    '#D32F2F', '#E64A19', '#F9A825', '#689F38', '#00897B', '#1E88E5',
    '#3949AB', '#7B1FA2', '#C2185B', '#FFFFFF', '#E0E0E0', '#9E9E9E',
    '#616161', '#212121', 'transparent',
  ];
  const [mode, setMode] = useState('palette');
  const [isCreatingCustom, setIsCreatingCustom] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#64B5F6');
  const [customColors, setCustomColors] = useState<string[]>([]);
  const [transparency, setTransparency] = useState(100);
  const [hue, setHue] = useState(210);
  const [saturation, setSaturation] = useState(60);
  const [brightness, setBrightness] = useState(96);
  const [hexInput, setHexInput] = useState('#64B5F6');
  const svRef = useRef(null);

  const [r, g, b] = hsvToRgb(hue, saturation, brightness);
  const hex = rgbToHex(r, g, b);

  useEffect(() => { setHexInput(hex); }, [hex]);

  useEffect(() => {
    if (mode === 'precise' && selectedColor && selectedColor !== 'transparent') {
      const hexStr = selectedColor.startsWith('#') ? selectedColor : '#' + selectedColor;
      if (/^#[0-9A-Fa-f]{6}$/.test(hexStr)) {
        const [hr, hg, hb] = hexToRgb(hexStr);
        const [h, s, v] = rgbToHsv(hr, hg, hb);
        setHue(h);
        setSaturation(s);
        setBrightness(v);
      }
    }
  }, [mode, selectedColor]);

  const handleReset = () => {
    setSelectedColor('#64B5F6');
    setTransparency(100);
    const [h, s, v] = rgbToHsv(100, 181, 246);
    setHue(h);
    setSaturation(s);
    setBrightness(v);
  };

  const handleSaveCustomColor = () => {
    const hexStr = hex.startsWith('#') ? hex : '#' + hex;
    if (/^#[0-9A-Fa-f]{6}$/.test(hexStr)) {
      setCustomColors((prev) => [...prev, hexStr]);
      setSelectedColor(hexStr);
      setIsCreatingCustom(false);
      setMode('palette');
    }
  };

  const handleSvClick = useCallback((e) => {
    const rect = svRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    setSaturation(x * 100);
    setBrightness((1 - y) * 100);
  }, []);

  const handleHexInput = (e) => {
    setHexInput(e.detail?.target?.value || '');
  };
  const applyHex = () => {
    const v = hexInput.trim();
    const hexStr = v.startsWith('#') ? v : '#' + v;
    if (/^#[0-9A-Fa-f]{6}$/.test(hexStr)) {
      const [hr, hg, hb] = hexToRgb(hexStr);
      const [h, s, vv] = rgbToHsv(hr, hg, hb);
      setHue(h);
      setSaturation(s);
      setBrightness(vv);
    }
  };

  const handleRgbChange = (channel, val) => {
    const n = parseInt(val, 10);
    if (isNaN(n) || n < 0 || n > 255) return;
    let nr = r, ng = g, nb = b;
    if (channel === 'r') nr = n;
    if (channel === 'g') ng = n;
    if (channel === 'b') nb = n;
    const [h, s, v] = rgbToHsv(nr, ng, nb);
    setHue(h);
    setSaturation(s);
    setBrightness(v);
  };

  const hueColor = rgbToHex(...hsvToRgb(hue, 100, 100));

  return (
    <div className="color-picker-shell">
      <ModusWcCard bordered={true} padding="compact" customClass="color-picker-pattern w-full min-w-0">
      <div className="flex flex-col gap-2 min-w-0">
        <ModusWcButtonGroup variant="outlined" color="tertiary" selectionType="single" customClass="w-full min-w-0">
          <ModusWcButton
            fullWidth
            pressed={mode === 'palette'}
            onButtonClick={() => { setMode('palette'); setIsCreatingCustom(false); }}
          >
            <ModusWcIcon name="palette" size="sm" decorative />
            Palette
          </ModusWcButton>
          <ModusWcButton
            fullWidth
            pressed={mode === 'precise'}
            onButtonClick={() => { setMode('precise'); setIsCreatingCustom(false); }}
          >
            <ModusWcIcon name="color_picker" size="sm" decorative />
            Precise
          </ModusWcButton>
        </ModusWcButtonGroup>

        {mode === 'palette' ? (
          <>
            <div>
              <ModusWcTypography hierarchy="h4" size="md" weight="semibold" label="Color" customClass="mb-2 block" />
              <div className="grid grid-cols-6 gap-2">
                {PRESET_COLORS.map((color) => {
                  const isSelected = selectedColor === color;
                  const showWithTransparency = isSelected && color !== 'transparent' && /^#[0-9A-Fa-f]{6}$/i.test(color);
                  const [pr, pg, pb] = showWithTransparency ? hexToRgb(color) : [0, 0, 0];
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={(showWithTransparency ? 'color-picker-checkerboard relative overflow-hidden ' : '') + "w-8 h-8 rounded-full border-2 p-0 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--modus-wc-color-primary)] focus-visible:ring-offset-2 " + (isSelected ? 'color-picker-swatch-selected' : '')}
                      style={{
                        backgroundColor: showWithTransparency ? 'transparent' : (color === 'transparent' ? 'transparent' : color),
                        borderColor: isSelected ? 'var(--modus-wc-color-base-page)' : 'var(--modus-wc-color-base-200)',
                      }}
                      aria-label={color === 'transparent' ? 'No color' : 'Select color ' + color}
                    >
                      {color === 'transparent' && (
                        <span
                          className="block w-full h-full rounded-full"
                          style={{ background: 'linear-gradient(to bottom right, transparent 45%, #E57373 45%, #E57373 55%, transparent 55%)' }}
                        />
                      )}
                      {showWithTransparency && (
                        <div className="absolute inset-0 rounded-full" style={{ backgroundColor: 'rgba(' + pr + ', ' + pg + ', ' + pb + ', ' + (transparency / 100) + ')' }} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <ModusWcTypography hierarchy="h4" size="md" weight="semibold" label="Custom" customClass="mb-2 block" />
              <div className="flex flex-wrap items-center gap-2">
                <ModusWcButton
                  variant="outlined"
                  color="tertiary"
                  shape="circle"
                  customClass="w-8 h-8 p-0 min-w-0 shrink-0"
                  onButtonClick={() => { setMode('precise'); setIsCreatingCustom(true); }}
                >
                  <ModusWcIcon name="add" size="sm" decorative />
                </ModusWcButton>
                {customColors.map((color) => {
                  const hexStr = color.startsWith('#') ? color : '#' + color;
                  const [cr, cg, cb] = /^#[0-9A-Fa-f]{6}$/i.test(hexStr) ? hexToRgb(hexStr) : [0, 0, 0];
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={"color-picker-checkerboard relative w-8 h-8 rounded-full border-2 p-0 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--modus-wc-color-primary)] focus-visible:ring-offset-2 shrink-0 overflow-hidden " + (selectedColor === color ? 'color-picker-swatch-selected' : '')}
                      style={{
                        borderColor: selectedColor === color ? 'var(--modus-wc-color-base-page)' : 'var(--modus-wc-color-base-200)',
                      }}
                      aria-label={'Select custom color ' + color}
                    >
                      <div className="absolute inset-0 rounded-full" style={{ backgroundColor: 'rgba(' + cr + ', ' + cg + ', ' + cb + ', ' + (transparency / 100) + ')' }} />
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <>
            <ModusWcTypography hierarchy="h4" size="md" weight="semibold" label="Color" customClass="mb-2 block" />
            <div
              ref={svRef}
              role="button"
              tabIndex={0}
              onClick={handleSvClick}
              onKeyDown={(ev) => { if (ev.key === 'Enter' || ev.key === ' ') handleSvClick(ev); }}
              className="relative w-full h-32 rounded-lg cursor-crosshair border border-[var(--modus-wc-color-base-200)] overflow-hidden"
              style={{
                background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, ${hueColor})`,
              }}
            >
              <div
                className="color-picker-sv-indicator w-3 h-3 rounded-full pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: saturation + '%',
                  top: (100 - brightness) + '%',
                  backgroundColor: hex,
                  boxShadow: '0 0 0 2px var(--modus-wc-color-base-page), 0 0 0 3px var(--modus-wc-color-base-content)',
                }}
              />
            </div>
            <div className="flex gap-2 items-center min-w-0">
              <div className="relative flex-1 min-w-0 h-4 rounded-full overflow-visible border border-[var(--modus-wc-color-base-200)]"
                style={{ background: 'linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)' }}
              >
                <input
                  type="range"
                  min={0}
                  max={360}
                  value={hue}
                  onChange={(e) => setHue(Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div
                  className="color-picker-hue-indicator absolute w-3 h-3 rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: (hue / 360) * 100 + '%',
                    top: 'calc(50% - 6px)',
                    backgroundColor: hex,
                  }}
                />
              </div>
              <div className="color-picker-checkerboard relative w-8 h-8 rounded-full shrink-0 border-2 border-[var(--modus-wc-color-base-200)] overflow-hidden">
                <div className="absolute inset-0 rounded-full" style={{ backgroundColor: 'rgba(' + r + ', ' + g + ', ' + b + ', ' + (transparency / 100) + ')' }} />
              </div>
            </div>
            <div className="grid gap-2 min-w-0" style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}>
              <div className="min-w-0">
                <ModusWcTextInput
                  value={hexInput}
                  onInputChange={handleHexInput}
                  onKeyDown={(e) => { if (e.key === 'Enter') applyHex(); }}
                  onBlur={applyHex}
                  customClass="w-full min-w-0 max-w-full"
                />
                <ModusWcTypography hierarchy="p" size="xs" customClass="text-[var(--modus-wc-color-base-content-low-contrast)] mt-1" label="HEX" />
              </div>
              <div className="min-w-0">
                <ModusWcTextInput value={String(r)} onInputChange={(e) => handleRgbChange('r', e.detail?.target?.value || '')} customClass="w-full min-w-0 max-w-full" />
                <ModusWcTypography hierarchy="p" size="xs" customClass="text-[var(--modus-wc-color-base-content-low-contrast)] mt-1" label="R" />
              </div>
              <div className="min-w-0">
                <ModusWcTextInput value={String(g)} onInputChange={(e) => handleRgbChange('g', e.detail?.target?.value || '')} customClass="w-full min-w-0 max-w-full" />
                <ModusWcTypography hierarchy="p" size="xs" customClass="text-[var(--modus-wc-color-base-content-low-contrast)] mt-1" label="G" />
              </div>
              <div className="min-w-0">
                <ModusWcTextInput value={String(b)} onInputChange={(e) => handleRgbChange('b', e.detail?.target?.value || '')} customClass="w-full min-w-0 max-w-full" />
                <ModusWcTypography hierarchy="p" size="xs" customClass="text-[var(--modus-wc-color-base-content-low-contrast)] mt-1" label="B" />
              </div>
            </div>
          </>
        )}

        <div className="min-w-0">
          <ModusWcTypography hierarchy="h4" size="md" weight="semibold" label="Transparency" customClass="mb-2 block" />
          <ModusWcSlider
            value={transparency}
            min={0}
            max={100}
            step={1}
            label=""
            customClass="w-full min-w-0 max-w-full"
            onInputChange={(e) => {
              const slider = e.target as { value?: number };
              if (slider?.value != null) setTransparency(slider.value);
            }}
          />
        </div>

        {mode === 'palette' && (
          <ModusWcButton variant="outlined" color="tertiary" onButtonClick={handleReset} customClass="w-full">
            Reset
          </ModusWcButton>
        )}
        {mode === 'precise' && isCreatingCustom && (
          <div className="flex justify-end gap-2">
            <ModusWcButton variant="outlined" color="tertiary" onButtonClick={() => { setMode('palette'); setIsCreatingCustom(false); }}>
              Cancel
            </ModusWcButton>
            <ModusWcButton variant="filled" color="primary" onButtonClick={handleSaveCustomColor}>
              Save
            </ModusWcButton>
          </div>
        )}
      </div>
    </ModusWcCard>
    </div>
  );
}

export default ColorPicker;
