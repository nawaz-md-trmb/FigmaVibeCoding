// @ts-nocheck
import { useState, useRef, useEffect } from 'react';
import { ModusWcAvatar, ModusWcCard, ModusWcButton, ModusWcTextInput, ModusWcIcon, ModusWcLoader, ModusWcTypography } from '@trimble-oss/moduswebcomponents-react';

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

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  isTyping?: boolean;
}

export function AIChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI assistant. How can I help you today?",
      sender: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'I understand your question. Let me help you with that...',
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[600px] max-w-2xl mx-auto border border-[var(--border)] rounded-lg">
      {/* Header */}
      <div className="p-4 border-b border-[var(--border)] bg-[var(--card)]">
        <div className="flex items-center gap-3">
          <ModusWcAvatar initials="AI" size="sm" />
          <div>
            <h3 className="font-medium">AI Assistant</h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-[var(--muted-foreground)]">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.sender === 'assistant' && (
              <ModusWcAvatar initials="AI" size="sm" />
            )}
            
            <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-first' : ''}`}>
              <ModusWcCard customClass={`${message.sender === 'user' 
                ? 'bg-[var(--primary)] text-[var(--primary-foreground)]' 
                : 'bg-[var(--card)]'
              }`}>
                <div className="p-3">
                  <ModusWcTypography hierarchy="p" size="sm" label={message.content} />
                </div>
              </ModusWcCard>
              <ModusWcTypography hierarchy="p" size="xs" customClass="text-[var(--muted-foreground)] mt-1 px-1" label={message.timestamp.toLocaleTimeString()} />
            </div>

            {message.sender === 'user' && (
              <ModusWcAvatar initials="U" size="sm" />
            )}
          </div>
        ))}

        {/* Typing Indicator */}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <ModusWcAvatar initials="AI" size="sm" />
            <ModusWcCard customClass="bg-[var(--card)]">
              <div className="p-3">
                <div className="flex items-center gap-2">
                  <ModusWcLoader variant="spinner" size="sm" color="primary" customClass="h-4 w-4" aria-label="Loading" />
                  <ModusWcTypography hierarchy="p" size="sm" customClass="text-[var(--muted-foreground)]" label="AI is typing..." />
                </div>
              </div>
            </ModusWcCard>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-[var(--border)]">
        <div className="flex gap-2">
          <ModusWcTextInput
            value={input}
            onInputChange={(e: CustomEvent) => setInput(e.detail?.target?.value || '')}
            placeholder="Type your message..."
            onKeyPress={(e: KeyboardEvent) => e.key === 'Enter' && handleSend()}
            disabled={isLoading}
            customClass="flex-1"
          />
          <ModusWcButton onButtonClick={handleSend} disabled={!input.trim() || isLoading}>
            <ModusWcIcon name={getModusIconName("Send")} size={getModusIconSize("h-4 w-4")} customClass="h-4 w-4" />
          </ModusWcButton>
        </div>
        <ModusWcTypography hierarchy="p" size="xs" customClass="text-[var(--muted-foreground)] mt-2" label="AI responses may take a moment. Press Enter to send." />
      </div>
    </div>
  );
}

export default AIChatInterface;
