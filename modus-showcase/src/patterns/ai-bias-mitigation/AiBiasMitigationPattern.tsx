// @ts-nocheck
import { useState, useEffect } from 'react';
import { ModusWcIcon, ModusWcCard, ModusWcButton, ModusWcBadge, ModusWcProgress, ModusWcTabs, ModusWcAlert, ModusWcTextarea, ModusWcSelect, ModusWcTypography } from '@trimble-oss/moduswebcomponents-react';

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

interface BiasMetric {
  id: string;
  name: string;
  category: 'demographic' | 'outcome' | 'representation' | 'performance';
  value: number;
  threshold: number;
  status: 'acceptable' | 'warning' | 'critical';
  trend: 'improving' | 'stable' | 'worsening';
  description: string;
  lastChecked: Date;
}

interface BiasReport {
  id: string;
  type: 'demographic_disparity' | 'outcome_bias' | 'representation_gap' | 'performance_inequality';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  affectedGroups: string[];
  reportedBy: 'system' | 'user' | 'audit';
  timestamp: Date;
  status: 'open' | 'investigating' | 'mitigated' | 'closed';
  mitigation?: string;
}

interface FairnessControl {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  effectiveness: number;
  impactAreas: string[];
}

export function AIBiasMitigation() {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const tabs = [
    { id: 'metrics', label: 'Bias Metrics' },
    { id: 'reports', label: 'Reports' },
    { id: 'controls', label: 'Mitigation' },
    { id: 'audit', label: 'Audit Trail' },
  ];
  const [reportingBias, setReportingBias] = useState(false);
  const [biasReport, setBiasReport] = useState({
    type: '',
    description: '',
    affectedGroup: ''
  });

  const biasMetrics: BiasMetric[] = [
    {
      id: 'demographic_parity',
      name: 'Demographic Parity',
      category: 'demographic',
      value: 0.89,
      threshold: 0.80,
      status: 'acceptable',
      trend: 'stable',
      description: 'Equal positive prediction rates across demographic groups',
      lastChecked: new Date(Date.now() - 3600000)
    },
    {
      id: 'equalized_odds',
      name: 'Equalized Odds',
      category: 'outcome',
      value: 0.76,
      threshold: 0.80,
      status: 'warning',
      trend: 'improving',
      description: 'Equal true positive and false positive rates across groups',
      lastChecked: new Date(Date.now() - 1800000)
    },
    {
      id: 'representation',
      name: 'Data Representation',
      category: 'representation',
      value: 0.68,
      threshold: 0.70,
      status: 'warning',
      trend: 'worsening',
      description: 'Balanced representation of different groups in training data',
      lastChecked: new Date(Date.now() - 7200000)
    },
    {
      id: 'performance_equity',
      name: 'Performance Equity',
      category: 'performance',
      value: 0.92,
      threshold: 0.85,
      status: 'acceptable',
      trend: 'improving',
      description: 'Equal model performance across demographic groups',
      lastChecked: new Date(Date.now() - 1800000)
    }
  ];

  const biasReports: BiasReport[] = [
    {
      id: 'report_1',
      type: 'outcome_bias',
      severity: 'medium',
      description: 'AI recommendations showing lower-paying job suggestions for certain demographic groups',
      affectedGroups: ['Women in Tech', 'Age 50+'],
      reportedBy: 'user',
      timestamp: new Date(Date.now() - 86400000),
      status: 'investigating'
    },
    {
      id: 'report_2',
      type: 'representation_gap',
      severity: 'high',
      description: 'Training data lacks sufficient representation of certain ethnic groups',
      affectedGroups: ['Hispanic/Latino', 'Native American'],
      reportedBy: 'audit',
      timestamp: new Date(Date.now() - 172800000),
      status: 'mitigated',
      mitigation: 'Expanded training data collection to include underrepresented groups'
    }
  ];

  const fairnessControls: FairnessControl[] = [
    {
      id: 'demographic_filtering',
      name: 'Demographic Blind Processing',
      description: 'Remove demographic indicators from AI decision inputs',
      enabled: true,
      effectiveness: 85,
      impactAreas: ['Hiring', 'Credit Scoring', 'Content Recommendations']
    },
    {
      id: 'outcome_balancing',
      name: 'Outcome Balancing',
      description: 'Adjust outputs to ensure fair outcomes across groups',
      enabled: true,
      effectiveness: 78,
      impactAreas: ['Job Matching', 'Loan Approvals', 'Healthcare Prioritization']
    },
    {
      id: 'adversarial_debiasing',
      name: 'Adversarial Debiasing',
      description: 'Use adversarial training to reduce discriminatory patterns',
      enabled: false,
      effectiveness: 72,
      impactAreas: ['Model Training', 'Feature Learning']
    }
  ];

  const getStatusColor = (status: BiasMetric['status']) => {
    switch (status) {
      case 'acceptable':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
    }
  };

  const getTrendIcon = (trend: BiasMetric['trend']) => {
    switch (trend) {
      case 'improving':
        return <ModusWcIcon name={getModusIconName("TrendingDown")} size="md" decorative />;
      case 'worsening':
        return <ModusWcIcon name={getModusIconName("TrendingDown")} size="md" decorative />;
      default:
        return <div className="rounded-full bg-gray-400" style={{ width: '12px', height: '12px' }} />;
    }
  };

  const getSeverityColor = (severity: BiasReport['severity']) => {
    switch (severity) {
      case 'low':
        return 'bg-blue-100 text-blue-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
    }
  };

  const handleBiasReport = () => {
    if (biasReport.type && biasReport.description && biasReport.affectedGroup) {
      // In a real app, this would send the report to the system
      setReportingBias(false);
      setBiasReport({ type: '', description: '', affectedGroup: '' });
      // Show success message
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Bias Overview */}
      <ModusWcCard>
        <div className="p-4 pb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ModusWcIcon name={getModusIconName("Shield")} size="md" decorative />
              <ModusWcTypography hierarchy="h4" size="md" weight="semibold" label="AI Bias Monitoring & Mitigation" />
            </div>
            <div className="flex items-center gap-2">
              <ModusWcBadge variant="outlined" customClass="text-sm">
                Fairness Score: 82%
              </ModusWcBadge>
              <ModusWcButton
                onButtonClick={() => setReportingBias(true)}
                size="sm"
                variant="outline"
              >
                <ModusWcIcon name={getModusIconName("Flag")} size="md" decorative />
                Report Bias
              </ModusWcButton>
            </div>
          </div>
        </div>
        <div className="p-4">
          <ModusWcAlert
            variant="info"
            icon="visibility"
            alertDescription="This system actively monitors for AI bias and provides tools to report and address unfair outcomes. Your feedback helps improve fairness for everyone."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <ModusWcIcon name={getModusIconName("CheckCircle")} size="sm" decorative />
                <span className="text-sm font-medium text-green-800">Active Monitoring</span>
              </div>
              <p className="text-xs text-green-600">Continuous bias detection across all AI decisions</p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <ModusWcIcon name={getModusIconName("BarChart3")} size="sm" decorative />
                <span className="text-sm font-medium text-blue-800">Fairness Metrics</span>
              </div>
              <p className="text-xs text-blue-600">Real-time tracking of bias indicators</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <ModusWcIcon name={getModusIconName("Person")} size="sm" decorative />
                <span className="text-sm font-medium text-purple-800">Community Reporting</span>
              </div>
              <p className="text-xs text-purple-600">User-driven bias identification and feedback</p>
            </div>
          </div>
        </div>
      </ModusWcCard>

      {/* Bias Management Tabs */}
      <ModusWcCard bordered={true}>
        <div className="p-4">
          <ModusWcTabs
            tabs={tabs}
            activeTabIndex={activeTabIndex}
            onTabChange={(e: CustomEvent<{ previousTab: number; newTab: number }>) => setActiveTabIndex(e.detail.newTab)}
            customClass="w-full"
          />

            {activeTabIndex === 0 && (
            <div className="p-6 pt-4">
              <div className="space-y-4">
                <h3 className="font-medium">Fairness Metrics Dashboard</h3>
                {biasMetrics.map((metric) => (
                  <ModusWcCard key={metric.id}>
                    <div className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <ModusWcIcon name={getModusIconName("BarChart3")} size="sm" decorative />
                            <div>
                              <h4 className="font-medium">{metric.name}</h4>
                              <p className="text-xs text-[var(--modus-wc-color-base-content-low-contrast)]">{metric.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getTrendIcon(metric.trend)}
                            <ModusWcBadge customClass={'text-xs ' + getStatusColor(metric.status)}>
                              {metric.status}
                            </ModusWcBadge>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-sm">
                            <span>Score: {(metric.value * 100).toFixed(0)}%</span>
                            <span className="text-[var(--modus-wc-color-base-content-low-contrast)]">
                              Threshold: {(metric.threshold * 100).toFixed(0)}%
                            </span>
                          </div>
                          <ModusWcProgress 
                            value={metric.value * 100} 
                            max={100}
                            customClass={'h-2 ' + (
                              metric.status === 'acceptable' ? '[&>div]:bg-green-600' :
                              metric.status === 'warning' ? '[&>div]:bg-yellow-600' :
                              '[&>div]:bg-red-600'
                            )}
                          />
                        </div>
                        
                        <div className="text-xs text-[var(--modus-wc-color-base-content-low-contrast)] pt-2 border-t">
                          Last checked: {metric.lastChecked.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </ModusWcCard>
                ))}
              </div>
            </div>
            )}

            {activeTabIndex === 1 && (
            <div className="p-6 pt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Bias Reports</h3>
                  <ModusWcButton
                    onButtonClick={() => setReportingBias(true)}
                    size="sm"
                  >
                    <ModusWcIcon name={getModusIconName("Flag")} size="md" decorative />
                    Report New Issue
                  </ModusWcButton>
                </div>
                
                {biasReports.map((report) => (
                  <ModusWcCard key={report.id}>
                    <div className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <ModusWcIcon name={getModusIconName("AlertTriangle")} size={getModusIconSize("h-4 w-4")} customClass="h-4 w-4 text-orange-600" />
                              <ModusWcBadge customClass={'text-xs ' + getSeverityColor(report.severity)}>
                                {report.severity} severity
                              </ModusWcBadge>
                              <ModusWcBadge variant="outlined" customClass="text-xs">
                                {report.status}
                              </ModusWcBadge>
                            </div>
                            <p className="text-sm mb-2">{report.description}</p>
                            <div className="flex flex-wrap gap-1">
                              {report.affectedGroups.map((group, index) => (
                                <ModusWcBadge key={index} variant="filled" customClass="text-xs">
                                  {group}
                                </ModusWcBadge>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        {report.mitigation && (
                          <div className="bg-green-50 p-3 rounded-lg">
                            <div className="flex items-start gap-2">
                              <ModusWcIcon name={getModusIconName("CheckCircle")} size="sm" decorative />
                              <div>
                                <p className="text-xs font-medium text-green-800 mb-1">Mitigation Applied:</p>
                                <p className="text-xs text-green-700">{report.mitigation}</p>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        <div className="text-xs text-[var(--modus-wc-color-base-content-low-contrast)] pt-2 border-t">
                          Reported by {report.reportedBy} • {report.timestamp.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </ModusWcCard>
                ))}
              </div>
            </div>
            )}

            {activeTabIndex === 2 && (
            <div className="p-6 pt-4">
              <div className="space-y-4">
                <h3 className="font-medium">Bias Mitigation Controls</h3>
                {fairnessControls.map((control) => (
                  <ModusWcCard key={control.id}>
                    <div className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {control.enabled ? (
                                <ModusWcIcon name={getModusIconName("CheckCircle")} size="sm" decorative />
                              ) : (
                                <ModusWcIcon name={getModusIconName("XCircle")} size="sm" decorative />
                              )}
                              <h4 className="font-medium">{control.name}</h4>
                              <ModusWcBadge variant={control.enabled ? 'filled' : 'outlined'} customClass="text-xs">
                                {control.enabled ? 'Active' : 'Inactive'}
                              </ModusWcBadge>
                            </div>
                            <p className="text-sm text-[var(--modus-wc-color-base-content-low-contrast)] mb-3">
                              {control.description}
                            </p>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center text-sm">
                                <span>Effectiveness:</span>
                                <span className="font-medium">{control.effectiveness}%</span>
                              </div>
                              <ModusWcProgress value={control.effectiveness} max={100} customClass="h-2" />
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-[var(--modus-wc-color-base-200)]/20 p-3 rounded-lg">
                          <p className="text-xs font-medium mb-2">Impact Areas:</p>
                          <div className="flex flex-wrap gap-1">
                            {control.impactAreas.map((area, index) => (
                              <ModusWcBadge key={index} variant="outlined" customClass="text-xs">
                                {area}
                              </ModusWcBadge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </ModusWcCard>
                ))}
              </div>
            </div>
            )}

            {activeTabIndex === 3 && (
            <div className="p-6 pt-4">
              <div className="space-y-4">
                <h3 className="font-medium">Bias Audit Trail</h3>
                <ModusWcCard>
                  <div className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <ModusWcIcon name={getModusIconName("BarChart3")} size="sm" decorative />
                        <span className="text-sm font-medium">Daily Bias Assessment</span>
                        <ModusWcBadge variant="outlined" customClass="text-xs">Automated</ModusWcBadge>
                      </div>
                      <p className="text-xs text-[var(--modus-wc-color-base-content-low-contrast)]">
                        System automatically evaluates bias metrics daily and generates reports
                      </p>
                      <div className="text-xs text-[var(--modus-wc-color-base-content-low-contrast)]">
                        Last audit: {new Date().toLocaleDateString()} • Next audit: Tomorrow
                      </div>
                    </div>
                  </div>
                </ModusWcCard>
                
                <ModusWcCard>
                  <div className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <ModusWcIcon name={getModusIconName("Person")} size="sm" decorative />
                        <span className="text-sm font-medium">External Fairness Review</span>
                        <ModusWcBadge variant="outlined" customClass="text-xs">Quarterly</ModusWcBadge>
                      </div>
                      <p className="text-xs text-[var(--modus-wc-color-base-content-low-contrast)]">
                        Independent third-party assessment of AI fairness and bias mitigation effectiveness
                      </p>
                      <div className="text-xs text-[var(--modus-wc-color-base-content-low-contrast)]">
                        Last review: Q4 2023 • Next review: Q1 2024
                      </div>
                    </div>
                  </div>
                </ModusWcCard>
              </div>
            </div>
            )}
        </div>
      </ModusWcCard>

      {/* Bias Reporting Modal */}
      {reportingBias && (
        <ModusWcCard className="fixed inset-4 z-50 bg-[var(--modus-wc-color-base-page)] border-2 border-[var(--modus-wc-color-base-300)] shadow-lg">
          <div className="p-4 pb-0">
            <div className="flex items-center justify-between">
              <ModusWcTypography hierarchy="h4" size="md" weight="semibold" label="Report AI Bias" />
              <ModusWcButton
                variant="borderless"
                size="sm"
                onButtonClick={() => setReportingBias(false)}
              >
                <ModusWcIcon name={getModusIconName("XCircle")} size="sm" decorative />
              </ModusWcButton>
            </div>
          </div>
          <div className="p-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Type of Bias</label>
              <ModusWcSelect
                value={biasReport.type}
                options={[
                  { label: 'Demographic Disparity', value: 'demographic_disparity' },
                  { label: 'Outcome Bias', value: 'outcome_bias' },
                  { label: 'Representation Gap', value: 'representation_gap' },
                  { label: 'Performance Inequality', value: 'performance_inequality' }
                ]}
                onInputChange={(e) => {
                  const value = e.detail?.target?.value || '';
                  setBiasReport(prev => ({ ...prev, type: value }));
                }}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <ModusWcTextarea
                value={biasReport.description}
                onInputChange={(e: CustomEvent) => setBiasReport(prev => ({ ...prev, description: e.detail?.target?.value || '' }))}
                placeholder="Describe the biased behavior you observed..."
                customClass="min-h-[100px]"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Affected Group</label>
              <input
                type="text"
                value={biasReport.affectedGroup}
                onChange={(e) => setBiasReport(prev => ({ ...prev, affectedGroup: e.target.value }))}
                placeholder="Which group was affected?"
                className="w-full p-2 border border-[var(--modus-wc-color-base-300)] rounded"
              />
            </div>
            
            <div className="flex gap-2 pt-4">
              <ModusWcButton 
                onButtonClick={handleBiasReport}
                disabled={!biasReport.type || !biasReport.description || !biasReport.affectedGroup}
              >
                Submit Report
              </ModusWcButton>
              <ModusWcButton variant="outline" onButtonClick={() => setReportingBias(false)}>
                Cancel
              </ModusWcButton>
            </div>
          </div>
        </ModusWcCard>
      )}
    </div>
  );
}

export default AIBiasMitigation;
