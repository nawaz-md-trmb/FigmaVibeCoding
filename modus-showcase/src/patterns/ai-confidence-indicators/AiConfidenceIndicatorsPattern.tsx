// @ts-nocheck
import { useState } from 'react';
import { ModusWcIcon, ModusWcCard, ModusWcProgress, ModusWcBadge, ModusWcButton, ModusWcTypography } from '@trimble-oss/moduswebcomponents-react';

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

interface AIResult {
  id: string;
  type: 'recommendation' | 'classification' | 'prediction' | 'analysis';
  title: string;
  content: string;
  confidence: number;
  factors: Array<{
    name: string;
    impact: number;
    explanation: string;
  }>;
  uncertainty: {
    level: 'low' | 'medium' | 'high';
    reason: string;
  };
}

export function AIConfidenceIndicators() {
  const [results] = useState<AIResult[]>([
    {
      id: '1',
      type: 'recommendation',
      title: 'Product Recommendation',
      content: 'Wireless Bluetooth Headphones - Premium Audio Quality',
      confidence: 92,
      factors: [
        { name: 'Purchase History', impact: 85, explanation: 'Based on your previous audio equipment purchases' },
        { name: 'User Reviews', impact: 78, explanation: 'Similar users rated this product highly' },
        { name: 'Price Range', impact: 90, explanation: 'Matches your typical spending pattern' }
      ],
      uncertainty: {
        level: 'low',
        reason: 'Strong data patterns and user history match'
      }
    },
    {
      id: '2',
      type: 'classification',
      title: 'Document Classification',
      content: 'Invoice - Financial Document',
      confidence: 67,
      factors: [
        { name: 'Document Structure', impact: 70, explanation: 'Contains typical invoice formatting' },
        { name: 'Key Terms', impact: 60, explanation: 'Invoice-related keywords detected' },
        { name: 'Date Format', impact: 75, explanation: 'Standard business date format found' }
      ],
      uncertainty: {
        level: 'medium',
        reason: 'Some ambiguous elements in document structure'
      }
    },
    {
      id: '3',
      type: 'prediction',
      title: 'Market Forecast',
      content: 'Stock price likely to increase by 5-8% over next quarter',
      confidence: 34,
      factors: [
        { name: 'Historical Trends', impact: 40, explanation: 'Limited historical data available' },
        { name: 'Market Indicators', impact: 30, explanation: 'Mixed signals from market data' },
        { name: 'External Factors', impact: 35, explanation: 'Uncertain economic conditions' }
      ],
      uncertainty: {
        level: 'high',
        reason: 'Volatile market conditions and limited data'
      }
    }
  ]);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 80) return 'High Confidence';
    if (confidence >= 60) return 'Medium Confidence';
    return 'Low Confidence';
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 80) return <ModusWcIcon name={getModusIconName("CheckCircle")} size={getModusIconSize("h-4 w-4")} customClass="h-4 w-4 text-green-600" />;
    if (confidence >= 60) return <ModusWcIcon name={getModusIconName("TrendingUp")} size={getModusIconSize("h-4 w-4")} customClass="h-4 w-4 text-yellow-600" />;
    return <ModusWcIcon name={getModusIconName("AlertTriangle")} size={getModusIconSize("h-4 w-4")} customClass="h-4 w-4 text-red-600" />;
  };

  const getUncertaintyColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'recommendation': return <ModusWcIcon name={getModusIconName("Eye")} size={getModusIconSize("h-4 w-4")} />;
      case 'classification': return <ModusWcIcon name={getModusIconName("Brain")} size={getModusIconSize("h-4 w-4")} />;
      case 'prediction': return <ModusWcIcon name={getModusIconName("TrendingUp")} size={getModusIconSize("h-4 w-4")} />;
      default: return <ModusWcIcon name={getModusIconName("Info")} size={getModusIconSize("h-4 w-4")} />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Confidence Overview */}
      <ModusWcCard>
        <ModusWcTypography slot="title" hierarchy="h4" size="lg" weight="semibold" customClass="flex items-center gap-2">
          <ModusWcIcon name={getModusIconName("Brain")} size={getModusIconSize("h-5 w-5")} customClass="h-5 w-5 text-[var(--modus-wc-color-primary)]" />
          AI Confidence Indicators
        </ModusWcTypography>
        <div className="p-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <ModusWcIcon name={getModusIconName("CheckCircle")} size={getModusIconSize("h-6 w-6")} customClass="h-6 w-6 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-green-800">High Confidence</p>
              <p className="text-xs text-green-600">80-100%</p>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <ModusWcIcon name={getModusIconName("TrendingUp")} size={getModusIconSize("h-6 w-6")} customClass="h-6 w-6 text-yellow-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-yellow-800">Medium Confidence</p>
              <p className="text-xs text-yellow-600">60-79%</p>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <ModusWcIcon name={getModusIconName("AlertTriangle")} size={getModusIconSize("h-6 w-6")} customClass="h-6 w-6 text-red-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-red-800">Low Confidence</p>
              <p className="text-xs text-red-600">0-59%</p>
            </div>
          </div>
        </div>
      </ModusWcCard>

      {/* AI Results with Confidence */}
      <div className="space-y-4">
        {results.map((result) => (
          <ModusWcCard key={result.id}>
            <div className="p-6">
              <div className="space-y-4">
                {/* Result Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getTypeIcon(result.type)}
                      <ModusWcTypography hierarchy="h3" size="md" weight="semibold" label={result.title} />
                      <ModusWcBadge variant="outlined" color="tertiary" customClass="text-xs">
                        {result.type}
                      </ModusWcBadge>
                    </div>
                    <ModusWcTypography className="text-[var(--modus-wc-color-base-content-low-contrast)]" hierarchy="p" size="sm" label={result.content} />
                  </div>
                    
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                        {getConfidenceIcon(result.confidence)}
                        <span className={'text-lg font-bold ' + getConfidenceColor(result.confidence)}>
                          {result.confidence}%
                        </span>
                      </div>
                      <p className={'text-xs ' + getConfidenceColor(result.confidence)}>
                        {getConfidenceLabel(result.confidence)}
                      </p>
                    </div>
                  </div>

                  {/* Confidence Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Confidence Level</span>
                      <span className="text-sm text-[var(--modus-wc-color-base-content-low-contrast)]">{result.confidence}%</span>
                    </div>
                    <ModusWcProgress 
                      value={result.confidence} 
                      max={100}
                      customClass={'h-2 ' + (
                        result.confidence >= 80 ? '[&>div]:bg-green-600' :
                        result.confidence >= 60 ? '[&>div]:bg-yellow-600' : '[&>div]:bg-red-600'
                      )}
                    />
                  </div>

                  {/* Uncertainty Indicator */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Uncertainty:</span>
                      <ModusWcBadge variant="filled" color="tertiary" customClass={getUncertaintyColor(result.uncertainty.level)}>
                        {result.uncertainty.level}
                      </ModusWcBadge>
                    </div>
                    <ModusWcButton variant="borderless" color="tertiary" size="sm" title={result.uncertainty.reason}>
                      <ModusWcIcon name={getModusIconName("Info")} size={getModusIconSize("h-4 w-4")} />
                    </ModusWcButton>
                  </div>

                  {/* Contributing Factors */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Contributing Factors</h4>
                    {result.factors.map((factor, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">{factor.name}</span>
                          <span className="text-sm font-medium">{factor.impact}%</span>
                        </div>
                        <ModusWcProgress value={factor.impact} max={100} customClass="h-1" />
                        <p className="text-xs text-[var(--modus-wc-color-base-content-low-contrast)]">
                          {factor.explanation}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Confidence Explanation */}
                  <div className="bg-[var(--modus-wc-color-base-200)]/20 p-3 rounded-lg">
                    <div className="flex items-start gap-2">
                      <ModusWcIcon name={getModusIconName("Info")} size={getModusIconSize("h-4 w-4")} customClass="h-4 w-4 text-[var(--modus-wc-color-primary)] mt-0.5" />
                      <div className="text-sm text-[var(--modus-wc-color-base-content-low-contrast)]">
                        <p className="font-medium mb-1">Understanding this confidence score:</p>
                        {result.confidence >= 80 && (
                          <p>This result has high confidence based on strong data patterns and historical accuracy. You can rely on this prediction with minimal risk.</p>
                        )}
                        {result.confidence >= 60 && result.confidence < 80 && (
                          <p>This result has moderate confidence. Consider additional verification or use as a starting point for further analysis.</p>
                        )}
                        {result.confidence < 60 && (
                          <p>This result has low confidence due to limited data or high uncertainty. Use with caution and consider seeking additional information.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ModusWcCard>
          ))}
        </div>

        {/* Confidence Legend */}
        <ModusWcCard>
          <ModusWcTypography slot="title" hierarchy="h4" size="lg" weight="semibold" label="How to Interpret Confidence Scores" />
          <div className="p-4 space-y-3">
            <div className="grid gap-3">
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <ModusWcIcon name={getModusIconName("CheckCircle")} size={getModusIconSize("h-5 w-5")} customClass="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-800">High Confidence (80-100%)</p>
                  <p className="text-xs text-green-600">Strong data support, proven accuracy, minimal uncertainty</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                <ModusWcIcon name={getModusIconName("TrendingUp")} size={getModusIconSize("h-5 w-5")} customClass="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Medium Confidence (60-79%)</p>
                  <p className="text-xs text-yellow-600">Moderate data support, some uncertainty, verify if critical</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                <ModusWcIcon name={getModusIconName("AlertTriangle")} size={getModusIconSize("h-5 w-5")} customClass="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">Low Confidence (0-59%)</p>
                  <p className="text-xs text-red-600">Limited data, high uncertainty, use with caution</p>
                </div>
              </div>
            </div>
          </div>
        </ModusWcCard>
      </div>
  );
}

export default AIConfidenceIndicators;
