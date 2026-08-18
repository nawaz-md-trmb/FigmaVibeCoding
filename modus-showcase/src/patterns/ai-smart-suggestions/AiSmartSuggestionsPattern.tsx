// @ts-nocheck
import { useState, useEffect } from 'react';
import { ModusWcIcon, ModusWcTextInput, ModusWcCard, ModusWcBadge, ModusWcButton } from '@trimble-oss/moduswebcomponents-react';

const _ICON_MAP = {
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
function getModusIconName(name) { return _ICON_MAP[name] || name; }
function getModusIconSize(className) {
  if (!className) return 'md';
  if (className.includes('h-3') || className.includes('h-4')) return 'sm';
  if (className.includes('h-7') || className.includes('h-8')) return 'lg';
  return 'md';
}

interface Suggestion {
  id: string;
  text: string;
  confidence: number;
  type: 'trending' | 'recent' | 'personalized' | 'contextual';
  metadata?: {
    count?: number;
    lastUsed?: Date;
    category?: string;
  };
}

export function AISmartSuggestions() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock suggestions data
  const mockSuggestions: Suggestion[] = [
    {
      id: '1',
      text: 'React component design patterns',
      confidence: 95,
      type: 'trending',
      metadata: { count: 1240, category: 'Development' }
    },
    {
      id: '2',
      text: 'React performance optimization',
      confidence: 88,
      type: 'personalized',
      metadata: { lastUsed: new Date('2024-01-10'), category: 'Development' }
    },
    {
      id: '3',
      text: 'React testing best practices',
      confidence: 92,
      type: 'contextual',
      metadata: { count: 856, category: 'Development' }
    },
    {
      id: '4',
      text: 'React hooks tutorial',
      confidence: 76,
      type: 'recent',
      metadata: { lastUsed: new Date('2024-01-09'), category: 'Development' }
    }
  ];

  useEffect(() => {
    if (query.length > 2) {
      setIsLoading(true);
      // Simulate AI processing
      setTimeout(() => {
        setSuggestions(mockSuggestions.filter(s => 
          s.text.toLowerCase().includes(query.toLowerCase())
        ));
        setIsLoading(false);
      }, 300);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const getTypeIcon = (type: Suggestion['type']) => {
    switch (type) {
      case 'trending':
        return <ModusWcIcon name={getModusIconName("TrendingUp")} size={getModusIconSize("h-4 w-4")} customClass="text-orange-500" />;
      case 'recent':
        return <ModusWcIcon name={getModusIconName("Clock")} size={getModusIconSize("h-4 w-4")} customClass="text-blue-500" />;
      case 'personalized':
        return <ModusWcIcon name={getModusIconName("Sparkles")} size={getModusIconSize("h-4 w-4")} customClass="text-purple-500" />;
      default:
        return <ModusWcIcon name={getModusIconName("Search")} size={getModusIconSize("h-4 w-4")} customClass="text-gray-500" />;
    }
  };

  const getTypeLabel = (type: Suggestion['type']) => {
    switch (type) {
      case 'trending':
        return 'Trending';
      case 'recent':
        return 'Recent';
      case 'personalized':
        return 'For you';
      default:
        return 'Suggested';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="max-w-md mx-auto space-y-4">
      <div className="relative">
        <ModusWcTextInput
          value={query}
          onInputChange={(e: CustomEvent) => setQuery(e.detail?.target?.value || '')}
          placeholder="Search with AI suggestions..."
          includeSearch={true}
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <ModusWcIcon name="ai_stars" size="sm" customClass="animate-pulse text-[var(--modus-wc-color-primary)]" decorative />
          </div>
        )}
      </div>

      {suggestions.length > 0 && (
        <ModusWcCard>
          <div className="p-0">
            <div className="p-3 border-b border-[var(--modus-wc-color-base-300)]">
              <div className="flex items-center gap-2">
                <ModusWcIcon name={getModusIconName("Sparkles")} size={getModusIconSize("h-4 w-4")} customClass="h-4 w-4 text-[var(--modus-wc-color-primary)]" />
                <span className="text-sm font-medium">AI Suggestions</span>
              </div>
            </div>
            
            <div className="max-h-60 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <ModusWcButton
                  key={suggestion.id}
                  variant="borderless"
                  color="tertiary"
                  customClass="w-full justify-between p-3 h-auto text-left hover:bg-[color-mix(in srgb, var(--modus-wc-color-primary) 10%, transparent)]"
                  onButtonClick={() => setQuery(suggestion.text)}
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(suggestion.type)}
                      <span className="font-medium">{suggestion.text}</span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-xs text-[var(--modus-wc-color-base-content-low-contrast)]">
                      <ModusWcBadge variant="outlined" color="tertiary" customClass="text-xs">
                        {getTypeLabel(suggestion.type)}
                      </ModusWcBadge>
                      
                      <span className={getConfidenceColor(suggestion.confidence)}>
                        {suggestion.confidence}% match
                      </span>
                      
                      {suggestion.metadata?.count && (
                        <span>{suggestion.metadata.count.toLocaleString()} results</span>
                      )}
                    </div>
                  </div>
                  
                  <ModusWcIcon name={getModusIconName("ChevronRight")} size={getModusIconSize("h-4 w-4")} customClass="h-4 w-4 text-[var(--modus-wc-color-base-content-low-contrast)]" />
                </ModusWcButton>
              ))}
            </div>
            
            <div className="p-3 border-t border-[var(--modus-wc-color-base-300)] bg-[var(--modus-wc-color-base-200)]/20">
              <p className="text-xs text-[var(--modus-wc-color-base-content-low-contrast)]">
                Suggestions powered by AI • Learn from your preferences
              </p>
            </div>
          </div>
        </ModusWcCard>
      )}
    </div>
  );
}

export default AISmartSuggestions;
