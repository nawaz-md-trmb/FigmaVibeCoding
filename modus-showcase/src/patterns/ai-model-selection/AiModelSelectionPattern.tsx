// @ts-nocheck
import { useState } from 'react';
import { ModusWcCard, ModusWcButton, ModusWcBadge, ModusWcTypography, ModusWcIcon } from '@trimble-oss/moduswebcomponents-react';

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

interface Model {
  id: string;
  name: string;
  description: string;
  speed: 'fast' | 'medium' | 'slow';
  accuracy: 'high' | 'medium' | 'low';
  cost: 'low' | 'medium' | 'high';
}

export function ModelSelection() {
  const [selectedModel, setSelectedModel] = useState<string>('model-1');

  const models: Model[] = [
    {
      id: 'model-1',
      name: 'Fast Model',
      description: 'Optimized for speed and low latency',
      speed: 'fast',
      accuracy: 'medium',
      cost: 'low'
    },
    {
      id: 'model-2',
      name: 'Accurate Model',
      description: 'Optimized for accuracy and quality',
      speed: 'slow',
      accuracy: 'high',
      cost: 'high'
    },
    {
      id: 'model-3',
      name: 'Balanced Model',
      description: 'Good balance of speed and accuracy',
      speed: 'medium',
      accuracy: 'medium',
      cost: 'medium'
    }
  ];

  return (
    <div className="min-w-0 w-full ai-model-select-container space-y-4" style={{ containerType: 'inline-size' }} data-ai-model-select>
      <ModusWcTypography hierarchy="h4" size="lg" weight="semibold" label="Select AI Model" />
      <div className="ai-model-select-grid grid gap-4">
        {models.map((model) => (
          <ModusWcCard
            key={model.id}
            customClass={`cursor-pointer transition-all ${selectedModel === model.id ? 'ring-2 ring-[var(--primary)]' : ''}`}
            onClick={() => setSelectedModel(model.id)}
          >
            <ModusWcTypography slot="title" hierarchy="h4" size="md" weight="semibold" label={model.name} />
            <div className="p-4 space-y-3">
              <ModusWcTypography hierarchy="p" size="sm" customClass="text-[var(--muted-foreground)]" label={model.description} />
              <div className="flex flex-wrap gap-2">
                <ModusWcBadge variant="outlined" color="tertiary" customClass="text-xs">
                  Speed: {model.speed}
                </ModusWcBadge>
                <ModusWcBadge variant="outlined" color="tertiary" customClass="text-xs">
                  Accuracy: {model.accuracy}
                </ModusWcBadge>
                <ModusWcBadge variant="outlined" color="tertiary" customClass="text-xs">
                  Cost: {model.cost}
                </ModusWcBadge>
              </div>
              {selectedModel === model.id && (
                <ModusWcButton size="sm" customClass="w-full mt-2">
                  <ModusWcIcon name={getModusIconName("CheckCircle")} size={getModusIconSize("h-4 w-4")} customClass="mr-2 h-4 w-4" />
                  Selected
                </ModusWcButton>
              )}
            </div>
          </ModusWcCard>
        ))}
      </div>
    </div>
  );
}

export default ModelSelection;
