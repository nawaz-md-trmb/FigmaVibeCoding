// @ts-nocheck
import { useState, useRef, useEffect } from 'react';
import { ModusWcDropdownMenu, ModusWcMenuItem, ModusWcIcon, ModusWcTypography } from '@trimble-oss/moduswebcomponents-react';

// Inline icon mapping (Modus icons) — no external dependency needed
const _ICON_MAP: Record<string, string> = {
  Menu:'menu',X:'cancel_circle',Home:'home',Search:'search',Copy:'copy_content',
  Check:'check_simple',CheckCircle:'check_circle',CheckCircle2:'check_circle',
  ArrowLeft:'arrow_left_circle',ArrowRight:'arrow_right_circle',
  ChevronDown:'caret_down_bold',ChevronRight:'chevron_right_bold',
  ExternalLink:'launch',Palette:'palette',Blocks:'apps',LayoutTemplate:'window_template',
  Puzzle:'apps',Ruler:'ruler',Package:'package',Image:'image',Type:'text_bold',
  Camera:'camera',Settings:'settings',Users:'users',User:'person',Person:'person',
  Bell:'notifications',FileText:'file_text',Download:'save_download',Upload:'upload',
  Eye:'inspect',Monitor:'screen',Sun:'sun',Moon:'moon',Smartphone:'phone_mobile',
  Tablet:'tablet',Laptop:'laptop',Brush:'tool',Shapes:'list_shapes',Sparkles:'ai_stars',
  Zap:'lightning',Database:'server',Navigation:'compass',Layout:'view_grid',
  CreditCard:'monetarization',Filter:'filter',Grid:'view_grid',Columns:'view_grid',
  List:'view_list',BarChart:'chart_bar',BarChart3:'chart_bar',MoreHorizontal:'more_horizontal',
  Plus:'add',Square:'circle_outline',Scroll:'view_list',Loader:'sync',Loader2:'sync',
  AlertTriangle:'warning_filled',AlertCircle:'alert_outlined',Info:'info_outlined',
  Lightbulb:'lightbulb_off',Code:'code',Activity:'analytics',TrendingUp:'analytics',
  TrendingDown:'analytics',DollarSign:'dollar_circle',Mic:'microphone',MicOff:'microphone',
  Volume2:'microphone',VolumeX:'microphone',Send:'launch',MessageSquare:'message',
  RefreshCw:'sync',RotateCcw:'sync',WifiOff:'wifi',Command:'shortcut',Layers:'layer',
  LayoutDashboard:'dashboard',Bot:'person',Brain:'person',Cpu:'server',HelpCircle:'help',
  UserX:'user_remove',Target:'flag',ThumbsUp:'thumbs_up',ThumbsDown:'thumbs_down',
  Star:'star',Heart:'star',Edit:'pencil',Wand2:'tool',History:'history',Share:'share',
  Flag:'flag',XCircle:'cancel_circle',Calendar:'calendar',Clock:'clock',
  MousePointer:'cursor',ShieldCheck:'check_circle',Shield:'check_circle',FormInput:'pencil',
  Play:'launch',Book:'file_text',BookOpen:'file_text',Circle:'circle_outline',
  Component:'apps',Grid3X3:'view_grid',GripVertical:'drag_vertical',Maximize2:'window_resize',
  Compass:'compass',
};
function getModusIconName(name: string): string { return _ICON_MAP[name] || name; }
function getModusIconSize(className?: string): 'sm' | 'md' | 'lg' {
  if (!className) return 'md';
  if (className.includes('h-3') || className.includes('h-4')) return 'sm';
  if (className.includes('h-7') || className.includes('h-8')) return 'lg';
  return 'md';
}

export function DropdownMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');
  const dropdownRef = useRef<any>(null);

  const handleItemSelect = (e: CustomEvent) => {
    setSelectedValue(e.detail.value);
    setIsOpen(false);
    if (dropdownRef.current) {
      dropdownRef.current.menuVisible = false;
    }
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [isOpen]);

  return (
    <div className="space-y-4">
      <ModusWcDropdownMenu
        ref={dropdownRef}
        menuVisible={isOpen}
        onMenuVisibilityChange={(e: CustomEvent<{ isVisible: boolean }>) => setIsOpen(e.detail.isVisible)}
        buttonVariant="outlined"
        buttonColor="tertiary"
        buttonAriaLabel="Actions menu"
      >
        <div slot="button" className="flex items-center gap-2">
          Actions
          <ModusWcIcon name={getModusIconName("ChevronDown")} size={getModusIconSize("h-4 w-4")} customClass="h-4 w-4" />
        </div>
        <div slot="menu">
          <ModusWcMenuItem label="Edit" value="edit" onItemSelect={handleItemSelect} />
          <ModusWcMenuItem label="Duplicate" value="duplicate" onItemSelect={handleItemSelect} />
          <ModusWcMenuItem label="Delete" value="delete" onItemSelect={handleItemSelect} />
        </div>
      </ModusWcDropdownMenu>
      {selectedValue && (
        <ModusWcTypography hierarchy="p" size="sm" customClass="text-[var(--muted-foreground)]" label={`Selected: ${selectedValue}`} />
      )}
    </div>
  );
}

export default DropdownMenu;
