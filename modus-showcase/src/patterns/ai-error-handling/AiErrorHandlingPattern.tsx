// @ts-nocheck
import { useState } from 'react';
import { ModusWcIcon, ModusWcCard, ModusWcButton, ModusWcAlert, ModusWcBadge, ModusWcProgress, ModusWcTypography } from '@trimble-oss/moduswebcomponents-react';

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
  Compass:'compass',Network:'wifi',
};
type IconKey = keyof typeof _ICON_MAP;
function getModusIconName(name: IconKey | string): string {
  return (_ICON_MAP as Record<string, string>)[name as string] ?? String(name);
}
function getModusIconSize(className?: string): 'sm' | 'md' | 'lg' {
  if (!className) return 'md';
  if (className.includes('h-3') || className.includes('h-4')) return 'sm';
  if (className.includes('h-7') || className.includes('h-8')) return 'lg';
  return 'md';
}

interface AIError {
  type: 'timeout' | 'quota_exceeded' | 'low_confidence' | 'network' | 'model_unavailable' | 'invalid_input' | 'processing_failed';
  message: string;
  details?: string;
  recoverable: boolean;
  retryable: boolean;
  fallbackAvailable: boolean;
  estimatedRecovery?: number;
}

interface AIErrorState {
  hasError: boolean;
  error?: AIError;
  retryCount: number;
  fallbackActive: boolean;
  isRetrying: boolean;
}

