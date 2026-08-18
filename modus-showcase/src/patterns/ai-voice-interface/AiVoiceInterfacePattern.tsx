// @ts-nocheck
import { useState, useEffect, useRef } from 'react';
import { ModusWcIcon, ModusWcButton, ModusWcCard, ModusWcBadge, ModusWcProgress, ModusWcTypography } from '@trimble-oss/moduswebcomponents-react';

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

interface VoiceCommand {
  id: string;
  transcript: string;
  confidence: number;
  timestamp: Date;
  response?: string;
  status: 'processing' | 'completed' | 'error';
}

export function AIVoiceInterface() {
  const [isListening, setIsListening] = useState(false);
  const [isWakeWordActive, setIsWakeWordActive] = useState(true);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [commands, setCommands] = useState<VoiceCommand[]>([]);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const animationRef = useRef<number>();

  // Simulate audio level animation
  useEffect(() => {
    if (isListening) {
      const animate = () => {
        setAudioLevel(Math.random() * 100);
        animationRef.current = requestAnimationFrame(animate);
      };
      animate();
    } else {
      setAudioLevel(0);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isListening]);

  const startListening = () => {
    setIsListening(true);
    setCurrentTranscript('');
    
    // Simulate speech recognition
    setTimeout(() => {
      setCurrentTranscript('Hello, what can I help you with today?');
    }, 1000);
  };

  const stopListening = () => {
    setIsListening(false);
    
    if (currentTranscript) {
      setIsProcessing(true);
      const newCommand: VoiceCommand = {
        id: Date.now().toString(),
        transcript: currentTranscript,
        confidence: 92,
        timestamp: new Date(),
        status: 'processing'
      };
      
      setCommands(prev => [newCommand, ...prev]);
      
      // Simulate AI processing
      setTimeout(() => {
        const response = 'I understand. Let me help you with that.';
        setCommands(prev => 
          prev.map(cmd => 
            cmd.id === newCommand.id 
              ? { ...cmd, response, status: 'completed' as const }
              : cmd
          )
        );
        setIsProcessing(false);
        setCurrentTranscript('');
      }, 2000);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const getStatusColor = (status: VoiceCommand['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'processing':
        return 'text-yellow-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-[var(--modus-wc-color-base-content-low-contrast)]';
    }
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {/* Wake Word Status */}
      <ModusWcCard>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={'w-2 h-2 rounded-full ' + (isWakeWordActive ? 'bg-green-500' : 'bg-gray-400')} />
              <span className="text-sm font-medium">Wake Word Detection</span>
            </div>
            <ModusWcBadge variant={isWakeWordActive ? 'filled' : 'outlined'} color="tertiary">
              {isWakeWordActive ? 'Active' : 'Inactive'}
            </ModusWcBadge>
          </div>
        </div>
      </ModusWcCard>

      {/* Voice Visualization */}
      <ModusWcCard bordered={true}>
        <ModusWcTypography slot="title" hierarchy="h4" size="lg" weight="semibold" customClass="flex items-center gap-2 pb-3">
          <ModusWcIcon name={getModusIconName("Volume2")} size={getModusIconSize("h-5 w-5")} />
          Voice Interface
        </ModusWcTypography>
        <div className="p-4 space-y-4">
          {/* Audio Waveform Visualization */}
          <div className="flex items-center justify-center h-24 bg-[var(--modus-wc-color-base-200)]/20 rounded-lg">
            <div className="flex items-end gap-1 h-16">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className={'w-2 bg-[var(--modus-wc-color-primary)] rounded-full transition-all duration-100 ' + (isListening ? 'opacity-100' : 'opacity-30')}
                  style={{
                    height: isListening 
                      ? Math.max(4, (Math.sin(Date.now() * 0.01 + i) + 1) * 30) + 'px'
                      : '4px'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Audio Level Indicator */}
          {isListening && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Audio Level</span>
                <span>{Math.round(audioLevel)}%</span>
              </div>
              <ModusWcProgress value={audioLevel} max={100} customClass="h-2" />
            </div>
          )}

          {/* Current Transcript */}
          {currentTranscript && (
            <ModusWcCard customClass="bg-[var(--modus-wc-color-base-200)]/20">
              <div className="p-3">
                <div className="flex items-start gap-2">
                  <ModusWcIcon name={getModusIconName("MessageCircle")} size={getModusIconSize("h-4 w-4")} customClass="h-4 w-4 mt-0.5 text-[var(--modus-wc-color-primary)]" />
                  <p className="text-sm">{currentTranscript}</p>
                </div>
              </div>
            </ModusWcCard>
          )}

          {/* Voice Controls */}
          <div className="flex justify-center gap-4">
            <ModusWcButton
              onButtonClick={toggleListening}
              size="lg"
              customClass={'rounded-full w-16 h-16 ' + (
                isListening 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-[var(--modus-wc-color-primary)] hover:bg-[var(--modus-wc-color-primary)]/90'
              )}
            >
              {isListening ? (
                <ModusWcIcon name={getModusIconName("MicOff")} size={getModusIconSize("h-6 w-6")} />
              ) : (
                <ModusWcIcon name={getModusIconName("Mic")} size={getModusIconSize("h-6 w-6")} />
              )}
            </ModusWcButton>
            
            <ModusWcButton
              onButtonClick={() => setIsWakeWordActive(!isWakeWordActive)}
              variant="outlined"
              color="tertiary"
              size="lg"
              customClass="rounded-full w-16 h-16"
            >
              <ModusWcIcon name={getModusIconName("Settings")} size={getModusIconSize("h-6 w-6")} />
            </ModusWcButton>
          </div>

          {isProcessing && (
            <div className="text-center py-2">
              <p className="text-sm text-[var(--modus-wc-color-base-content-low-contrast)]">
                Processing your request...
              </p>
            </div>
          )}
        </div>
      </ModusWcCard>

      {/* Command History */}
      {commands.length > 0 && (
        <ModusWcCard>
          <ModusWcTypography slot="title" hierarchy="h4" size="sm" weight="semibold" customClass="pb-3" label="Recent Commands" />
          <div className="p-4 space-y-3">
            {commands.slice(0, 3).map((command) => (
              <div key={command.id} className="space-y-2">
                <div className="flex items-start gap-2">
                  <ModusWcIcon name={getModusIconName("Mic")} size={getModusIconSize("h-4 w-4")} customClass="h-4 w-4 mt-0.5 text-[var(--modus-wc-color-base-content-low-contrast)]" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{command.transcript}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={'text-xs ' + getStatusColor(command.status)}>
                        {command.confidence}% confidence
                      </span>
                      <span className="text-xs text-[var(--modus-wc-color-base-content-low-contrast)]">
                        {command.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                {command.response && (
                  <div className="flex items-start gap-2 ml-6">
                    <ModusWcIcon name={getModusIconName("Volume2")} size={getModusIconSize("h-4 w-4")} customClass="h-4 w-4 mt-0.5 text-[var(--modus-wc-color-primary)]" />
                    <p className="text-sm text-[var(--modus-wc-color-base-content-low-contrast)]">{command.response}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ModusWcCard>
      )}

      {/* Instructions */}
      <ModusWcCard>
        <div className="p-4">
          <p className="text-sm text-[var(--modus-wc-color-base-content-low-contrast)]">
            Say "Hey Assistant" to activate, or press the microphone button to start voice interaction.
          </p>
        </div>
      </ModusWcCard>
    </div>
  );
}

export default AIVoiceInterface;
