// @ts-nocheck
import { useState, useEffect } from 'react';
import { ModusWcIcon, ModusWcCard, ModusWcButton, ModusWcBadge, ModusWcTabs, ModusWcSlider, ModusWcSwitch, ModusWcProgress, ModusWcTypography } from '@trimble-oss/moduswebcomponents-react';

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

interface RecommendationItem {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  confidence: number;
  relevanceScore: number;
  reasons: string[];
  source: 'collaborative' | 'content_based' | 'hybrid' | 'trending' | 'social';
  metadata: {
    rating?: number;
    popularity?: number;
    recency?: number;
    similarity?: number;
  };
  userInteraction?: {
    viewed: boolean;
    liked?: boolean;
    disliked?: boolean;
    saved?: boolean;
    rating?: number;
  };
}

interface RecommendationSettings {
  diversity: number;
  novelty: number;
  popularity: number;
  recency: number;
  enableExploration: boolean;
  categoryPreferences: Record<string, number>;
}

interface UserFeedback {
  itemId: string;
  type: 'like' | 'dislike' | 'rating' | 'save' | 'dismiss';
  value?: number;
  timestamp: Date;
}

export function AIRecommendationSystems() {
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([
    {
      id: '1',
      title: 'Advanced React Patterns Workshop',
      description: 'Deep dive into advanced React patterns including render props, higher-order components, and hooks.',
      category: 'Programming',
      tags: ['React', 'Advanced', 'Patterns', 'Frontend'],
      confidence: 94,
      relevanceScore: 87,
      reasons: ['Matches your React expertise', 'Similar to your recent views', 'Highly rated by similar users'],
      source: 'hybrid',
      metadata: {
        rating: 4.8,
        popularity: 89,
        recency: 7,
        similarity: 92
      },
      userInteraction: {
        viewed: false
      }
    },
    {
      id: '2',
      title: 'TypeScript Best Practices',
      description: 'Learn industry best practices for TypeScript development and advanced type system features.',
      category: 'Programming',
      tags: ['TypeScript', 'Best Practices', 'Advanced'],
      confidence: 88,
      relevanceScore: 82,
      reasons: ['Based on your TypeScript interest', 'Trending in your network'],
      source: 'content_based',
      metadata: {
        rating: 4.6,
        popularity: 76,
        recency: 14,
        similarity: 85
      },
      userInteraction: {
        viewed: true,
        liked: true
      }
    },
    {
      id: '3',
      title: 'Design Systems at Scale',
      description: 'Building and maintaining design systems for large organizations and multiple teams.',
      category: 'Design',
      tags: ['Design Systems', 'Scale', 'Organization'],
      confidence: 75,
      relevanceScore: 71,
      reasons: ['Exploring new interests', 'Popular among developers'],
      source: 'collaborative',
      metadata: {
        rating: 4.4,
        popularity: 68,
        recency: 21,
        similarity: 45
      },
      userInteraction: {
        viewed: false
      }
    }
  ]);

  const [settings, setSettings] = useState<RecommendationSettings>({
    diversity: 70,
    novelty: 60,
    popularity: 80,
    recency: 50,
    enableExploration: true,
    categoryPreferences: {
      'Programming': 90,
      'Design': 60,
      'Business': 30,
      'Science': 40
    }
  });

  const [feedbackHistory, setFeedbackHistory] = useState<UserFeedback[]>([]);
  const [showExplanations, setShowExplanations] = useState(true);
  const [settingsTabIndex, setSettingsTabIndex] = useState(0);
  const settingsTabs = [
    { id: 'preferences', label: 'Preferences' },
    { id: 'algorithm', label: 'Algorithm' },
  ];

  const handleFeedback = (itemId: string, type: UserFeedback['type'], value?: number) => {
    const feedback: UserFeedback = {
      itemId,
      type,
      value,
      timestamp: new Date()
    };

    setFeedbackHistory(prev => [...prev, feedback]);
    
    setRecommendations(prev =>
      prev.map(item =>
        item.id === itemId
          ? {
              ...item,
              userInteraction: {
                ...item.userInteraction,
                [type === 'like' ? 'liked' : type === 'dislike' ? 'disliked' : type]: 
                  type === 'rating' ? value : true
              }
            }
          : item
      )
    );
  };

  const getSourceIcon = (source: RecommendationItem['source']) => {
    switch (source) {
      case 'collaborative':
        return <ModusWcIcon name={getModusIconName("Person")} size="md" decorative />;
      case 'content_based':
        return <ModusWcIcon name={getModusIconName("Brain")} size="md" decorative />;
      case 'hybrid':
        return <ModusWcIcon name={getModusIconName("TrendingUp")} size="md" decorative />;
      case 'trending':
        return <ModusWcIcon name={getModusIconName("TrendingUp")} size="md" decorative />;
      case 'social':
        return <ModusWcIcon name={getModusIconName("Heart")} size="md" decorative />;
    }
  };

  const getSourceLabel = (source: RecommendationItem['source']) => {
    switch (source) {
      case 'collaborative':
        return 'People like you';
      case 'content_based':
        return 'Content match';
      case 'hybrid':
        return 'AI recommended';
      case 'trending':
        return 'Trending now';
      case 'social':
        return 'Social activity';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const refreshRecommendations = () => {
    // In a real app, this would trigger a new recommendation request
    setRecommendations(prev => [...prev].sort(() => Math.random() - 0.5));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Recommendation Overview */}
      <ModusWcCard>
        <div className="p-4 pb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ModusWcIcon name={getModusIconName("Brain")} size="md" decorative />
              <ModusWcTypography hierarchy="h4" size="md" weight="semibold" label="AI Recommendations" />
            </div>
            <div className="flex items-center gap-2">
              <ModusWcButton variant="outline" size="sm" onButtonClick={refreshRecommendations}>
                <ModusWcIcon name={getModusIconName("RotateCcw")} size="md" decorative />
                Refresh
              </ModusWcButton>
              <ModusWcBadge variant="outlined" customClass="text-sm">
                {recommendations.length} items
              </ModusWcBadge>
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <ModusWcIcon name={getModusIconName("Brain")} size="sm" decorative />
                <span className="text-sm font-medium text-blue-800">Personalization</span>
              </div>
              <div className="space-y-1">
                <ModusWcProgress value={87} max={100} customClass="h-2" />
                <p className="text-xs text-blue-600">87% match accuracy</p>
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <ModusWcIcon name={getModusIconName("TrendingUp")} size="sm" decorative />
                <span className="text-sm font-medium text-green-800">Diversity</span>
              </div>
              <div className="space-y-1">
                <ModusWcProgress value={73} max={100} customClass="h-2" />
                <p className="text-xs text-green-600">Good variety</p>
              </div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <ModusWcIcon name={getModusIconName("Eye")} size="sm" decorative />
                <span className="text-sm font-medium text-purple-800">Discovery</span>
              </div>
              <div className="space-y-1">
                <ModusWcProgress value={65} max={100} customClass="h-2" />
                <p className="text-xs text-purple-600">New interests</p>
              </div>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <ModusWcIcon name={getModusIconName("Star")} size="sm" decorative />
                <span className="text-sm font-medium text-orange-800">Satisfaction</span>
              </div>
              <div className="space-y-1">
                <ModusWcProgress value={91} max={100} customClass="h-2" />
                <p className="text-xs text-orange-600">91% positive feedback</p>
              </div>
            </div>
          </div>
        </div>
      </ModusWcCard>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recommendations List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recommended for You</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-[var(--modus-wc-color-base-content-low-contrast)]">Show explanations</span>
              <ModusWcSwitch
                checked={showExplanations}
                onSwitchChange={(e: CustomEvent<boolean>) => setShowExplanations(e.detail)}
              />
            </div>
          </div>

          {recommendations.map((item) => (
            <ModusWcCard key={item.id} className="relative">
              <div className="p-4">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium">{item.title}</h3>
                        <ModusWcBadge variant="outlined" customClass="text-xs">
                          {item.category}
                        </ModusWcBadge>
                        {item.userInteraction?.viewed && (
                          <ModusWcBadge variant="filled" color="tertiary" customClass="text-xs">
                            Viewed
                          </ModusWcBadge>
                        )}
                      </div>
                      <p className="text-sm text-[var(--modus-wc-color-base-content-low-contrast)] mb-3">
                        {item.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {item.tags.map((tag, index) => (
                          <ModusWcBadge key={index} variant="outlined" customClass="text-xs">
                            {tag}
                          </ModusWcBadge>
                        ))}
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="flex items-center gap-1 mb-1">
                        {getSourceIcon(item.source)}
                        <span className="text-xs text-[var(--modus-wc-color-base-content-low-contrast)]">
                          {getSourceLabel(item.source)}
                        </span>
                      </div>
                      <div className={'text-sm font-medium ' + getConfidenceColor(item.confidence)}>
                        {item.confidence}% match
                      </div>
                    </div>
                  </div>

                  {showExplanations && (
                    <div className="bg-[var(--modus-wc-color-base-200)]/20 p-3 rounded-lg">
                      <p className="text-xs font-medium mb-2">Why this was recommended:</p>
                      <ul className="text-xs text-[var(--modus-wc-color-base-content-low-contrast)] space-y-1">
                        {item.reasons.map((reason, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-current rounded-full" />
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-4">
                      <ModusWcButton
                        variant="borderless"
                        size="sm"
                        onButtonClick={() => handleFeedback(item.id, 'like')}
                        customClass={item.userInteraction?.liked ? 'text-green-600' : ''}
                      >
                        <ModusWcIcon name={getModusIconName("ThumbsUp")} size="md" decorative />
                        Like
                      </ModusWcButton>
                      <ModusWcButton
                        variant="borderless"
                        size="sm"
                        onButtonClick={() => handleFeedback(item.id, 'dislike')}
                        customClass={item.userInteraction?.disliked ? 'text-red-600' : ''}
                      >
                        <ModusWcIcon name={getModusIconName("ThumbsDown")} size="md" decorative />
                        Pass
                      </ModusWcButton>
                      <ModusWcButton
                        variant="borderless"
                        size="sm"
                        onButtonClick={() => handleFeedback(item.id, 'save')}
                      >
                        <ModusWcIcon name={getModusIconName("Heart")} size="md" decorative />
                        Save
                      </ModusWcButton>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {item.metadata.rating && (
                        <div className="flex items-center gap-1">
                          <ModusWcIcon name={getModusIconName("Star")} size="md" decorative />
                          <span className="text-xs">{item.metadata.rating}</span>
                        </div>
                      )}
                      <span className="text-xs text-[var(--modus-wc-color-base-content-low-contrast)]">
                        {item.relevanceScore}% relevant
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </ModusWcCard>
          ))}
        </div>

        {/* Settings & Controls */}
        <div className="space-y-4">
          <ModusWcCard>
            <div className="p-4 pb-0">
              <div className="flex items-center gap-2">
                <ModusWcIcon name={getModusIconName("Filter")} size="sm" decorative />
                <ModusWcTypography hierarchy="h4" size="md" weight="semibold" label="Recommendation Settings" />
              </div>
            </div>
            <div className="p-4">
              <ModusWcTabs
                tabs={settingsTabs}
                activeTabIndex={settingsTabIndex}
                onTabChange={(e: CustomEvent<{ previousTab: number; newTab: number }>) => setSettingsTabIndex(e.detail.newTab)}
                customClass="w-full"
              />

              {settingsTabIndex === 0 && (
                <div className="space-y-4">
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Category Preferences</h4>
                    {Object.entries(settings.categoryPreferences).map(([category, value]) => (
                      <div key={category} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{category}</span>
                          <span>{value}%</span>
                        </div>
                        <ModusWcSlider
                          value={value}
                          onInputChange={(e) => {
                            const newValue = Number(e.detail?.target?.value) || 0;
                            setSettings(prev => ({
                              ...prev,
                              categoryPreferences: {
                                ...prev.categoryPreferences,
                                [category]: newValue
                              }
                            }));
                          }}
                          max={100}
                          step={10}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {settingsTabIndex === 1 && (
                <div className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Diversity</span>
                        <span>{settings.diversity}%</span>
                      </div>
                      <ModusWcSlider
                        value={settings.diversity}
                        onInputChange={(e) => {
                          const value = Number(e.detail?.target?.value) || 0;
                          setSettings(prev => ({ ...prev, diversity: value }));
                        }}
                        max={100}
                        step={5}
                      />
                      <p className="text-xs text-[var(--modus-wc-color-base-content-low-contrast)]">
                        Higher values show more varied content
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Novelty</span>
                        <span>{settings.novelty}%</span>
                      </div>
                      <ModusWcSlider
                        value={settings.novelty}
                        onInputChange={(e) => {
                          const value = Number(e.detail?.target?.value) || 0;
                          setSettings(prev => ({ ...prev, novelty: value }));
                        }}
                        max={100}
                        step={5}
                      />
                      <p className="text-xs text-[var(--modus-wc-color-base-content-low-contrast)]">
                        Higher values favor new, unexplored content
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Popularity</span>
                        <span>{settings.popularity}%</span>
                      </div>
                      <ModusWcSlider
                        value={settings.popularity}
                        onInputChange={(e) => {
                          const value = Number(e.detail?.target?.value) || 0;
                          setSettings(prev => ({ ...prev, popularity: value }));
                        }}
                        max={100}
                        step={5}
                      />
                      <p className="text-xs text-[var(--modus-wc-color-base-content-low-contrast)]">
                        Higher values favor popular content
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="text-sm font-medium">Enable Exploration</p>
                        <p className="text-xs text-[var(--modus-wc-color-base-content-low-contrast)]">
                          Occasionally show unexpected content
                        </p>
                      </div>
                      <ModusWcSwitch
                        checked={settings.enableExploration}
                        onSwitchChange={(e: CustomEvent<boolean>) =>
                          setSettings(prev => ({ ...prev, enableExploration: e.detail }))
                        }
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ModusWcCard>

          {/* Feedback Summary */}
          <ModusWcCard>
            <div className="p-4 pb-0">
              <ModusWcTypography hierarchy="h4" size="md" weight="semibold" label="Recent Activity" />
            </div>
            <div className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Items liked:</span>
                  <span className="font-medium text-green-600">
                    {feedbackHistory.filter(f => f.type === 'like').length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Items saved:</span>
                  <span className="font-medium text-blue-600">
                    {feedbackHistory.filter(f => f.type === 'save').length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Items dismissed:</span>
                  <span className="font-medium text-red-600">
                    {feedbackHistory.filter(f => f.type === 'dislike').length}
                  </span>
                </div>
                <div className="pt-2 border-t text-xs text-[var(--modus-wc-color-base-content-low-contrast)]">
                  <p>Your feedback helps improve recommendations</p>
                </div>
              </div>
            </div>
          </ModusWcCard>
        </div>
      </div>
    </div>
  );
}

export default AIRecommendationSystems;
