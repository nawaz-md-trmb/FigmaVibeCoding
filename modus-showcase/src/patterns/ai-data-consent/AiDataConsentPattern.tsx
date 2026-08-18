// @ts-nocheck
import { useState, useEffect } from 'react';
import { ModusWcIcon, ModusWcCard, ModusWcButton, ModusWcSwitch, ModusWcBadge, ModusWcTabs, ModusWcAlert, ModusWcProgress, ModusWcDivider, ModusWcTypography } from '@trimble-oss/moduswebcomponents-react';

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

interface ConsentItem {
  id: string;
  category: 'essential' | 'personalization' | 'analytics' | 'training' | 'sharing';
  title: string;
  description: string;
  dataTypes: string[];
  purpose: string;
  retention: string;
  required: boolean;
  enabled: boolean;
  lastUpdated: Date;
  dataVolume: 'low' | 'medium' | 'high';
}

interface DataUsageStats {
  category: string;
  recordsProcessed: number;
  lastProcessed: Date;
  modelImprovements: number;
  retentionDays: number;
}

export function AIDataConsent() {
  const [consentItems, setConsentItems] = useState<ConsentItem[]>([
    {
      id: 'essential',
      category: 'essential',
      title: 'Essential AI Processing',
      description: 'Basic AI functionality required for core features to work properly.',
      dataTypes: ['Usage patterns', 'Error logs', 'Performance metrics'],
      purpose: 'Ensure AI features function correctly and safely',
      retention: '30 days',
      required: true,
      enabled: true,
      lastUpdated: new Date(Date.now() - 86400000),
      dataVolume: 'low'
    },
    {
      id: 'personalization',
      category: 'personalization',
      title: 'AI Personalization',
      description: 'Customize AI responses and recommendations based on your preferences and behavior.',
      dataTypes: ['Interaction history', 'Preferences', 'Content ratings', 'Search queries'],
      purpose: 'Provide personalized AI experiences and recommendations',
      retention: '2 years',
      required: false,
      enabled: true,
      lastUpdated: new Date(Date.now() - 172800000),
      dataVolume: 'medium'
    },
    {
      id: 'training',
      category: 'training',
      title: 'AI Model Training',
      description: 'Use your interactions to improve AI models and train new capabilities.',
      dataTypes: ['Conversation logs', 'Feedback ratings', 'Correction inputs', 'Usage patterns'],
      purpose: 'Enhance AI accuracy and develop new features',
      retention: '5 years (anonymized after 1 year)',
      required: false,
      enabled: false,
      lastUpdated: new Date(Date.now() - 259200000),
      dataVolume: 'high'
    },
    {
      id: 'analytics',
      category: 'analytics',
      title: 'AI Analytics',
      description: 'Analyze AI performance and user satisfaction to improve service quality.',
      dataTypes: ['Success rates', 'Response times', 'User satisfaction scores', 'Feature usage'],
      purpose: 'Monitor and improve AI system performance',
      retention: '3 years',
      required: false,
      enabled: true,
      lastUpdated: new Date(Date.now() - 345600000),
      dataVolume: 'medium'
    },
    {
      id: 'sharing',
      category: 'sharing',
      title: 'Research & Development',
      description: 'Share anonymized data with research partners to advance AI technology.',
      dataTypes: ['Anonymized interaction patterns', 'Aggregated usage statistics'],
      purpose: 'Contribute to AI research and industry advancement',
      retention: 'Indefinite (anonymized)',
      required: false,
      enabled: false,
      lastUpdated: new Date(Date.now() - 432000000),
      dataVolume: 'low'
    }
  ]);

  const [showDetails, setShowDetails] = useState<string | null>(null);
  const [dataExportRequested, setDataExportRequested] = useState(false);

  const usageStats: DataUsageStats[] = [
    {
      category: 'Personalization',
      recordsProcessed: 1245,
      lastProcessed: new Date(Date.now() - 3600000),
      modelImprovements: 12,
      retentionDays: 730
    },
    {
      category: 'Analytics',
      recordsProcessed: 892,
      lastProcessed: new Date(Date.now() - 7200000),
      modelImprovements: 5,
      retentionDays: 1095
    }
  ];

  const handleConsentChange = (itemId: string, enabled: boolean) => {
    setConsentItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, enabled, lastUpdated: new Date() }
          : item
      )
    );
  };

  const getCategoryIcon = (category: ConsentItem['category']) => {
    switch (category) {
      case 'essential':
        return <ModusWcIcon name={getModusIconName("Shield")} size={getModusIconSize("h-4 w-4")} customClass="h-4 w-4 text-blue-600" />;
      case 'personalization':
        return <ModusWcIcon name={getModusIconName("Brain")} size={getModusIconSize("h-4 w-4")} customClass="h-4 w-4 text-purple-600" />;
      case 'analytics':
        return <ModusWcIcon name={getModusIconName("Eye")} size={getModusIconSize("h-4 w-4")} customClass="h-4 w-4 text-green-600" />;
      case 'training':
        return <ModusWcIcon name={getModusIconName("Database")} size={getModusIconSize("h-4 w-4")} customClass="h-4 w-4 text-orange-600" />;
      case 'sharing':
        return <ModusWcIcon name={getModusIconName("Settings")} size={getModusIconSize("h-4 w-4")} customClass="h-4 w-4 text-gray-600" />;
    }
  };

  const getCategoryColor = (category: ConsentItem['category']) => {
    switch (category) {
      case 'essential':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'personalization':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'analytics':
        return 'bg-green-50 text-green-800 border-green-200';
      case 'training':
        return 'bg-orange-50 text-orange-800 border-orange-200';
      case 'sharing':
        return 'bg-gray-50 text-gray-800 border-gray-200';
    }
  };

  const getVolumeColor = (volume: ConsentItem['dataVolume']) => {
    switch (volume) {
      case 'low':
        return 'text-green-600';
      case 'medium':
        return 'text-yellow-600';
      case 'high':
        return 'text-red-600';
    }
  };

  const enabledCount = consentItems.filter(item => item.enabled).length;
  const totalCount = consentItems.length;
  const consentCompleteness = (enabledCount / totalCount) * 100;

  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const tabs = [
    { id: 'permissions', label: 'Permissions' },
    { id: 'usage', label: 'Data Usage' },
    { id: 'rights', label: 'Your Rights' },
    { id: 'export', label: 'Export Data' }
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Consent Overview */}
      <ModusWcCard>
        <div slot="header" className="p-4 border-b border-[var(--modus-wc-color-base-300)]">
          <div className="flex items-center justify-between">
            <ModusWcTypography hierarchy="h4" size="lg" weight="semibold" customClass="flex items-center gap-2">
              <ModusWcIcon name={getModusIconName("Shield")} size={getModusIconSize("h-5 w-5")} customClass="h-5 w-5 text-[var(--modus-wc-color-primary)]" />
              AI Data Consent Management
            </ModusWcTypography>
            <ModusWcBadge variant="outlined" color="tertiary" customClass="text-sm">
              Privacy Compliant
            </ModusWcBadge>
          </div>
        </div>
        <div className="p-4 space-y-4">
          <ModusWcAlert
            variant="info"
            icon="info_filled"
            alertDescription="Control how your data is used by AI systems. You can change these settings at any time. Some features may be limited if you opt out of certain data uses."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <ModusWcIcon name={getModusIconName("Shield")} size={getModusIconSize("h-4 w-4")} customClass="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Consent Status</span>
              </div>
              <div className="space-y-2">
                <ModusWcProgress value={consentCompleteness} max={100} customClass="h-2" />
                <p className="text-xs text-blue-600">{enabledCount} of {totalCount} permissions granted</p>
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <ModusWcIcon name={getModusIconName("Eye")} size={getModusIconSize("h-4 w-4")} customClass="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Transparency</span>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-green-700">Full visibility</p>
                <p className="text-xs text-green-600">All data usage is tracked and reported</p>
              </div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <ModusWcIcon name={getModusIconName("Settings")} size={getModusIconSize("h-4 w-4")} customClass="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-800">Control</span>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-purple-700">Granular settings</p>
                <p className="text-xs text-purple-600">Customize each AI data use case</p>
              </div>
            </div>
          </div>
        </div>
      </ModusWcCard>

      {/* Consent Management Tabs */}
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
                <h3 className="font-medium">AI Data Usage Permissions</h3>
                {consentItems.map((item) => (
                  <ModusWcCard key={item.id} customClass={'border-2 ' + (item.enabled ? 'border-green-200 bg-green-50/30' : 'border-gray-200')}>
                    <div className="p-4">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            {getCategoryIcon(item.category)}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <ModusWcTypography hierarchy="h4" size="lg" weight="semibold" label={item.title} />
                                {item.required && (
                                  <ModusWcBadge variant="filled" color="danger" customClass="text-xs">
                                    Required
                                  </ModusWcBadge>
                                )}
                                <ModusWcBadge variant="outlined" color="tertiary" customClass={'text-xs ' + getCategoryColor(item.category)}>
                                  {item.category}
                                </ModusWcBadge>
                              </div>
                              <p className="text-sm text-[var(--modus-wc-color-base-content-low-contrast)] mb-3">
                                {item.description}
                              </p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                <div>
                                  <span className="font-medium">Purpose:</span>
                                  <p className="text-[var(--modus-wc-color-base-content-low-contrast)]">{item.purpose}</p>
                                </div>
                                <div>
                                  <span className="font-medium">Data Retention:</span>
                                  <p className="text-[var(--modus-wc-color-base-content-low-contrast)]">{item.retention}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end gap-2">
                            <ModusWcSwitch
                              checked={item.enabled}
                              onSwitchChange={(e: CustomEvent<boolean>) => handleConsentChange(item.id, e.detail)}
                              disabled={item.required}
                            />
                            <span className={'text-xs ' + getVolumeColor(item.dataVolume)}>
                              {item.dataVolume} volume
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <ModusWcButton
                            variant="borderless"
                            color="tertiary"
                            size="sm"
                            onButtonClick={() => setShowDetails(showDetails === item.id ? null : item.id)}
                            customClass="text-xs"
                          >
                            <ModusWcIcon name={getModusIconName("Info")} size={getModusIconSize("h-4 w-4")} customClass="mr-1" />
                            {showDetails === item.id ? 'Hide Details' : 'Show Details'}
                          </ModusWcButton>
                          
                          {showDetails === item.id && (
                            <div className="bg-[var(--modus-wc-color-base-200)]/20 p-3 rounded-lg space-y-2">
                              <div>
                                <span className="text-xs font-medium">Data Types Collected:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {item.dataTypes.map((type, index) => (
                                    <ModusWcBadge key={index} variant="outlined" color="tertiary" customClass="text-xs">
                                      {type}
                                    </ModusWcBadge>
                                  ))}
                                </div>
                              </div>
                              <div className="text-xs text-[var(--modus-wc-color-base-content-low-contrast)]">
                                <span className="font-medium">Last Updated:</span> {item.lastUpdated.toLocaleDateString()}
                              </div>
                            </div>
                          )}
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
                <h3 className="font-medium">Current Data Usage</h3>
                {usageStats.map((stat, index) => (
                  <ModusWcCard key={index}>
                    <div className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm font-medium">{stat.category}</p>
                          <p className="text-xs text-[var(--modus-wc-color-base-content-low-contrast)]">Active AI category</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{stat.recordsProcessed.toLocaleString()}</p>
                          <p className="text-xs text-[var(--modus-wc-color-base-content-low-contrast)]">Records processed</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{stat.modelImprovements}</p>
                          <p className="text-xs text-[var(--modus-wc-color-base-content-low-contrast)]">Model improvements</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{stat.retentionDays} days</p>
                          <p className="text-xs text-[var(--modus-wc-color-base-content-low-contrast)]">Retention period</p>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-xs text-[var(--modus-wc-color-base-content-low-contrast)]">
                          Last processed: {stat.lastProcessed.toLocaleString()}
                        </p>
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
                <ModusWcTypography hierarchy="h3" size="md" weight="semibold" label="Your Privacy Rights" />
                <div className="grid gap-4">
                  <ModusWcCard>
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        <ModusWcIcon name={getModusIconName("Eye")} size={getModusIconSize("h-5 w-5")} customClass="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <ModusWcTypography hierarchy="h4" size="sm" weight="semibold" label="Right to Access" />
                          <ModusWcTypography className="text-[var(--modus-wc-color-base-content-low-contrast)]" hierarchy="p" size="sm" customClass="mb-3" label="View all data we have about you and how it's being used by AI systems." />
                          <ModusWcButton variant="outlined" color="tertiary" size="sm">
                            Request Data Access
                          </ModusWcButton>
                        </div>
                      </div>
                    </div>
                  </ModusWcCard>

                  <ModusWcCard>
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        <ModusWcIcon name={getModusIconName("Settings")} size={getModusIconSize("h-5 w-5")} customClass="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <ModusWcTypography hierarchy="h4" size="sm" weight="semibold" label="Right to Rectification" />
                          <ModusWcTypography className="text-[var(--modus-wc-color-base-content-low-contrast)]" hierarchy="p" size="sm" customClass="mb-3" label="Correct inaccurate data or update your information used by AI systems." />
                          <ModusWcButton variant="outlined" color="tertiary" size="sm">
                            Update Information
                          </ModusWcButton>
                        </div>
                      </div>
                    </div>
                  </ModusWcCard>

                  <ModusWcCard>
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        <ModusWcIcon name={getModusIconName("X")} size={getModusIconSize("h-5 w-5")} customClass="h-5 w-5 text-red-600 mt-0.5" />
                        <div>
                          <ModusWcTypography hierarchy="h4" size="sm" weight="semibold" label="Right to Erasure" />
                          <ModusWcTypography className="text-[var(--modus-wc-color-base-content-low-contrast)]" hierarchy="p" size="sm" customClass="mb-3" label="Request deletion of your data from AI training and processing systems." />
                          <ModusWcButton variant="outlined" color="tertiary" size="sm">
                            Request Deletion
                          </ModusWcButton>
                        </div>
                      </div>
                    </div>
                  </ModusWcCard>

                  <ModusWcCard>
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        <ModusWcIcon name={getModusIconName("AlertTriangle")} size={getModusIconSize("h-5 w-5")} customClass="h-5 w-5 text-yellow-600 mt-0.5" />
                        <div>
                          <ModusWcTypography hierarchy="h4" size="sm" weight="semibold" label="Right to Object" />
                          <ModusWcTypography className="text-[var(--modus-wc-color-base-content-low-contrast)]" hierarchy="p" size="sm" customClass="mb-3" label="Object to processing of your data for AI training or automated decision-making." />
                          <ModusWcButton variant="outlined" color="tertiary" size="sm">
                            File Objection
                          </ModusWcButton>
                        </div>
                      </div>
                    </div>
                  </ModusWcCard>
                </div>
              </div>
            </div>
          )}

          {activeTabIndex === 3 && (
            <div className="p-6 pt-4">
              <div className="space-y-4">
                <ModusWcTypography hierarchy="h3" size="md" weight="semibold" label="Export Your Data" />
                <ModusWcCard>
                  <div className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <ModusWcIcon name={getModusIconName("Download")} size={getModusIconSize("h-5 w-5")} customClass="h-5 w-5 text-[var(--modus-wc-color-primary)] mt-0.5" />
                        <div className="flex-1">
                          <ModusWcTypography hierarchy="h4" size="sm" weight="semibold" label="Download AI Data Archive" />
                          <ModusWcTypography className="text-[var(--modus-wc-color-base-content-low-contrast)]" hierarchy="p" size="sm" customClass="pb-4" label="Get a complete export of all data used by AI systems, including training data, personalization settings, and interaction history." />
                          
                          {!dataExportRequested ? (
                            <ModusWcButton 
                              onButtonClick={() => setDataExportRequested(true)}
                              customClass="w-full md:w-auto"
                            >
                              <ModusWcIcon name={getModusIconName("Download")} size={getModusIconSize("h-4 w-4")} customClass="h-4 w-4 mr-2" />
                              Request Data Export
                            </ModusWcButton>
                          ) : (
                            <ModusWcAlert
                              variant="success"
                              icon="check_circle"
                              alertDescription="Data export requested. You'll receive an email with download instructions within 30 days."
                            />
                          )}
                        </div>
                      </div>
                      
                      <div className="divider-wrapper">
                        <ModusWcDivider orientation="vertical" customClass="!m-0" />
                      </div>
                      
                      <div className="bg-[var(--modus-wc-color-base-200)]/20 p-3 rounded-lg">
                        <ModusWcTypography hierarchy="h5" size="xs" weight="semibold" label="Export Contents Include:" />
                        <ul className="text-xs text-[var(--modus-wc-color-base-content-low-contrast)] space-y-1 mt-2">
                          <li>• AI conversation history and interactions</li>
                          <li>• Personalization preferences and learned behaviors</li>
                          <li>• Training data contributions (anonymized)</li>
                          <li>• AI model feedback and ratings</li>
                          <li>• Consent history and permission changes</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </ModusWcCard>
              </div>
            </div>
          )}
        </div>
      </ModusWcCard>
    </div>
  );
}

export default AIDataConsent;
