// @ts-nocheck
import { useState, useEffect } from 'react';
import { ModusWcIcon, ModusWcCard, ModusWcButton, ModusWcBadge, ModusWcProgress, ModusWcTextarea, ModusWcAvatar, ModusWcTabs, ModusWcTypography } from '@trimble-oss/moduswebcomponents-react';

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

interface HandoffContext {
  sessionId: string;
  userQuery: string;
  aiAttempts: Array<{
    timestamp: Date;
    response: string;
    confidence: number;
    successful: boolean;
  }>;
  userFeedback: Array<{
    rating: number;
    comment: string;
    timestamp: Date;
  }>;
  escalationReason: 'low_confidence' | 'user_request' | 'complexity' | 'error' | 'policy';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  userContext: {
    accountType: string;
    previousInteractions: number;
    preferredLanguage: string;
  };
}

interface HumanAgent {
  id: string;
  name: string;
  specialization: string[];
  availability: 'available' | 'busy' | 'offline';
  averageRating: number;
  estimatedResponseTime: number;
}

export function AIHumanHandoff() {
  const [handoffStage, setHandoffStage] = useState<'ai_active' | 'escalation_triggered' | 'finding_agent' | 'handoff_complete' | 'collaborative'>('ai_active');
  const [progress, setProgress] = useState(0);
  const [selectedAgent, setSelectedAgent] = useState<HumanAgent | null>(null);
  const [handoffNote, setHandoffNote] = useState('');
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const contextTabs = [
    { id: 'conversation', label: 'Conversation' },
    { id: 'context', label: 'User Context' },
    { id: 'notes', label: 'Handoff Notes' },
  ];

  const mockContext: HandoffContext = {
    sessionId: 'sess_12345',
    userQuery: 'I need help with a complex billing issue involving multiple accounts and international charges.',
    aiAttempts: [
      {
        timestamp: new Date(Date.now() - 300000),
        response: 'I can help with billing questions. Let me look up your account information.',
        confidence: 85,
        successful: false
      },
      {
        timestamp: new Date(Date.now() - 120000),
        response: 'I see multiple accounts, but the international charges require specialized review.',
        confidence: 45,
        successful: false
      }
    ],
    userFeedback: [
      {
        rating: 2,
        comment: "The AI couldn't understand my complex billing situation",
        timestamp: new Date(Date.now() - 60000)
      }
    ],
    escalationReason: 'complexity',
    urgency: 'medium',
    userContext: {
      accountType: 'Premium',
      previousInteractions: 12,
      preferredLanguage: 'English'
    }
  };

  const availableAgents: HumanAgent[] = [
    {
      id: 'agent_1',
      name: 'Sarah Chen',
      specialization: ['Billing', 'International Services', 'Account Management'],
      availability: 'available',
      averageRating: 4.8,
      estimatedResponseTime: 2
    },
    {
      id: 'agent_2',
      name: 'Michael Rodriguez',
      specialization: ['Technical Support', 'Billing', 'Premium Accounts'],
      availability: 'busy',
      averageRating: 4.6,
      estimatedResponseTime: 8
    },
    {
      id: 'agent_3',
      name: 'Emma Thompson',
      specialization: ['Billing', 'Dispute Resolution', 'Complex Cases'],
      availability: 'available',
      averageRating: 4.9,
      estimatedResponseTime: 3
    }
  ];

  useEffect(() => {
    if (handoffStage === 'escalation_triggered') {
      const timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setHandoffStage('finding_agent');
            return 100;
          }
          return prev + 10;
        });
      }, 200);
      
      return () => clearInterval(timer);
    }
  }, [handoffStage]);

  const triggerEscalation = () => {
    setHandoffStage('escalation_triggered');
    setProgress(0);
  };

  const selectAgent = (agent: HumanAgent) => {
    setSelectedAgent(agent);
    setHandoffStage('handoff_complete');
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available':
        return 'text-green-600';
      case 'busy':
        return 'text-yellow-600';
      default:
        return 'text-red-600';
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Handoff Status */}
      <ModusWcCard bordered={true}>
        <div className="p-4 pb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ModusWcIcon name={getModusIconName("ArrowRight")} size="md" decorative />
              <ModusWcTypography hierarchy="h4" size="md" weight="semibold" label="AI to Human Handoff" />
            </div>
            <ModusWcBadge customClass={getUrgencyColor(mockContext.urgency)}>
              {mockContext.urgency} priority
            </ModusWcBadge>
          </div>
        </div>
        <div className="p-4">
          {/* Progress Indicator */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Handoff Progress</span>
              <span className="text-sm text-[var(--modus-wc-color-base-content-low-contrast)]">
                {handoffStage === 'ai_active' && 'AI Assistance Active'}
                {handoffStage === 'escalation_triggered' && 'Escalating to Human'}
                {handoffStage === 'finding_agent' && 'Finding Best Agent'}
                {handoffStage === 'handoff_complete' && 'Connected to Human Agent'}
                {handoffStage === 'collaborative' && 'Collaborative Session'}
              </span>
            </div>
            <ModusWcProgress 
              value={
                handoffStage === 'ai_active' ? 0 :
                handoffStage === 'escalation_triggered' ? progress :
                handoffStage === 'finding_agent' ? 100 :
                100
              } 
              max={100}
              customClass="h-2"
            />
          </div>

          {/* Stage-specific Content */}
          {handoffStage === 'ai_active' && (
            <div className="bg-[var(--modus-wc-color-base-200)]/20 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <ModusWcIcon name={getModusIconName("Bot")} size="md" decorative />
                <span className="font-medium">AI Assistant Active</span>
              </div>
              <p className="text-sm text-[var(--modus-wc-color-base-content-low-contrast)] mb-3">
                Currently helping with your request. If you need human assistance, I can connect you with a specialist.
              </p>
              <ModusWcButton onButtonClick={triggerEscalation} size="sm">
                <ModusWcIcon name={getModusIconName("Person")} size="md" decorative />
                Connect to Human Agent
              </ModusWcButton>
            </div>
          )}

          {handoffStage === 'escalation_triggered' && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <ModusWcIcon name={getModusIconName("Clock")} size="md" decorative />
                <span className="font-medium text-blue-800">Preparing Handoff</span>
              </div>
              <p className="text-sm text-blue-600">
                Transferring your conversation context and finding the best available agent...
              </p>
            </div>
          )}

          {handoffStage === 'finding_agent' && (
            <div className="space-y-4">
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <ModusWcIcon name={getModusIconName("Person")} size="md" decorative customClass="text-yellow-600" />
                  <span className="font-medium text-yellow-800">Selecting Agent</span>
                </div>
                <p className="text-sm text-yellow-600">
                  Finding an agent with expertise in {mockContext.escalationReason === 'complexity' ? 'complex billing issues' : 'your request type'}...
                </p>
              </div>

              <div className="grid gap-3">
                <h4 className="font-medium">Available Specialists</h4>
                {availableAgents.map((agent) => (
                  <ModusWcCard key={agent.id} className="cursor-pointer hover:bg-[var(--modus-wc-color-base-200)]/20" onClick={() => selectAgent(agent)}>
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <ModusWcAvatar initials={agent.name.split(' ').map(n => n[0]).join('')} size="md" />
                          <div>
                            <p className="font-medium">{agent.name}</p>
                            <div className="flex items-center gap-2">
                              <span className={'text-xs ' + getAvailabilityColor(agent.availability)}>
                                {agent.availability}
                              </span>
                              <span className="text-xs text-[var(--modus-wc-color-base-content-low-contrast)]">
                                ~{agent.estimatedResponseTime} min
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 mb-1">
                            <ModusWcIcon name={getModusIconName("Star")} size="md" decorative />
                            <span className="text-xs">{agent.averageRating}</span>
                          </div>
                          <div className="flex gap-1">
                            {agent.specialization.slice(0, 2).map((spec, index) => (
                              <ModusWcBadge key={index} variant="outlined" customClass="text-xs">
                                {spec}
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

          {handoffStage === 'handoff_complete' && selectedAgent && (
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <ModusWcIcon name={getModusIconName("CheckCircle")} size="md" decorative />
                <span className="font-medium text-green-800">Connected to {selectedAgent.name}</span>
              </div>
              <p className="text-sm text-green-600 mb-3">
                Your conversation has been transferred along with full context. {selectedAgent.name} will respond shortly.
              </p>
              <ModusWcButton size="sm" onButtonClick={() => setHandoffStage('collaborative')}>
                <ModusWcIcon name={getModusIconName("MessageSquare")} size="md" decorative />
                Start Conversation
              </ModusWcButton>
            </div>
          )}
        </div>
      </ModusWcCard>

      {/* Context Transfer Details */}
      <ModusWcCard>
        <div className="p-4 pb-0">
          <ModusWcTypography hierarchy="h4" size="md" weight="semibold" label="Handoff Context" />
        </div>
        <div className="p-4">
          <ModusWcTabs
            tabs={contextTabs}
            activeTabIndex={activeTabIndex}
            onTabChange={(e: CustomEvent<{ previousTab: number; newTab: number }>) => setActiveTabIndex(e.detail.newTab)}
            customClass="w-full"
          />

            {activeTabIndex === 0 && (
            <div className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-medium">Original Query</h4>
                <div className="bg-[var(--modus-wc-color-base-200)]/20 p-3 rounded-lg">
                  <p className="text-sm">{mockContext.userQuery}</p>
                </div>
                
                <h4 className="font-medium">AI Attempts</h4>
                {mockContext.aiAttempts.map((attempt, index) => (
                  <div key={index} className="border-l-4 border-blue-200 pl-4 py-2">
                    <div className="flex items-center gap-2 mb-1">
                      <ModusWcIcon name={getModusIconName("Bot")} size="sm" decorative customClass="text-blue-600" />
                      <span className="text-xs text-[var(--modus-wc-color-base-content-low-contrast)]">
                        {attempt.timestamp.toLocaleTimeString()}
                      </span>
                      <ModusWcBadge variant="outlined" customClass="text-xs">
                        {attempt.confidence}% confident
                      </ModusWcBadge>
                    </div>
                    <p className="text-sm">{attempt.response}</p>
                  </div>
                ))}
              </div>
            </div>
            )}

            {activeTabIndex === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium">User Information</h4>
                  <div className="bg-[var(--modus-wc-color-base-200)]/20 p-3 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Account Type:</span>
                      <ModusWcBadge variant="filled" color="tertiary">{mockContext.userContext.accountType}</ModusWcBadge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Previous Interactions:</span>
                      <span className="text-sm">{mockContext.userContext.previousInteractions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Language:</span>
                      <span className="text-sm">{mockContext.userContext.preferredLanguage}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium">Escalation Details</h4>
                  <div className="bg-[var(--modus-wc-color-base-200)]/20 p-3 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Reason:</span>
                      <ModusWcBadge variant="outlined">{mockContext.escalationReason}</ModusWcBadge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Urgency:</span>
                      <ModusWcBadge customClass={getUrgencyColor(mockContext.urgency)}>
                        {mockContext.urgency}
                      </ModusWcBadge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Session ID:</span>
                      <span className="text-xs font-mono">{mockContext.sessionId}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            )}

            {activeTabIndex === 2 && (
            <div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Handoff Notes for Agent
                  </label>
                  <ModusWcTextarea
                    value={handoffNote}
                    onInputChange={(e: CustomEvent) => setHandoffNote(e.detail?.target?.value || '')}
                    placeholder="Add any additional context or specific requests for the human agent..."
                    customClass="min-h-[100px]"
                  />
                </div>
                
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-start gap-2">
                    <ModusWcIcon name={getModusIconName("FileText")} size="sm" decorative />
                    <div className="text-sm text-blue-700">
                      <p className="font-medium mb-1">AI Assessment Summary</p>
                      <p>
                        The user has a complex billing inquiry involving multiple accounts and international charges. 
                        AI confidence dropped to 45% due to the complexity of cross-account billing calculations. 
                        Recommend human agent with billing and international services expertise.
                      </p>
                    </div>
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

export default AIHumanHandoff;
