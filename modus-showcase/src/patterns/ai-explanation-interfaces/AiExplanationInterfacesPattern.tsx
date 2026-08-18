// @ts-nocheck
import { useState } from 'react';
import { ModusWcIcon, ModusWcCard, ModusWcBadge, ModusWcButton, ModusWcProgress, ModusWcTabs, ModusWcAccordion, ModusWcCollapse, ModusWcTypography } from '@trimble-oss/moduswebcomponents-react';

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

interface ExplanationFactor {
  name: string;
  impact: number;
  direction: 'positive' | 'negative' | 'neutral';
  explanation: string;
  evidence: string[];
}

interface AIDecision {
  id: string;
  type: 'classification' | 'recommendation' | 'prediction' | 'approval';
  result: string;
  confidence: number;
  reasoning: string;
  factors: ExplanationFactor[];
  alternatives: Array<{
    option: string;
    probability: number;
    reason: string;
  }>;
  dataPoints: Array<{
    source: string;
    relevance: number;
    description: string;
  }>;
  methodology: {
    model: string;
    approach: string;
    trainingData: string;
    lastUpdated: Date;
  };
}

export function AIExplanationInterfaces() {
  const [selectedDecision] = useState<AIDecision>({
    id: '1',
    type: 'approval',
    result: 'Loan Application Approved',
    confidence: 87,
    reasoning: 'Based on comprehensive analysis of financial history, income stability, and risk factors, this application meets approval criteria with strong indicators for successful repayment.',
    factors: [
      {
        name: 'Credit Score',
        impact: 35,
        direction: 'positive',
        explanation: 'Excellent credit score of 785 indicates responsible credit management',
        evidence: ['Payment history: 100% on-time payments', 'Credit utilization: 15%', 'Account age: 8+ years']
      },
      {
        name: 'Income Stability',
        impact: 28,
        direction: 'positive',
        explanation: 'Stable employment with consistent income growth over 3 years',
        evidence: ['Same employer for 3+ years', 'Income increased 12% annually', 'Full-time permanent position']
      },
      {
        name: 'Debt-to-Income Ratio',
        impact: 22,
        direction: 'positive',
        explanation: 'Low debt-to-income ratio of 25% indicates good financial management',
        evidence: ['Monthly income: $8,500', 'Total monthly debt: $2,125', 'Ratio well below 36% threshold']
      },
      {
        name: 'Loan Amount',
        impact: 15,
        direction: 'neutral',
        explanation: 'Requested amount is within acceptable range for income level',
        evidence: ['Loan amount: $180,000', 'Annual income: $102,000', 'Loan-to-income ratio: 1.76x']
      }
    ],
    alternatives: [
      {
        option: 'Approve with conditions',
        probability: 45,
        reason: 'Approve with slightly higher interest rate due to loan amount'
      },
      {
        option: 'Request additional documentation',
        probability: 25,
        reason: 'Verify recent job change details before final approval'
      },
      {
        option: 'Deny application',
        probability: 5,
        reason: 'Minimal risk factors do not justify denial'
      }
    ],
    dataPoints: [
      {
        source: 'Credit Bureau Report',
        relevance: 95,
        description: 'Comprehensive credit history and score analysis'
      },
      {
        source: 'Employment Verification',
        relevance: 88,
        description: 'Income and employment status confirmation'
      },
      {
        source: 'Bank Statements',
        relevance: 82,
        description: 'Financial behavior and cash flow analysis'
      },
      {
        source: 'Market Data',
        relevance: 65,
        description: 'Local housing market and economic indicators'
      }
    ],
    methodology: {
      model: 'Credit Risk Assessment Model v2.3',
      approach: 'Ensemble learning with gradient boosting',
      trainingData: '10M+ loan applications (2019-2024)',
      lastUpdated: new Date('2024-01-15')
    }
  });

  const getFactorColor = (direction: ExplanationFactor['direction']) => {
    switch (direction) {
      case 'positive':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'negative':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
  };

  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const tabs = [
    { id: 'factors', label: 'Key Factors' },
    { id: 'alternatives', label: 'Alternatives' },
    { id: 'data', label: 'Data Sources' },
    { id: 'methodology', label: 'Methodology' }
  ];

  const getFactorIcon = (direction: ExplanationFactor['direction']) => {
    switch (direction) {
      case 'positive':
        return <ModusWcIcon name={getModusIconName("CheckCircle")} size={getModusIconSize("h-4 w-4")} customClass="h-4 w-4 text-green-600" />;
      case 'negative':
        return <ModusWcIcon name={getModusIconName("AlertCircle")} size={getModusIconSize("h-4 w-4")} customClass="h-4 w-4 text-red-600" />;
      default:
        return <ModusWcIcon name={getModusIconName("Info")} size={getModusIconSize("h-4 w-4")} customClass="h-4 w-4 text-yellow-600" />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Decision Overview */}
      <ModusWcCard>
        <div slot="header" className="p-4 border-b border-[var(--modus-wc-color-base-300)]">
          <div className="flex items-center justify-between">
            <ModusWcTypography slot="title" hierarchy="h4" size="lg" weight="semibold" customClass="flex items-center gap-2">
              <ModusWcIcon name={getModusIconName("Brain")} size={getModusIconSize("h-5 w-5")} customClass="h-5 w-5 text-[var(--modus-wc-color-primary)]" />
              AI Decision Explanation
            </ModusWcTypography>
            <ModusWcBadge variant="outlined" color="tertiary" customClass="text-sm">
              Confidence: {selectedDecision.confidence}%
            </ModusWcBadge>
          </div>
        </div>
        <div className="p-4 space-y-4">
          <div className="bg-[var(--modus-wc-color-base-200)]/20 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <ModusWcIcon name={getModusIconName("CheckCircle")} size={getModusIconSize("h-5 w-5")} customClass="h-5 w-5 text-green-600" />
              <ModusWcTypography hierarchy="h3" size="lg" weight="semibold" label={selectedDecision.result} />
            </div>
            <ModusWcTypography className="text-[var(--modus-wc-color-base-content-low-contrast)]" hierarchy="p" size="sm" label={selectedDecision.reasoning} />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Confidence Level</span>
              <span className="text-sm text-[var(--modus-wc-color-base-content-low-contrast)]">{selectedDecision.confidence}%</span>
            </div>
            <ModusWcProgress value={selectedDecision.confidence} max={100} customClass="h-2" />
          </div>
        </div>
      </ModusWcCard>

      {/* Detailed Explanation Tabs */}
      <ModusWcCard bordered={true}>
        <div className="p-0">
          <ModusWcTabs
            tabs={tabs}
            activeTabIndex={activeTabIndex}
            onTabChange={(e: CustomEvent<{ previousTab: number; newTab: number }>) => setActiveTabIndex(e.detail.newTab)}
            customClass="w-full"
          />
          
          {activeTabIndex === 0 && (
            <div className="p-6 pt-4">
              <div className="space-y-4">
                <h3 className="font-medium">Contributing Factors</h3>
                {selectedDecision.factors.map((factor, index) => (
                  <div key={index} className={'p-4 rounded-lg border ' + getFactorColor(factor.direction)}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getFactorIcon(factor.direction)}
                        <span className="font-medium">{factor.name}</span>
                      </div>
                      <ModusWcBadge variant="outlined" color="tertiary" customClass="text-xs">
                        {factor.impact}% impact
                      </ModusWcBadge>
                    </div>
                    
                    <p className="text-sm mb-3">{factor.explanation}</p>
                    
                    <div className="space-y-1">
                      <p className="text-xs font-medium uppercase tracking-wide">Evidence:</p>
                      <ul className="text-xs space-y-1">
                        {factor.evidence.map((evidence, evidenceIndex) => (
                          <li key={evidenceIndex} className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-current rounded-full" />
                            {evidence}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTabIndex === 1 && (
            <div className="p-6 pt-4">
              <div className="space-y-4">
                <ModusWcTypography hierarchy="h3" size="md" weight="semibold" label="Alternative Outcomes Considered" />
                {selectedDecision.alternatives.map((alternative, index) => (
                  <ModusWcCard key={index}>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <ModusWcTypography hierarchy="h4" size="sm" weight="semibold" label={alternative.option} />
                        <ModusWcBadge variant="outlined" color="tertiary" customClass="text-xs">
                          {alternative.probability}% likelihood
                        </ModusWcBadge>
                      </div>
                      <ModusWcProgress value={alternative.probability} max={100} customClass="h-1 mb-2" />
                      <ModusWcTypography className="text-[var(--modus-wc-color-base-content-low-contrast)]" hierarchy="p" size="sm" label={alternative.reason} />
                    </div>
                  </ModusWcCard>
                ))}
              </div>
            </div>
          )}

          {activeTabIndex === 2 && (
            <div className="p-6 pt-4">
              <div className="space-y-4">
                <ModusWcTypography hierarchy="h3" size="md" weight="semibold" label="Data Sources Used" />
                {selectedDecision.dataPoints.map((dataPoint, index) => (
                  <ModusWcCard key={index}>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <ModusWcIcon name={getModusIconName("FileText")} size={getModusIconSize("h-4 w-4")} customClass="h-4 w-4 text-[var(--modus-wc-color-primary)]" />
                          <ModusWcTypography hierarchy="h4" size="sm" weight="semibold" label={dataPoint.source} />
                        </div>
                        <ModusWcBadge variant="outlined" color="tertiary" customClass="text-xs">
                          {dataPoint.relevance}% relevance
                        </ModusWcBadge>
                      </div>
                      <ModusWcProgress value={dataPoint.relevance} max={100} customClass="h-1 mb-2" />
                      <ModusWcTypography className="text-[var(--modus-wc-color-base-content-low-contrast)]" hierarchy="p" size="sm" label={dataPoint.description} />
                    </div>
                  </ModusWcCard>
                ))}
              </div>
            </div>
          )}

          {activeTabIndex === 3 && (
            <div className="p-6 pt-4">
              <div className="space-y-4">
                <ModusWcTypography hierarchy="h3" size="md" weight="semibold" label="AI Model Information" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ModusWcCard customClass="bg-[var(--modus-wc-color-base-200)]/20">
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <ModusWcIcon name={getModusIconName("Brain")} size={getModusIconSize("h-4 w-4")} customClass="h-4 w-4 text-[var(--modus-wc-color-primary)]" />
                        <ModusWcTypography hierarchy="h5" size="sm" weight="semibold" label="Model" />
                      </div>
                      <ModusWcTypography className="text-[var(--modus-wc-color-base-content-low-contrast)]" hierarchy="p" size="sm" label={selectedDecision.methodology.model} />
                    </div>
                  </ModusWcCard>
                  
                  <ModusWcCard customClass="bg-[var(--modus-wc-color-base-200)]/20">
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <ModusWcIcon name={getModusIconName("BarChart3")} size={getModusIconSize("h-4 w-4")} customClass="h-4 w-4 text-[var(--modus-wc-color-primary)]" />
                        <ModusWcTypography hierarchy="h5" size="sm" weight="semibold" label="Approach" />
                      </div>
                      <ModusWcTypography className="text-[var(--modus-wc-color-base-content-low-contrast)]" hierarchy="p" size="sm" label={selectedDecision.methodology.approach} />
                    </div>
                  </ModusWcCard>
                  
                  <ModusWcCard customClass="bg-[var(--modus-wc-color-base-200)]/20">
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <ModusWcIcon name={getModusIconName("TrendingUp")} size={getModusIconSize("h-4 w-4")} customClass="h-4 w-4 text-[var(--modus-wc-color-primary)]" />
                        <ModusWcTypography hierarchy="h5" size="sm" weight="semibold" label="Training Data" />
                      </div>
                      <ModusWcTypography className="text-[var(--modus-wc-color-base-content-low-contrast)]" hierarchy="p" size="sm" label={selectedDecision.methodology.trainingData} />
                    </div>
                  </ModusWcCard>
                  
                  <ModusWcCard customClass="bg-[var(--modus-wc-color-base-200)]/20">
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <ModusWcIcon name={getModusIconName("Eye")} size={getModusIconSize("h-4 w-4")} customClass="h-4 w-4 text-[var(--modus-wc-color-primary)]" />
                        <ModusWcTypography hierarchy="h5" size="sm" weight="semibold" label="Last Updated" />
                      </div>
                      <ModusWcTypography className="text-[var(--modus-wc-color-base-content-low-contrast)]" hierarchy="p" size="sm" label={selectedDecision.methodology.lastUpdated.toLocaleDateString()} />
                    </div>
                  </ModusWcCard>
                </div>
              </div>
            </div>
          )}
        </div>
      </ModusWcCard>

      {/* Explanation FAQ */}
      <ModusWcCard>
        <ModusWcTypography slot="title" hierarchy="h4" size="lg" weight="semibold" label="Understanding This Decision" />
        <div className="p-4">
          <ModusWcAccordion customClass="w-full">
            <ModusWcCollapse
              options={{ title: 'How was this decision made?' }}
              expanded={false}
            >
              <div slot="content">
                <p className="text-sm text-[var(--modus-wc-color-base-content-low-contrast)]">
                  The AI system analyzed multiple data points including credit history, income verification, 
                  debt ratios, and market conditions. It used a machine learning model trained on millions 
                  of similar applications to predict the likelihood of successful loan repayment.
                </p>
              </div>
            </ModusWcCollapse>
            
            <ModusWcCollapse
              options={{ title: 'What does the confidence score mean?' }}
              expanded={false}
            >
              <div slot="content">
                <p className="text-sm text-[var(--modus-wc-color-base-content-low-contrast)]">
                  The {selectedDecision.confidence}% confidence score indicates how certain the AI is about this decision. 
                  Scores above 80% generally indicate high confidence based on strong supporting evidence 
                  and clear patterns in the data.
                </p>
              </div>
            </ModusWcCollapse>
            
            <ModusWcCollapse
              options={{ title: 'Can this decision be reviewed or appealed?' }}
              expanded={false}
            >
              <div slot="content">
                <p className="text-sm text-[var(--modus-wc-color-base-content-low-contrast)]">
                  Yes, all AI decisions can be reviewed by human experts. You can request a manual review 
                  if you believe important factors were not considered or if your circumstances have 
                  recently changed.
                </p>
              </div>
            </ModusWcCollapse>
            
            <ModusWcCollapse
              options={{ title: 'How does the system prevent bias?' }}
              expanded={false}
            >
              <div slot="content">
                <p className="text-sm text-[var(--modus-wc-color-base-content-low-contrast)]">
                  The model is regularly tested for fairness across different demographic groups and 
                  is designed to focus only on relevant financial factors. Human oversight ensures 
                  decisions remain fair and comply with lending regulations.
                </p>
              </div>
            </ModusWcCollapse>
          </ModusWcAccordion>
        </div>
      </ModusWcCard>
    </div>
  );
}

export default AIExplanationInterfaces;
