// @ts-nocheck
import { useState } from 'react';
import { ModusWcCard, ModusWcButton, ModusWcSwitch, ModusWcTypography, ModusWcBadge, ModusWcIcon } from '@trimble-oss/moduswebcomponents-react';

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

interface Workflow {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  steps: number;
}

export function WorkflowAutomation() {
  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: '1',
      name: 'Email Processing',
      description: 'Automatically categorize and respond to emails',
      enabled: true,
      steps: 3
    },
    {
      id: '2',
      name: 'Data Backup',
      description: 'Automatically backup data daily',
      enabled: false,
      steps: 2
    }
  ]);

  const toggleWorkflow = (id: string) => {
    setWorkflows(prev =>
      prev.map(w => w.id === id ? { ...w, enabled: !w.enabled } : w)
    );
  };

  return (
    <div className="space-y-4">
      {workflows.map((workflow) => (
        <ModusWcCard key={workflow.id}>
          <div className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <ModusWcTypography hierarchy="h4" size="md" weight="semibold" label={workflow.name} />
                <ModusWcTypography hierarchy="p" size="sm" customClass="text-[var(--muted-foreground)] mt-1" label={workflow.description} />
                <div className="flex items-center gap-2 mt-2">
                  <ModusWcBadge variant="outlined" color="tertiary" customClass="text-xs">
                    {workflow.steps} steps
                  </ModusWcBadge>
                  {workflow.enabled && (
                    <ModusWcBadge variant="filled" color="success" customClass="text-xs">
                      Active
                    </ModusWcBadge>
                  )}
                </div>
              </div>
              <ModusWcSwitch
                value={workflow.enabled}
                onSwitchChange={() => toggleWorkflow(workflow.id)}
              />
            </div>
            <div className="flex gap-2 mt-4">
              <ModusWcButton variant="outlined" color="tertiary" size="sm">
                <ModusWcIcon name={getModusIconName("Edit")} size={getModusIconSize("h-4 w-4")} customClass="mr-2 h-4 w-4" />
                Edit
              </ModusWcButton>
              <ModusWcButton variant="outlined" color="tertiary" size="sm">
                <ModusWcIcon name={getModusIconName("Play")} size={getModusIconSize("h-4 w-4")} customClass="mr-2 h-4 w-4" />
                Run Now
              </ModusWcButton>
            </div>
          </div>
        </ModusWcCard>
      ))}
    </div>
  );
}

export default WorkflowAutomation;