export function AIErrorHandling() {
  const [errorStates, setErrorStates] = useState<Record<string, AIErrorState>>({
    timeout: { hasError: false, retryCount: 0, fallbackActive: false, isRetrying: false },
    quota: { hasError: false, retryCount: 0, fallbackActive: false, isRetrying: false },
    confidence: { hasError: false, retryCount: 0, fallbackActive: false, isRetrying: false },
    network: { hasError: false, retryCount: 0, fallbackActive: false, isRetrying: false }
  });

  const aiErrors: Record<string, AIError> = {
    timeout: {
      type: 'timeout',
      message: 'AI processing timed out',
      details: 'The AI system took longer than expected to process your request. This may be due to high server load or complex content.',
      recoverable: true,
      retryable: true,
      fallbackAvailable: true,
      estimatedRecovery: 30
    },
    quota: {
      type: 'quota_exceeded',
      message: 'AI quota exceeded',
      details: 'You have reached the limit for AI requests. Your quota will reset in 1 hour, or you can upgrade for unlimited access.',
      recoverable: false,
      retryable: false,
      fallbackAvailable: true
    },
    confidence: {
      type: 'low_confidence',
      message: 'Low AI confidence',
      details: 'The AI system has low confidence in this result. Please review the output carefully or try rephrasing your request.',
      recoverable: true,
      retryable: true,
      fallbackAvailable: true
    },
    network: {
      type: 'network',
      message: 'Connection error',
      details: 'Unable to connect to AI services. Please check your internet connection and try again.',
      recoverable: true,
      retryable: true,
      fallbackAvailable: false
    }
  };

  const triggerError = (errorKey: string) => {
    setErrorStates(prev => ({
      ...prev,
      [errorKey]: {
        ...prev[errorKey],
        hasError: true,
        error: aiErrors[errorKey],
        retryCount: 0
      }
    }));
  };

  const retryOperation = (errorKey: string) => {
    setErrorStates(prev => ({
      ...prev,
      [errorKey]: {
        ...prev[errorKey],
        isRetrying: true,
        retryCount: prev[errorKey].retryCount + 1
      }
    }));

    setTimeout(() => {
      // Simulate retry success after 2 seconds
      setErrorStates(prev => ({
        ...prev,
        [errorKey]: {
          hasError: false,
          retryCount: 0,
          fallbackActive: false,
          isRetrying: false
        }
      }));
    }, 2000);
  };

  const activateFallback = (errorKey: string) => {
    setErrorStates(prev => ({
      ...prev,
      [errorKey]: {
        ...prev[errorKey],
        fallbackActive: true,
        hasError: false
      }
    }));
  };

  const getErrorIcon = (type: AIError['type']) => {
    switch (type) {
      case 'timeout':
        return <ModusWcIcon name={getModusIconName("Clock")} size={getModusIconSize("h-5 w-5")} customClass="h-5 w-5 text-yellow-600" />;
      case 'quota_exceeded':
        return <ModusWcIcon name={getModusIconName("AlertTriangle")} size={getModusIconSize("h-5 w-5")} customClass="h-5 w-5 text-red-600" />;
      case 'low_confidence':
        return <ModusWcIcon name={getModusIconName("Brain")} size={getModusIconSize("h-5 w-5")} customClass="h-5 w-5 text-orange-600" />;
      case 'network':
        return <ModusWcIcon name={getModusIconName("Network")} size={getModusIconSize("h-5 w-5")} customClass="h-5 w-5 text-red-600" />;
      default:
        return <ModusWcIcon name={getModusIconName("AlertTriangle")} size={getModusIconSize("h-5 w-5")} customClass="h-5 w-5 text-red-600" />;
    }
  };

  const getErrorColor = (type: AIError['type']) => {
    switch (type) {
      case 'timeout':
        return 'border-yellow-200 bg-yellow-50';
      case 'quota_exceeded':
        return 'border-red-200 bg-red-50';
      case 'low_confidence':
        return 'border-orange-200 bg-orange-50';
      case 'network':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-red-200 bg-red-50';
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Error Demo Controls */}
      <ModusWcCard>
        <ModusWcTypography slot="title" hierarchy="h4" size="lg" weight="semibold" customClass="flex items-center gap-2">
          <ModusWcIcon name={getModusIconName("Brain")} size={getModusIconSize("h-5 w-5")} customClass="h-5 w-5 text-[var(--modus-wc-color-primary)]" />
          AI Error Handling Demo
        </ModusWcTypography>
        <div className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <ModusWcButton
              variant="outlined"
              color="tertiary"
              size="sm"
              onButtonClick={() => triggerError('timeout')}
              disabled={errorStates.timeout.hasError}
            >
              Trigger Timeout
            </ModusWcButton>
            <ModusWcButton
              variant="outlined"
              color="tertiary"
              size="sm"
              onButtonClick={() => triggerError('quota')}
              disabled={errorStates.quota.hasError}
            >
              Trigger Quota Error
            </ModusWcButton>
            <ModusWcButton
              variant="outlined"
              color="tertiary"
              size="sm"
              onButtonClick={() => triggerError('confidence')}
              disabled={errorStates.confidence.hasError}
            >
              Low Confidence
            </ModusWcButton>
            <ModusWcButton
              variant="outlined"
              color="tertiary"
              size="sm"
              onButtonClick={() => triggerError('network')}
              disabled={errorStates.network.hasError}
            >
              Network Error
            </ModusWcButton>
          </div>
        </div>
      </ModusWcCard>

      {/* Error States Display */}
      {Object.entries(errorStates).map(([key, state]) => {
        if (!state.hasError && !state.fallbackActive && !state.isRetrying) return null;

        const error = state.error!;
        
        return (
          <ModusWcCard key={key} customClass={'border-2 ' + getErrorColor(error.type)}>
            <div className="p-6">
              <div className="space-y-4">
                {/* Error Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getErrorIcon(error.type)}
                    <div>
                      <ModusWcTypography hierarchy="h3" size="lg" weight="semibold" label={error.message} />
                      <ModusWcTypography className="text-[var(--modus-wc-color-base-content-low-contrast)]" hierarchy="p" size="sm" customClass="mt-1" label={error.details || ''} />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <ModusWcBadge variant={error.recoverable ? 'outlined' : 'filled'} color={error.recoverable ? 'tertiary' : 'danger'}>
                      {error.recoverable ? 'Recoverable' : 'Error'}
                    </ModusWcBadge>
                    {state.retryCount > 0 && (
                      <ModusWcBadge variant="outlined" color="tertiary">
                        Retry {state.retryCount}
                      </ModusWcBadge>
                    )}
                  </div>
                </div>

                {/* Retry Progress */}
                {state.isRetrying && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <ModusWcIcon name={getModusIconName("RefreshCw")} size={getModusIconSize("h-4 w-4")} customClass="h-4 w-4 animate-spin text-[var(--modus-wc-color-primary)]" />
                      <span className="text-sm">Retrying operation...</span>
                    </div>
                    <ModusWcProgress value={75} max={100} customClass="h-2" />
                  </div>
                )}

                {/* Recovery Options */}
                {!state.isRetrying && (
                  <div className="flex items-center gap-3 pt-3 border-t border-[var(--modus-wc-color-base-300)]">
                    {error.retryable && (
                      <ModusWcButton
                        onButtonClick={() => retryOperation(key)}
                        disabled={state.isRetrying}
                        size="sm"
                      >
                        <ModusWcIcon name={getModusIconName("RefreshCw")} size={getModusIconSize("h-4 w-4")} customClass="mr-1" />
                        Retry
                      </ModusWcButton>
                    )}
                    
                    {error.fallbackAvailable && (
                      <ModusWcButton
                        variant="outlined"
                        color="tertiary"
                        onButtonClick={() => activateFallback(key)}
                        size="sm"
                      >
                        <ModusWcIcon name={getModusIconName("ArrowRight")} size={getModusIconSize("h-4 w-4")} customClass="mr-1" />
                        Use Fallback
                      </ModusWcButton>
                    )}
                    
                    <ModusWcButton variant="borderless" color="tertiary" size="sm">
                      <ModusWcIcon name={getModusIconName("HelpCircle")} size={getModusIconSize("h-4 w-4")} customClass="mr-1" />
                      Get Help
                    </ModusWcButton>
                  </div>
                )}

                {/* Fallback Notice */}
                {state.fallbackActive && (
                  <ModusWcAlert
                    variant="warning"
                    icon="info_filled"
                    alertDescription="Now using alternative processing method. Results may be different from AI analysis."
                  />
                )}

                {/* Recovery Time Estimate */}
                {error.estimatedRecovery && !state.isRetrying && (
                  <div className="bg-[var(--modus-wc-color-base-200)]/20 p-3 rounded-lg">
                    <p className="text-sm text-[var(--modus-wc-color-base-content-low-contrast)]">
                      <ModusWcIcon name={getModusIconName("Clock")} size={getModusIconSize("h-4 w-4")} customClass="inline mr-1" />
                      Estimated recovery time: {error.estimatedRecovery} seconds
                    </p>
                  </div>
                )}
              </div>
            </div>
          </ModusWcCard>
        );
      })}

      {/* Error Prevention Tips */}
      <ModusWcCard>
        <ModusWcTypography slot="title" hierarchy="h4" size="lg" weight="semibold" label="Preventing AI Errors" />
        <div className="p-4 space-y-4">
          <div className="grid gap-4">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <ModusWcIcon name={getModusIconName("MessageCircle")} size={getModusIconSize("h-5 w-5")} customClass="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800">Clear Input</p>
                <p className="text-xs text-blue-600">Provide clear, specific input to improve AI processing accuracy</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <ModusWcIcon name={getModusIconName("Network")} size={getModusIconSize("h-5 w-5")} customClass="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-800">Stable Connection</p>
                <p className="text-xs text-green-600">Ensure stable internet connection for best AI performance</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
              <ModusWcIcon name={getModusIconName("Brain")} size={getModusIconSize("h-5 w-5")} customClass="h-5 w-5 text-purple-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-purple-800">Appropriate Complexity</p>
                <p className="text-xs text-purple-600">Break complex requests into smaller, manageable parts</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
              <ModusWcIcon name={getModusIconName("Clock")} size="sm" decorative customClass="mt-0.5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-yellow-800">Off-Peak Usage</p>
                <p className="text-xs text-yellow-600">Use AI services during off-peak hours for faster processing</p>
              </div>
            </div>
          </div>
        </div>
      </ModusWcCard>

      {/* Support Options */}
      <ModusWcCard>
        <div className="p-4 pb-0">
          <ModusWcTypography hierarchy="h4" size="md" weight="semibold" label="Need Additional Help?" />
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ModusWcButton
              variant="outlined"
              color="tertiary"
              customClass="flex flex-col items-center gap-2 h-auto min-h-[4.5rem] py-3"
              onButtonClick={() => {}}
            >
              <ModusWcIcon name={getModusIconName("HelpCircle")} size="md" decorative />
              <span className="text-sm">Documentation</span>
            </ModusWcButton>
            <ModusWcButton
              variant="outlined"
              color="tertiary"
              customClass="flex flex-col items-center gap-2 h-auto min-h-[4.5rem] py-3"
              onButtonClick={() => {}}
            >
              <ModusWcIcon name={getModusIconName("MessageSquare")} size="md" decorative />
              <span className="text-sm">Contact Support</span>
            </ModusWcButton>
            <ModusWcButton
              variant="outlined"
              color="tertiary"
              customClass="flex flex-col items-center gap-2 h-auto min-h-[4.5rem] py-3"
              onButtonClick={() => {}}
            >
              <ModusWcIcon name={getModusIconName("AlertTriangle")} size="md" decorative />
              <span className="text-sm">Report Issue</span>
            </ModusWcButton>
          </div>
        </div>
      </ModusWcCard>
    </div>
  );
}

export default AIErrorHandling;
