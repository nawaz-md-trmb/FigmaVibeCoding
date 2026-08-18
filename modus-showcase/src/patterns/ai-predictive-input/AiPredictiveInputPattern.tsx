// @ts-nocheck
import { useState, useEffect, useRef } from 'react';
import { ModusWcIcon, ModusWcButton, ModusWcCard, ModusWcBadge, ModusWcTextarea } from '@trimble-oss/moduswebcomponents-react';

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
  type: 'completion' | 'correction' | 'enhancement' | 'style';
  original: string;
  suggestion: string;
  confidence: number;
  reason: string;
  position: { start: number; end: number };
}

interface PredictiveInput {
  content: string;
  suggestions: Suggestion[];
  isAnalyzing: boolean;
}

export function AIPredictiveInput() {
  const [input, setInput] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [activeSuggestion, setActiveSuggestion] = useState<Suggestion | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Mock AI suggestions
  const generateSuggestions = (text: string, cursor: number): Suggestion[] => {
    const mockSuggestions: Suggestion[] = [
      {
        id: '1',
        type: 'completion',
        original: 'The quick brown',
        suggestion: 'The quick brown fox jumps over the lazy dog',
        confidence: 89,
        reason: 'Common phrase completion',
        position: { start: 0, end: 15 }
      },
      {
        id: '2',
        type: 'correction',
        original: 'recieve',
        suggestion: 'receive',
        confidence: 95,
        reason: 'Spelling correction',
        position: { start: text.indexOf('recieve'), end: text.indexOf('recieve') + 7 }
      },
      {
        id: '3',
        type: 'enhancement',
        original: 'good',
        suggestion: 'excellent',
        confidence: 78,
        reason: 'More impactful word choice',
        position: { start: text.indexOf('good'), end: text.indexOf('good') + 4 }
      }
    ];

    return mockSuggestions.filter(s => 
      text.includes(s.original) && s.position.start >= 0
    );
  };

  useEffect(() => {
    if (input.length > 10) {
      setIsAnalyzing(true);
      const timer = setTimeout(() => {
        setSuggestions(generateSuggestions(input, cursorPosition));
        setIsAnalyzing(false);
      }, 800);
      
      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
    }
  }, [input, cursorPosition]);

  const applySuggestion = (suggestion: Suggestion) => {
    const newText = 
      input.substring(0, suggestion.position.start) +
      suggestion.suggestion +
      input.substring(suggestion.position.end);
    
    setInput(newText);
    setSuggestions(suggestions.filter(s => s.id !== suggestion.id));
    setActiveSuggestion(null);
    
    // Focus back to textarea
    textareaRef.current?.focus();
  };

  const dismissSuggestion = (suggestionId: string) => {
    setSuggestions(suggestions.filter(s => s.id !== suggestionId));
    if (activeSuggestion?.id === suggestionId) {
      setActiveSuggestion(null);
    }
  };

  const getSuggestionIcon = (type: Suggestion['type']) => {
    switch (type) {
      case 'completion':
        return <ModusWcIcon name={getModusIconName("Wand2")} size={getModusIconSize("h-4 w-4")} customClass="text-blue-500" />;
      case 'correction':
        return <ModusWcIcon name={getModusIconName("AlertCircle")} size={getModusIconSize("h-4 w-4")} customClass="text-red-500" />;
      case 'enhancement':
        return <ModusWcIcon name={getModusIconName("LightbulbOff")} size={getModusIconSize("h-4 w-4")} customClass="text-yellow-500" />;
      case 'style':
        return <ModusWcIcon name={getModusIconName("Sparkles")} size={getModusIconSize("h-4 w-4")} customClass="text-purple-500" />;
      default:
        return <ModusWcIcon name={getModusIconName("Wand2")} size={getModusIconSize("h-4 w-4")} />;
    }
  };

  const getSuggestionColor = (type: Suggestion['type']) => {
    switch (type) {
      case 'completion':
        return 'border-blue-200 bg-blue-50 text-blue-800';
      case 'correction':
        return 'border-red-200 bg-red-50 text-red-800';
      case 'enhancement':
        return 'border-yellow-200 bg-yellow-50 text-yellow-800';
      case 'style':
        return 'border-purple-200 bg-purple-50 text-purple-800';
      default:
        return 'border-gray-200 bg-gray-50 text-gray-800';
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* AI Status Indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ModusWcIcon name={getModusIconName("Sparkles")} size={getModusIconSize("h-4 w-4")} customClass={'h-4 w-4 ' + (isAnalyzing ? 'animate-pulse text-[var(--modus-wc-color-primary)]' : 'text-[var(--modus-wc-color-base-content-low-contrast)]')} />
          <span className="text-sm font-medium">AI Writing Assistant</span>
          {isAnalyzing && (
            <ModusWcBadge variant="outlined" color="tertiary" customClass="text-xs">
              Analyzing...
            </ModusWcBadge>
          )}
        </div>
        
        <div className="text-xs text-[var(--modus-wc-color-base-content-low-contrast)]">
          {suggestions.length} suggestion{suggestions.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Text Input Area */}
      <div className="relative">
        <ModusWcTextarea
          value={input}
          onInputChange={(e: CustomEvent) => {
            const target = e.detail?.target as HTMLTextAreaElement;
            setInput(target.value);
            setCursorPosition(target.selectionStart);
          }}
          placeholder="Start typing and AI will provide intelligent suggestions..."
          customClass="min-h-[200px] resize-none"
        />
        
        {/* Character Count */}
        <div className="absolute bottom-2 right-2 text-xs text-[var(--modus-wc-color-base-content-low-contrast)]">
          {input.length} characters
        </div>
      </div>

      {/* Suggestions Panel */}
      {suggestions.length > 0 && (
        <ModusWcCard>
          <div className="p-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <ModusWcIcon name={getModusIconName("Wand2")} size={getModusIconSize("h-4 w-4")} customClass="h-4 w-4 text-[var(--modus-wc-color-primary)]" />
                <span className="text-sm font-medium">AI Suggestions</span>
              </div>
              
              <div className="space-y-2">
                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className={'p-3 rounded-lg border ' + getSuggestionColor(suggestion.type)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          {getSuggestionIcon(suggestion.type)}
                          <span className="text-sm font-medium capitalize">
                            {suggestion.type}
                          </span>
                          <ModusWcBadge variant="outlined" color="tertiary" customClass="text-xs">
                            {suggestion.confidence}% confident
                          </ModusWcBadge>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="text-sm">
                            <span className="font-medium">Replace:</span>{' '}
                            <span className="bg-red-100 text-red-800 px-1 rounded">
                              "{suggestion.original}"
                            </span>
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">With:</span>{' '}
                            <span className="bg-green-100 text-green-800 px-1 rounded">
                              "{suggestion.suggestion}"
                            </span>
                          </div>
                          <p className="text-xs text-[var(--modus-wc-color-base-content-low-contrast)]">
                            {suggestion.reason}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-1">
                        <ModusWcButton
                          size="sm"
                          onButtonClick={() => applySuggestion(suggestion)}
                          customClass="h-8 w-8 p-0"
                        >
                          <ModusWcIcon name={getModusIconName("Check")} size={getModusIconSize("h-4 w-4")} />
                        </ModusWcButton>
                        <ModusWcButton
                          size="sm"
                          variant="borderless"
                          color="tertiary"
                          onButtonClick={() => dismissSuggestion(suggestion.id)}
                          customClass="h-8 w-8 p-0"
                        >
                          <ModusWcIcon name={getModusIconName("X")} size={getModusIconSize("h-4 w-4")} />
                        </ModusWcButton>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="pt-2 border-t border-[var(--modus-wc-color-base-300)]">
                <p className="text-xs text-[var(--modus-wc-color-base-content-low-contrast)]">
                  AI suggestions learn from your writing style and improve over time.
                </p>
              </div>
            </div>
          </div>
        </ModusWcCard>
      )}

      {/* Quick Actions */}
      <div className="flex gap-2">
        <ModusWcButton variant="outlined" color="tertiary" size="sm">
          <ModusWcIcon name={getModusIconName("Wand2")} size={getModusIconSize("h-4 w-4")} customClass="mr-1" />
          Enhance Writing
        </ModusWcButton>
        <ModusWcButton variant="outlined" color="tertiary" size="sm">
          <ModusWcIcon name={getModusIconName("AlertCircle")} size={getModusIconSize("h-4 w-4")} customClass="mr-1" />
          Check Grammar
        </ModusWcButton>
        <ModusWcButton variant="outlined" color="tertiary" size="sm">
          <ModusWcIcon name={getModusIconName("Sparkles")} size={getModusIconSize("h-4 w-4")} customClass="mr-1" />
          Improve Style
        </ModusWcButton>
      </div>
    </div>
  );
}

export default AIPredictiveInput;
