// @ts-nocheck
import { useState } from 'react';
import { ModusWcIcon, ModusWcButton, ModusWcCard, ModusWcTextarea, ModusWcBadge, ModusWcTabs, ModusWcSlider, ModusWcSelect, ModusWcTypography } from '@trimble-oss/moduswebcomponents-react';

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

interface GeneratedContent {
  id: string;
  prompt: string;
  content: string;
  version: number;
  timestamp: Date;
  quality: number;
  feedback?: 'positive' | 'negative';
  status: 'draft' | 'reviewing' | 'approved' | 'rejected';
}

interface GenerationSettings {
  tone: string;
  length: string;
  creativity: number;
  formality: number;
}

export function AIContentGeneration() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
  const [activeContent, setActiveContent] = useState<GeneratedContent | null>(null);
  const [settings, setSettings] = useState<GenerationSettings>({
    tone: 'professional',
    length: 'medium',
    creativity: 50,
    formality: 70
  });
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const tabs = [
    { label: 'Text' },
    { label: 'Image Prompt' },
  ];

  const mockGeneratedContent = [
    {
      id: '1',
      prompt: 'Write a blog post about sustainable technology',
      content: 'Sustainable technology represents a paradigm shift in how we approach innovation. By integrating environmental consciousness with cutting-edge engineering, we can create solutions that benefit both society and the planet. From renewable energy systems to biodegradable materials, sustainable tech is reshaping industries and creating new opportunities for growth.',
      version: 1,
      timestamp: new Date(),
      quality: 89,
      status: 'draft' as const
    },
    {
      id: '2',
      prompt: 'Create marketing copy for eco-friendly products',
      content: 'Discover the future of clean living with our revolutionary eco-friendly product line. Every item is crafted with sustainability in mind, using renewable materials and zero-waste manufacturing processes. Join thousands of environmentally conscious consumers who have made the switch to a greener lifestyle.',
      version: 2,
      timestamp: new Date(),
      quality: 92,
      status: 'reviewing' as const
    }
  ];

  const generateContent = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate AI content generation
    setTimeout(() => {
      const newContent: GeneratedContent = {
        id: Date.now().toString(),
        prompt: prompt,
        content: 'This is AI-generated content based on your prompt. The actual content would be generated by an AI model using the specified parameters and settings.',
        version: 1,
        timestamp: new Date(),
        quality: Math.floor(Math.random() * 20) + 80,
        status: 'draft'
      };
      
      setGeneratedContent(prev => [newContent, ...prev]);
      setActiveContent(newContent);
      setIsGenerating(false);
    }, 3000);
  };

  const regenerateContent = (contentId: string) => {
    const content = generatedContent.find(c => c.id === contentId);
    if (!content) return;
    
    setIsGenerating(true);
    
    setTimeout(() => {
      const updatedContent: GeneratedContent = {
        ...content,
        content: 'This is a regenerated version of the content with different phrasing and approach while maintaining the core message and intent.',
        version: content.version + 1,
        timestamp: new Date(),
        quality: Math.floor(Math.random() * 20) + 80
      };
      
      setGeneratedContent(prev => 
        prev.map(c => c.id === contentId ? updatedContent : c)
      );
      setActiveContent(updatedContent);
      setIsGenerating(false);
    }, 2000);
  };

  const provideFeedback = (contentId: string, feedback: 'positive' | 'negative') => {
    setGeneratedContent(prev =>
      prev.map(c => c.id === contentId ? { ...c, feedback } : c)
    );
  };

  const updateStatus = (contentId: string, status: GeneratedContent['status']) => {
    setGeneratedContent(prev =>
      prev.map(c => c.id === contentId ? { ...c, status } : c)
    );
  };

  const getStatusColor = (status: GeneratedContent['status']) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'reviewing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getQualityColor = (quality: number) => {
    if (quality >= 90) return 'text-green-600';
    if (quality >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Content Generation Interface */}
      <ModusWcCard>
        <ModusWcTypography slot="title" hierarchy="h4" size="lg" weight="semibold" customClass="flex items-center gap-2">
          <ModusWcIcon name={getModusIconName("Sparkles")} size={getModusIconSize("h-5 w-5")} customClass="h-5 w-5 text-[var(--modus-wc-color-primary)]" />
          AI Content Generator
        </ModusWcTypography>
        <div className="p-4 space-y-4">
          <ModusWcTabs
            tabs={tabs}
            activeTabIndex={activeTabIndex}
            onTabChange={(e: CustomEvent<{ previousTab: number; newTab: number }>) => setActiveTabIndex(e.detail.newTab)}
            customClass="w-full"
          />
          
          {activeTabIndex === 0 && (
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Content Prompt
                </label>
                <ModusWcTextarea
                  value={prompt}
                  onInputChange={(e: CustomEvent) => setPrompt(e.detail?.target?.value || '')}
                  placeholder="Describe what content you want to generate..."
                  customClass="min-h-[100px]"
                />
              </div>
              
              <ModusWcButton 
                onButtonClick={generateContent}
                disabled={!prompt.trim() || isGenerating}
                customClass="w-full"
              >
                {isGenerating ? (
                  <>
                    <ModusWcIcon name={getModusIconName("RefreshCw")} size={getModusIconSize("h-4 w-4")} customClass="h-4 w-4 mr-2 animate-spin" />
                    Generating Content...
                  </>
                ) : (
                  <>
                    <ModusWcIcon name={getModusIconName("Sparkles")} size={getModusIconSize("h-4 w-4")} customClass="h-4 w-4 mr-2" />
                    Generate Content
                  </>
                )}
              </ModusWcButton>
            </div>
          )}
          
          {activeTabIndex === 1 && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Tone</label>
                  <ModusWcSelect
                    value={settings.tone}
                    options={[
                      { label: 'Professional', value: 'professional' },
                      { label: 'Casual', value: 'casual' },
                      { label: 'Friendly', value: 'friendly' },
                      { label: 'Formal', value: 'formal' }
                    ]}
                    onInputChange={(e) => {
                      const value = e.detail?.target?.value || '';
                      setSettings(prev => ({ ...prev, tone: value }));
                    }}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Length</label>
                  <ModusWcSelect
                    value={settings.length}
                    options={[
                      { label: 'Short', value: 'short' },
                      { label: 'Medium', value: 'medium' },
                      { label: 'Long', value: 'long' }
                    ]}
                    onInputChange={(e) => {
                      const value = e.detail?.target?.value || '';
                      setSettings(prev => ({ ...prev, length: value }));
                    }}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Creativity: {settings.creativity}%
                  </label>
                  <ModusWcSlider
                    value={settings.creativity}
                    onInputChange={(e) => {
                      const value = Number(e.detail?.target?.value) || 0;
                      setSettings(prev => ({ ...prev, creativity: value }));
                    }}
                    max={100}
                    step={10}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Formality: {settings.formality}%
                  </label>
                  <ModusWcSlider
                    value={settings.formality}
                    onInputChange={(e) => {
                      const value = Number(e.detail?.target?.value) || 0;
                      setSettings(prev => ({ ...prev, formality: value }));
                    }}
                    max={100}
                    step={10}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </ModusWcCard>

      {/* Generated Content Display */}
      {activeContent && (
        <ModusWcCard>
          <div className="p-4 border-b border-[var(--modus-wc-color-base-200)]">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <ModusWcTypography hierarchy="h4" size="lg" weight="semibold" label="Generated Content" />
              <div className="flex items-center gap-2">
                <ModusWcBadge variant="filled" color="tertiary" customClass={getStatusColor(activeContent.status)}>
                  {activeContent.status}
                </ModusWcBadge>
                <span className={'text-sm font-medium ' + getQualityColor(activeContent.quality)}>
                  {activeContent.quality}% Quality
                </span>
              </div>
            </div>
          </div>
          <div className="p-4 space-y-4">
            <div className="bg-[var(--modus-wc-color-base-200)]/20 p-4 rounded-lg">
              <p className="text-sm text-[var(--modus-wc-color-base-content-low-contrast)] mb-2">Prompt:</p>
              <p className="text-sm font-medium">{activeContent.prompt}</p>
            </div>
            
            <div className="bg-[var(--modus-wc-color-base-100)] p-4 border rounded-lg">
              <p className="whitespace-pre-wrap">{activeContent.content}</p>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ModusWcButton
                  size="sm"
                  variant="outlined"
                  color="tertiary"
                  onButtonClick={() => provideFeedback(activeContent.id, 'positive')}
                  customClass={activeContent.feedback === 'positive' ? 'bg-green-100' : ''}
                >
                  <ModusWcIcon name={getModusIconName("ThumbsUp")} size={getModusIconSize("h-4 w-4")} customClass="mr-1" />
                  Good
                </ModusWcButton>
                <ModusWcButton
                  size="sm"
                  variant="outlined"
                  color="tertiary"
                  onButtonClick={() => provideFeedback(activeContent.id, 'negative')}
                  customClass={activeContent.feedback === 'negative' ? 'bg-red-100' : ''}
                >
                  <ModusWcIcon name={getModusIconName("ThumbsDown")} size={getModusIconSize("h-4 w-4")} customClass="mr-1" />
                  Needs Work
                </ModusWcButton>
              </div>
              
              <div className="flex items-center gap-2">
                <ModusWcButton
                  size="sm"
                  variant="outlined"
                  color="tertiary"
                  onButtonClick={() => regenerateContent(activeContent.id)}
                  disabled={isGenerating}
                >
                  <ModusWcIcon name={getModusIconName("RefreshCw")} size={getModusIconSize("h-4 w-4")} customClass="mr-1" />
                  Regenerate
                </ModusWcButton>
                <ModusWcButton size="sm" variant="outlined" color="tertiary">
                  <ModusWcIcon name={getModusIconName("Edit")} size={getModusIconSize("h-4 w-4")} customClass="mr-1" />
                  Edit
                </ModusWcButton>
                <ModusWcButton size="sm" variant="outlined" color="tertiary">
                  <ModusWcIcon name={getModusIconName("Copy")} size={getModusIconSize("h-4 w-4")} customClass="mr-1" />
                  Copy
                </ModusWcButton>
              </div>
            </div>
            
            <div className="flex gap-2">
              <ModusWcButton
                size="sm"
                onButtonClick={() => updateStatus(activeContent.id, 'approved')}
                customClass="bg-green-600 hover:bg-green-700"
              >
                Approve
              </ModusWcButton>
              <ModusWcButton
                size="sm"
                variant="outlined"
                color="tertiary"
                onButtonClick={() => updateStatus(activeContent.id, 'reviewing')}
              >
                Review Later
              </ModusWcButton>
              <ModusWcButton
                size="sm"
                variant="filled"
                color="danger"
                onButtonClick={() => updateStatus(activeContent.id, 'rejected')}
              >
                Reject
              </ModusWcButton>
            </div>
          </div>
        </ModusWcCard>
      )}

      {/* Content History */}
      {generatedContent.length > 1 && (
        <ModusWcCard>
          <ModusWcTypography slot="title" hierarchy="h4" size="lg" weight="semibold" label="Content History" />
          <div className="p-4">
            <div className="space-y-3">
              {generatedContent.slice(0, 5).map((content) => (
                <div
                  key={content.id}
                  className="p-3 border rounded-lg cursor-pointer hover:bg-[var(--modus-wc-color-base-200)]/20"
                  onClick={() => setActiveContent(content)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium line-clamp-1">{content.prompt}</p>
                      <p className="text-xs text-[var(--modus-wc-color-base-content-low-contrast)] mt-1">
                        Version {content.version} • {content.timestamp.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <ModusWcBadge variant="filled" color="tertiary" customClass={getStatusColor(content.status)}>
                        {content.status}
                      </ModusWcBadge>
                      <span className={'text-xs ' + getQualityColor(content.quality)}>
                        {content.quality}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ModusWcCard>
      )}
    </div>
  );
}

export default AIContentGeneration;
