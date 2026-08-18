// @ts-nocheck
import { useState, useEffect } from 'react';
import { ModusWcIcon, ModusWcCard, ModusWcButton, ModusWcBadge, ModusWcSwitch, ModusWcSlider, ModusWcProgress, ModusWcTabs, ModusWcTypography } from '@trimble-oss/moduswebcomponents-react';

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

interface UserPreference {
  id: string;
  category: string;
  name: string;
  value: number;
  learningSource: 'explicit' | 'implicit' | 'inferred';
  confidence: number;
  lastUpdated: Date;
}

interface PersonalizationInsight {
  id: string;
  type: 'behavior' | 'preference' | 'trend' | 'recommendation';
  title: string;
  description: string;
  impact: number;
  evidence: string[];
}

interface PersonalizedContent {
  id: string;
  title: string;
  type: 'article' | 'product' | 'course' | 'video';
  relevanceScore: number;
  personalizedReason: string;
  interactionHistory: Array<{
    action: string;
    timestamp: Date;
  }>;
}

export function AIPersonalization() {
  const [learningEnabled, setLearningEnabled] = useState(true);
  const [privacyLevel, setPrivacyLevel] = useState([60]);
  const [selectedCategory, setSelectedCategory] = useState('content');
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const tabs = [
    { id: 'preferences', label: 'Preferences' },
    { id: 'insights', label: 'Insights' },
    { id: 'content', label: 'Personalized' },
    { id: 'controls', label: 'Controls' },
  ];
  
  const userPreferences: UserPreference[] = [
    {
      id: 'p1',
      category: 'content',
      name: 'Technology Articles',
      value: 85,
      learningSource: 'implicit',
      confidence: 92,
      lastUpdated: new Date(Date.now() - 86400000)
    },
    {
      id: 'p2',
      category: 'content',
      name: 'Design Topics',
      value: 78,
      learningSource: 'explicit',
      confidence: 100,
      lastUpdated: new Date(Date.now() - 172800000)
    },
    {
      id: 'p3',
      category: 'interface',
      name: 'Dark Mode Preference',
      value: 95,
      learningSource: 'explicit',
      confidence: 100,
      lastUpdated: new Date(Date.now() - 604800000)
    },
    {
      id: 'p4',
      category: 'behavior',
      name: 'Reading Time Preference',
      value: 70,
      learningSource: 'inferred',
      confidence: 76,
      lastUpdated: new Date(Date.now() - 259200000)
    }
  ];

  const personalizationInsights: PersonalizationInsight[] = [
    {
      id: 'i1',
      type: 'behavior',
      title: 'Peak Activity Hours',
      description: "You're most active between 9-11 AM and 2-4 PM",
      impact: 15,
      evidence: ['Engagement 40% higher during these hours', 'Completion rates increase by 25%']
    },
    {
      id: 'i2',
      type: 'preference',
      title: 'Content Length Preference',
      description: 'You prefer medium-length articles (5-10 min read)',
      impact: 23,
      evidence: ['Higher completion rate on medium articles', 'Bookmark rate 3x higher']
    },
    {
      id: 'i3',
      type: 'trend',
      title: 'Emerging Interest',
      description: 'Growing interest in AI and machine learning content',
      impact: 18,
      evidence: ['30% increase in AI-related interactions', 'Time spent up 45% on ML articles']
    }
  ];

  const personalizedContent: PersonalizedContent[] = [
    {
      id: 'c1',
      title: 'Advanced React Patterns for 2024',
      type: 'article',
      relevanceScore: 94,
      personalizedReason: 'Based on your React expertise and recent frontend interest',
      interactionHistory: [
        { action: 'viewed', timestamp: new Date(Date.now() - 3600000) },
        { action: 'bookmarked', timestamp: new Date(Date.now() - 1800000) }
      ]
    },
    {
      id: 'c2',
      title: 'Design Systems Workshop',
      type: 'course',
      relevanceScore: 87,
      personalizedReason: 'Matches your design background and learning preferences',
      interactionHistory: [
        { action: 'enrolled', timestamp: new Date(Date.now() - 86400000) }
      ]
    },
    {
      id: 'c3',
      title: 'AI-Powered Development Tools',
      type: 'video',
      relevanceScore: 91,
      personalizedReason: 'Trending topic aligned with your tech interests',
      interactionHistory: []
    }
  ];

  const getSourceIcon = (source: UserPreference['learningSource']) => {
    switch (source) {
      case 'explicit':
        return <ModusWcIcon name={getModusIconName("Person")} size="md" decorative />;
      case 'implicit':
        return <ModusWcIcon name={getModusIconName("Eye")} size="md" decorative />;
      case 'inferred':
        return <ModusWcIcon name={getModusIconName("Brain")} size="md" decorative />;
    }
  };

  const getSourceLabel = (source: UserPreference['learningSource']) => {
    switch (source) {
      case 'explicit':
        return 'You told us';
      case 'implicit':
        return 'From your actions';
      case 'inferred':
        return 'AI inferred';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTypeIcon = (type: PersonalizationInsight['type']) => {
    switch (type) {
      case 'behavior':
        return <ModusWcIcon name={getModusIconName("Clock")} size="sm" decorative />;
      case 'preference':
        return <ModusWcIcon name={getModusIconName("Star")} size="sm" decorative />;
      case 'trend':
        return <ModusWcIcon name={getModusIconName("TrendingUp")} size="sm" decorative />;
      case 'recommendation':
        return <ModusWcIcon name={getModusIconName("Target")} size="sm" decorative />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Personalization Overview */}
      <ModusWcCard>
        <div className="p-4 pb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ModusWcIcon name={getModusIconName("Brain")} size="md" decorative />
              <ModusWcTypography hierarchy="h4" size="md" weight="semibold" label="AI Personalization" />
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <ModusWcIcon name={getModusIconName("Zap")} size="sm" decorative />
                <span className="text-sm font-medium">Learning Active</span>
              </div>
              <ModusWcSwitch
                checked={learningEnabled}
                onSwitchChange={(e: CustomEvent<boolean>) => setLearningEnabled(e.detail)}
              />
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <ModusWcIcon name={getModusIconName("Person")} size="sm" decorative />
                <span className="text-sm font-medium text-blue-800">Profile Strength</span>
              </div>
              <div className="space-y-2">
                <ModusWcProgress value={78} max={100} customClass="h-2" />
                <p className="text-xs text-blue-600">78% complete • Good personalization</p>
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <ModusWcIcon name={getModusIconName("TrendingUp")} size="sm" decorative />
                <span className="text-sm font-medium text-green-800">Accuracy</span>
              </div>
              <div className="space-y-2">
                <ModusWcProgress value={85} max={100} customClass="h-2" />
                <p className="text-xs text-green-600">85% recommendation accuracy</p>
              </div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <ModusWcIcon name={getModusIconName("Brain")} size="sm" decorative />
                <span className="text-sm font-medium text-purple-800">Learning Rate</span>
              </div>
              <div className="space-y-2">
                <ModusWcProgress value={92} max={100} customClass="h-2" />
                <p className="text-xs text-purple-600">Actively improving</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Privacy Level</span>
              <span className="text-sm text-[var(--modus-wc-color-base-content-low-contrast)]">{privacyLevel[0]}%</span>
            </div>
            <ModusWcSlider
              value={privacyLevel[0]}
              onInputChange={(e) => {
                const value = Number(e.detail?.target?.value) || 0;
                setPrivacyLevel([value]);
              }}
              max={100}
              step={10}
              customClass="w-full"
            />
            <p className="text-xs text-[var(--modus-wc-color-base-content-low-contrast)]">
              Higher values limit data collection but may reduce personalization quality
            </p>
          </div>
        </div>
      </ModusWcCard>

      {/* Personalization Details */}
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
                <div className="flex gap-2 pb-4">
                  {['content', 'interface', 'behavior'].map((category) => (
                    <ModusWcButton
                      key={category}
                      variant={selectedCategory === category ? 'solid' : 'outline'}
                      size="sm"
                      onButtonClick={() => setSelectedCategory(category)}
                      customClass="capitalize"
                    >
                      {category}
                    </ModusWcButton>
                  ))}
                </div>

                <div className="space-y-3">
                  {userPreferences
                    .filter(pref => pref.category === selectedCategory)
                    .map((preference) => (
                    <ModusWcCard key={preference.id} className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {getSourceIcon(preference.learningSource)}
                            <div>
                              <p className="font-medium">{preference.name}</p>
                              <p className="text-xs text-[var(--modus-wc-color-base-content-low-contrast)]">
                                {getSourceLabel(preference.learningSource)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-medium">{preference.value}%</p>
                            <p className={'text-xs ' + getConfidenceColor(preference.confidence)}>
                              {preference.confidence}% confident
                            </p>
                          </div>
                        </div>
                        
                        <ModusWcProgress value={preference.value} max={100} customClass="h-2" />
                        
                        <div className="flex justify-between items-center text-xs text-[var(--modus-wc-color-base-content-low-contrast)]">
                          <span>Last updated: {preference.lastUpdated.toLocaleDateString()}</span>
                          <ModusWcButton variant="borderless" size="sm">
                            Adjust
                          </ModusWcButton>
                        </div>
                      </div>
                    </ModusWcCard>
                  ))}
                </div>
              </div>
            </div>
            )}

            {activeTabIndex === 1 && (
            <div className="p-6 pt-4">
              <div className="space-y-4">
                <h3 className="font-medium">AI Learning Insights</h3>
                {personalizationInsights.map((insight) => (
                  <ModusWcCard key={insight.id} className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          {getTypeIcon(insight.type)}
                          <div>
                            <p className="font-medium">{insight.title}</p>
                            <p className="text-sm text-[var(--modus-wc-color-base-content-low-contrast)]">
                              {insight.description}
                            </p>
                          </div>
                        </div>
                        <ModusWcBadge variant="outlined" customClass="text-xs">
                          +{insight.impact}% impact
                        </ModusWcBadge>
                      </div>
                      
                      <div className="bg-[var(--modus-wc-color-base-200)]/20 p-3 rounded-lg">
                        <p className="text-xs font-medium mb-2">Evidence:</p>
                        <ul className="text-xs space-y-1">
                          {insight.evidence.map((evidence, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <div className="w-1 h-1 bg-current rounded-full" />
                              {evidence}
                            </li>
                          ))}
                        </ul>
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
                <h3 className="font-medium">Personalized for You</h3>
                {personalizedContent.map((content) => (
                  <ModusWcCard key={content.id} className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{content.title}</p>
                          <p className="text-sm text-[var(--modus-wc-color-base-content-low-contrast)]">
                            {content.personalizedReason}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 mb-1">
                            <ModusWcIcon name={getModusIconName("Target")} size="md" decorative />
                            <span className="text-sm font-medium">{content.relevanceScore}%</span>
                          </div>
                          <ModusWcBadge variant="outlined" customClass="text-xs capitalize">
                            {content.type}
                          </ModusWcBadge>
                        </div>
                      </div>
                      
                      {content.interactionHistory.length > 0 && (
                        <div className="bg-[var(--modus-wc-color-base-200)]/20 p-2 rounded text-xs">
                          <p className="font-medium mb-1">Your activity:</p>
                          {content.interactionHistory.slice(0, 2).map((interaction, index) => (
                            <p key={index} className="text-[var(--modus-wc-color-base-content-low-contrast)]">
                              {interaction.action} • {interaction.timestamp.toLocaleDateString()}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </ModusWcCard>
                ))}
              </div>
            </div>
            )}

            {activeTabIndex === 3 && (
            <div className="p-6 pt-4">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Personalization Settings</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Content Recommendations</p>
                        <p className="text-sm text-[var(--modus-wc-color-base-content-low-contrast)]">
                          Show personalized content suggestions
                        </p>
                      </div>
                      <ModusWcSwitch checked />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Behavioral Learning</p>
                        <p className="text-sm text-[var(--modus-wc-color-base-content-low-contrast)]">
                          Learn from your browsing and interaction patterns
                        </p>
                      </div>
                      <ModusWcSwitch checked />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Interface Adaptation</p>
                        <p className="text-sm text-[var(--modus-wc-color-base-content-low-contrast)]">
                          Automatically adjust interface based on preferences
                        </p>
                      </div>
                      <ModusWcSwitch checked />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Cross-Device Sync</p>
                        <p className="text-sm text-[var(--modus-wc-color-base-content-low-contrast)]">
                          Sync personalization across all your devices
                        </p>
                      </div>
                      <ModusWcSwitch />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex gap-3">
                    <ModusWcButton variant="outline" size="sm">
                      <ModusWcIcon name={getModusIconName("Settings")} size="md" decorative />
                      Advanced Settings
                    </ModusWcButton>
                    <ModusWcButton variant="outline" size="sm">
                      Export Data
                    </ModusWcButton>
                    <ModusWcButton color="danger" size="sm">
                      Reset Profile
                    </ModusWcButton>
                  </div>
                </div>
              </div>
            </div>
            )}
        </div>
      </ModusWcCard>
    </div>
  );
}

export default AIPersonalization;
