// @ts-nocheck
import { useState } from 'react';
import { ModusWcIcon, ModusWcCard, ModusWcButton, ModusWcBadge, ModusWcAvatar, ModusWcTextarea, ModusWcTabs, ModusWcProgress, ModusWcTypography, ModusWcSelect, ModusWcSwitch } from '@trimble-oss/moduswebcomponents-react';

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
  Lightbulb:'lightbulb_off',LightbulbOff:'lightbulb_off',Code:'code',Activity:'analytics',TrendingUp:'analytics',
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

interface Collaborator {
  id: string;
  name: string;
  type: 'human' | 'ai';
  avatar?: string;
  isActive: boolean;
  cursor?: {
    position: number;
    selection?: { start: number; end: number };
  };
}

interface Suggestion {
  id: string;
  type: 'edit' | 'addition' | 'deletion' | 'restructure';
  contributor: string;
  contributorType: 'human' | 'ai';
  content: string;
  originalText?: string;
  position: { start: number; end: number };
  reason: string;
  confidence: number;
  status: 'pending' | 'accepted' | 'rejected' | 'modified';
  timestamp: Date;
}

interface EditSession {
  id: string;
  document: string;
  collaborators: Collaborator[];
  suggestions: Suggestion[];
  aiAssistanceLevel: 'minimal' | 'moderate' | 'active';
  conflictResolution: 'auto' | 'manual' | 'vote';
}

export function AICollaborativeEditing() {
  const [session, setSession] = useState<EditSession>({
    id: 'session_1',
    document: 'The future of artificial intelligence in creative workflows represents a paradigm shift in how we approach content creation. By combining human creativity with AI capabilities, we can achieve unprecedented levels of productivity and innovation.',
    collaborators: [
      {
        id: 'user_1',
        name: 'You',
        type: 'human',
        isActive: true,
        cursor: { position: 89 }
      },
      {
        id: 'ai_writing_assistant',
        name: 'AI Writing Assistant',
        type: 'ai',
        isActive: true
      },
      {
        id: 'user_2',
        name: 'Sarah Chen',
        type: 'human',
        isActive: false
      }
    ],
    suggestions: [
      {
        id: 'suggestion_1',
        type: 'edit',
        contributor: 'ai_writing_assistant',
        contributorType: 'ai',
        content: 'transformative shift',
        originalText: 'paradigm shift',
        position: { start: 92, end: 106 },
        reason: 'More engaging and descriptive language',
        confidence: 85,
        status: 'pending',
        timestamp: new Date(Date.now() - 300000)
      },
      {
        id: 'suggestion_2',
        type: 'addition',
        contributor: 'ai_writing_assistant',
        contributorType: 'ai',
        content: ' Furthermore, this collaboration enables us to overcome individual limitations and explore new creative possibilities.',
        originalText: '',
        position: { start: 280, end: 280 },
        reason: 'Expand on the collaborative benefits',
        confidence: 92,
        status: 'pending',
        timestamp: new Date(Date.now() - 180000)
      }
    ],
    aiAssistanceLevel: 'moderate',
    conflictResolution: 'manual'
  });

  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);

  const handleSuggestionAction = (suggestionId: string, action: 'accept' | 'reject' | 'modify') => {
    setSession(prev => ({
      ...prev,
      suggestions: prev.suggestions.map(suggestion => 
        suggestion.id === suggestionId
          ? { ...suggestion, status: action === 'accept' ? 'accepted' : action === 'reject' ? 'rejected' : 'modified' }
          : suggestion
      )
    }));

    if (action === 'accept') {
      const suggestion = session.suggestions.find(s => s.id === suggestionId);
      if (suggestion) {
        // Apply the suggestion to the document
        const newDocument = 
          session.document.substring(0, suggestion.position.start) +
          suggestion.content +
          session.document.substring(suggestion.position.end);
        
        setSession(prev => ({
          ...prev,
          document: newDocument
        }));
      }
    }
  };

  const getSuggestionTypeColor = (type: Suggestion['type']) => {
    switch (type) {
      case 'edit':
        return 'bg-blue-100 text-blue-800';
      case 'addition':
        return 'bg-green-100 text-green-800';
      case 'deletion':
        return 'bg-red-100 text-red-800';
      case 'restructure':
        return 'bg-purple-100 text-purple-800';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const activeCollaborators = session.collaborators.filter(c => c.isActive);
  const pendingSuggestions = session.suggestions.filter(s => s.status === 'pending');

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Collaboration Header */}
      <ModusWcCard bordered={false} padding="compact">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[var(--modus-wc-color-base-200)]">
          <ModusWcTypography size="lg" customClass="flex items-center gap-2 !m-0">
            <ModusWcIcon name={getModusIconName("Edit")} size={getModusIconSize("h-5 w-5")} customClass="text-[var(--modus-wc-color-primary)]" />
            Collaborative AI Editor
          </ModusWcTypography>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-[var(--modus-wc-color-base-content-low-contrast)]">AI Assistance:</span>
              <ModusWcBadge variant="outlined" color="tertiary" customClass="text-xs">
                {session.aiAssistanceLevel}
              </ModusWcBadge>
            </div>
            <ModusWcButton variant="outlined" color="tertiary" size="sm" onButtonClick={() => {}}>
              <ModusWcIcon name={getModusIconName("Share")} size="xs" decorative customClass="mr-1" />
              Share
            </ModusWcButton>
          </div>
        </div>
        <div className="pt-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Active Collaborators:</span>
              <div className="flex -space-x-2">
                {activeCollaborators.map((collaborator) => (
                  <div key={collaborator.id} className="relative">
                    <ModusWcAvatar 
                      initials={collaborator.type === 'ai' ? 'AI' : 'H'} 
                      size="md" 
                      customClass={'h-8 w-8 border-2 border-[var(--modus-wc-color-base-page)] ' + (collaborator.type === 'ai' ? 'bg-blue-100' : 'bg-gray-100')} 
                    />
                    {collaborator.isActive && (
                      <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full border-2 border-[var(--modus-wc-color-base-page)]" style={{ width: '12px', height: '12px' }} />
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Suggestions:</span>
              <ModusWcBadge variant="filled" customClass="text-xs">
                {pendingSuggestions.length} pending
              </ModusWcBadge>
            </div>
          </div>
        </div>
      </ModusWcCard>

      {/* Main Editing Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Document Editor */}
        <div className="lg:col-span-2">
          <ModusWcCard bordered={false} padding="compact">
            <ModusWcTypography slot="title" size="lg">Document</ModusWcTypography>
            <div className="space-y-4">
              <ModusWcTextarea
                value={session.document}
                onInputChange={(e) =>
                  setSession((prev) => ({
                    ...prev,
                    document: String(e.detail?.target?.value ?? ''),
                  }))
                }
                customClass="min-h-[400px] resize-none"
                placeholder="Start writing..."
              />
              
              <div className="flex items-center justify-between text-xs text-[var(--modus-wc-color-base-content-low-contrast)]">
                <span>{session.document.length} characters</span>
                <div className="flex items-center gap-2">
                  <ModusWcIcon name={getModusIconName("Eye")} size={getModusIconSize("h-4 w-4")} />
                  <span>{activeCollaborators.length} viewing</span>
                </div>
              </div>
            </div>
          </ModusWcCard>
        </div>

        {/* Suggestions Panel */}
        <div className="space-y-4">
          <ModusWcCard bordered={false} padding="compact">
            <ModusWcTypography slot="title" size="lg" customClass="flex items-center gap-2">
              <ModusWcIcon name={getModusIconName("LightbulbOff")} size={getModusIconSize("h-4 w-4")} />
              AI Suggestions
            </ModusWcTypography>
            <div className="space-y-3">
              {pendingSuggestions.length > 0 ? (
                pendingSuggestions.map((suggestion) => (
                  <div key={suggestion.id} className="border rounded-lg p-3 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <ModusWcAvatar 
                          initials="AI" 
                          size="sm" 
                          customClass="h-6 w-6 bg-blue-100" 
                        />
                        <ModusWcBadge customClass={'text-xs ' + getSuggestionTypeColor(suggestion.type)}>
                          {suggestion.type}
                        </ModusWcBadge>
                      </div>
                      <span className={'text-xs ' + getConfidenceColor(suggestion.confidence)}>
                        {suggestion.confidence}%
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      {suggestion.originalText && (
                        <div>
                          <p className="text-xs text-[var(--modus-wc-color-base-content-low-contrast)]">Replace:</p>
                          <p className="text-sm bg-red-50 text-red-800 px-2 py-1 rounded">
                            "{suggestion.originalText}"
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="text-xs text-[var(--modus-wc-color-base-content-low-contrast)]">
                          {suggestion.type === 'addition' ? 'Add:' : 'With:'}
                        </p>
                        <p className="text-sm bg-green-50 text-green-800 px-2 py-1 rounded">
                          "{suggestion.content}"
                        </p>
                      </div>
                      <p className="text-xs text-[var(--modus-wc-color-base-content-low-contrast)]">
                        {suggestion.reason}
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <ModusWcButton
                        size="sm"
                        color="primary"
                        variant="filled"
                        onButtonClick={() => handleSuggestionAction(suggestion.id, 'accept')}
                        customClass="h-7 px-2"
                      >
                        <ModusWcIcon name={getModusIconName("Check")} size="xs" decorative customClass="mr-1" />
                        Accept
                      </ModusWcButton>
                      <ModusWcButton
                        variant="outlined"
                        color="tertiary"
                        size="sm"
                        onButtonClick={() => handleSuggestionAction(suggestion.id, 'reject')}
                        customClass="h-7 px-2"
                      >
                        <ModusWcIcon name={getModusIconName("X")} size="xs" decorative customClass="mr-1" />
                        Reject
                      </ModusWcButton>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-[var(--modus-wc-color-base-content-low-contrast)]">
                  <ModusWcIcon name={getModusIconName("Lightbulb")} size={getModusIconSize("h-8 w-8")} customClass="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No pending suggestions</p>
                  <p className="text-xs">AI will suggest improvements as you write</p>
                </div>
              )}
            </div>
          </ModusWcCard>

          {/* Collaboration Stats */}
          <ModusWcCard bordered={false} padding="compact">
            <ModusWcTypography slot="title" size="md">Session Stats</ModusWcTypography>
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>AI Suggestions:</span>
                  <span className="font-medium">12 accepted</span>
                </div>
                <ModusWcProgress value={85} max={100} customClass="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Human Edits:</span>
                  <span className="font-medium">23 changes</span>
                </div>
                <ModusWcProgress value={65} max={100} customClass="h-2" />
              </div>
              
              <div className="pt-2 border-t text-xs text-[var(--modus-wc-color-base-content-low-contrast)]">
                <p>Collaboration efficiency: 94%</p>
                <p>Last activity: 2 minutes ago</p>
              </div>
            </div>
          </ModusWcCard>
        </div>
      </div>

      {/* Collaboration Controls */}
      <ModusWcCard bordered={false} padding="compact">
        <div className="p-4">
          <ModusWcTabs 
            tabs={[
              { label: 'AI Settings' },
              { label: 'Edit History' },
              { label: 'Conflicts' }
            ]} 
            activeTabIndex={activeTabIndex}
            onTabChange={(e: CustomEvent<{ previousTab: number; newTab: number }>) => {
              setActiveTabIndex(e.detail.newTab);
            }}
            customClass="w-full"
          />
          {activeTabIndex === 0 && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">AI Assistance Level</label>
                  <ModusWcSelect
                    value={session.aiAssistanceLevel}
                    options={[
                      { label: 'Minimal - Only when asked', value: 'minimal' },
                      { label: 'Moderate - Helpful suggestions', value: 'moderate' },
                      { label: 'Active - Proactive assistance', value: 'active' },
                    ]}
                    onInputChange={(e) => {
                      const value = String(e.detail?.target?.value ?? '') as EditSession['aiAssistanceLevel'];
                      setSession((prev) => ({ ...prev, aiAssistanceLevel: value }));
                    }}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Conflict Resolution</label>
                  <ModusWcSelect
                    value={session.conflictResolution}
                    options={[
                      { label: 'Manual - Require approval', value: 'manual' },
                      { label: 'Auto - Accept high confidence', value: 'auto' },
                      { label: 'Vote - Team decision', value: 'vote' },
                    ]}
                    onInputChange={(e) => {
                      const value = String(e.detail?.target?.value ?? '') as EditSession['conflictResolution'];
                      setSession((prev) => ({ ...prev, conflictResolution: value }));
                    }}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Auto-save</label>
                  <div className="flex items-center gap-3 p-2">
                    <ModusWcSwitch
                      value={autoSaveEnabled}
                      onInputChange={(e) =>
                        setAutoSaveEnabled(Boolean(e.detail?.target?.checked))
                      }
                    />
                    <span className="text-sm">Every 30 seconds</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTabIndex === 1 && (
            <div className="space-y-3 mt-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 bg-[var(--modus-wc-color-base-200)]/20 rounded">
                  <ModusWcIcon name={getModusIconName("History")} size={getModusIconSize("h-4 w-4")} customClass="text-[var(--modus-wc-color-base-content-low-contrast)]" />
                  <span className="text-sm">Version history and edit tracking coming soon</span>
                </div>
              </div>
            </div>
          )}
          {activeTabIndex === 2 && (
            <div className="text-center py-8 text-[var(--modus-wc-color-base-content-low-contrast)] mt-4">
              <ModusWcIcon name={getModusIconName("MessageSquare")} size={getModusIconSize("h-8 w-8")} customClass="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No conflicts detected</p>
              <p className="text-xs">Collaborative editing is working smoothly</p>
            </div>
          )}
        </div>
      </ModusWcCard>
    </div>
  );
}

export default AICollaborativeEditing;
