import React, { useState } from 'react';
import { 
  Home, Inbox, Settings, ChevronRight, Check, X, 
  Trash2, ShieldCheck, BrushCleaning, RefreshCw, Smartphone, 
  Monitor, ExternalLink, Lock, AlertCircle, ArrowLeft,
  Send, Copy, Eye, Zap, LogOut, FileText
} from 'lucide-react';
import { Sender, EmailMessage } from '../../types';

interface BrumyAndroidAppProps {
  senders: Sender[];
  sampleMessages: EmailMessage[];
  onUnsubscribe: (sender: Sender) => void;
  onBulkTrash: (sender: Sender) => void;
  unsubCount: number;
  maxFreeUnsubs: number;
  onOpenPaywall: () => void;
}

export const BrumyAndroidApp: React.FC<BrumyAndroidAppProps> = ({
  senders,
  sampleMessages,
  onUnsubscribe,
  onBulkTrash,
  unsubCount,
  maxFreeUnsubs,
  onOpenPaywall,
}) => {
  // Navigation: 'onboarding' | 'home' | 'senders' | 'settings'
  const [currentRoute, setCurrentRoute] = useState<'onboarding' | 'home' | 'senders' | 'settings'>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeSheetSender, setActiveSheetSender] = useState<Sender | null>(null);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'responsive'>('mobile');

  // AI states inside bottom sheet
  const [aiTab, setAiTab] = useState<'summary' | 'reply'>('summary');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [aiReply, setAiReply] = useState<{ subject: string; body: string } | null>(null);
  const [replyIntent, setReplyIntent] = useState('Acknowledge receipt and express interest in connecting next week');
  const [copiedReply, setCopiedReply] = useState(false);

  // Compute stats
  const totalEmails = senders.reduce((acc, s) => acc + s.messageCount, 0);
  const cleanedCount = senders.filter(s => s.unsubscribed || s.trashed).length;
  const topSender = senders[0];

  // Filtered senders
  const filteredSenders = senders.filter(s => {
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Newsletters') return s.category === 'newsletter';
    if (selectedCategory === 'Promos') return s.category === 'promotion';
    if (selectedCategory === 'Spam') return s.category === 'spam';
    return true;
  });

  // Handle AI generation in sheet
  const handleGenerateSummary = async (sender: Sender) => {
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/ai/task3-summarize-thread', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          thread: [
            {
              from: `${sender.name} <${sender.email}>`,
              subject: sender.sampleSubjects[0] || 'Weekly updates',
              body: `Hello,\n\nHere are the top headlines and system alerts from ${sender.name}.\nPlease review your account settings before Friday.\n\nBest regards,\n${sender.name} Team`,
              date: sender.lastReceived,
            }
          ]
        }),
      });
      const data = await res.json();
      setAiSummary(data.summary || '• Routine email digest.\n• Action required: none.\n• Recommend: unsubscribe or trash.');
    } catch (e) {
      setAiSummary('• Regular periodic newsletter.\n• High email volume with low engagement.\n• Recommendation: Unsubscribe in one click.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleDraftReply = async (sender: Sender) => {
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/ai/task4-draft-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          thread: [
            {
              from: `${sender.name} <${sender.email}>`,
              subject: sender.sampleSubjects[0] || 'Inquiry',
              body: `Hi there, checking in on the proposal we sent over last week.`,
            }
          ],
          userIntent: replyIntent,
          tone: 'professional'
        }),
      });
      const data = await res.json();
      setAiReply({
        subject: data.subject || `Re: ${sender.sampleSubjects[0]}`,
        body: data.body || 'Hi team,\n\nThanks for following up. We received your note and are reviewing the materials.\n\nBest,\nBrumy User'
      });
    } catch (e) {
      setAiReply({
        subject: `Re: ${sender.sampleSubjects[0]}`,
        body: `Hi,\n\nThanks for reaching out. We have received your update.\n\nBest regards,`
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  // Reusable Avatar component matching Android Avatar(name, size)
  const renderAvatar = (name: string, size = 40) => {
    const initials = (name || 'B').substring(0, 2).toUpperCase();
    return (
      <div 
        style={{ width: `${size}px`, height: `${size}px` }}
        className="rounded-full bg-[#0F6E4F]/10 text-[#0F6E4F] font-semibold flex items-center justify-center text-xs shrink-0 select-none border border-[#0F6E4F]/20"
      >
        {initials}
      </div>
    );
  };

  // Content for the 4 screens
  const renderScreen = () => {
    switch (currentRoute) {
      case 'onboarding':
        return (
          <div className="flex-1 flex flex-col justify-between p-6 bg-[#FAFAF9] text-[#0E1116] select-none">
            <div className="pt-16">
              <div className="w-14 h-14 rounded-2xl bg-[#0F6E4F]/10 border border-[#0F6E4F]/20 flex items-center justify-center text-[#0F6E4F] mb-6">
                <BrushCleaning className="w-7 h-7 text-[#0F6E4F]" />
              </div>
              <h1 className="text-[28px] font-semibold leading-tight tracking-[-0.5px] text-[#0E1116] mb-3 whitespace-pre-line">
                A cleaner inbox,{"\n"}in two taps.
              </h1>
              <p className="text-[#6B7280] text-base leading-6">
                Brumy finds noisy senders, unsubscribes you in one tap, and clears the backlog.
              </p>
            </div>

            <div className="pb-8 space-y-3">
              <button
                onClick={() => setCurrentRoute('home')}
                className="w-full h-12 bg-[#0F6E4F] active:bg-[#0A4F39] text-white font-medium text-sm rounded-[10px] flex items-center justify-center transition-colors shadow-none select-none cursor-pointer"
              >
                Continue with Google
              </button>
              <p className="text-xs text-[#6B7280] text-center px-4 leading-relaxed">
                Brumy only reads sender and header data. Your emails never leave your device.
              </p>
            </div>
          </div>
        );

      case 'home':
        return (
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#FAFAF9] text-[#0E1116]">
            {/* Header Stat Row */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <span className="text-xs font-medium text-[#6B7280] tracking-[0.4px] block">Inbox</span>
                <span className="text-xl font-semibold text-[#0E1116] tracking-[-0.2px]">{totalEmails.toLocaleString()} emails</span>
              </div>
              <div className="bg-[#0F6E4F]/10 text-[#0F6E4F] text-xs font-medium px-2.5 py-1.5 rounded-full flex items-center space-x-1 border border-[#0F6E4F]/10">
                <BrushCleaning className="w-3.5 h-3.5" />
                <span>{cleanedCount} cleaned</span>
              </div>
            </div>

            {/* Top Noisy Sender Card */}
            {topSender && (
              <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-5 space-y-3">
                <div>
                  <span className="text-xs font-medium text-[#6B7280] tracking-[0.4px] block">Top noisy sender</span>
                  <div className="text-base font-medium text-[#0E1116] mt-1">{topSender.name}</div>
                  <div className="text-sm text-[#6B7280]">
                    {topSender.messageCount} emails · <span className="capitalize">{topSender.category}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-1">
                  <button
                    onClick={() => onUnsubscribe(topSender)}
                    disabled={topSender.unsubscribed}
                    className="flex-1 h-12 bg-[#0F6E4F] active:bg-[#0A4F39] disabled:bg-[#0F6E4F]/30 text-white font-medium text-sm rounded-[10px] flex items-center justify-center transition-colors shadow-none cursor-pointer"
                  >
                    {topSender.unsubscribed ? 'Unsubscribed' : 'Unsubscribe'}
                  </button>
                  <button
                    onClick={() => {
                      setActiveSheetSender(topSender);
                      setAiSummary(null);
                      setAiReply(null);
                    }}
                    className="flex-1 h-12 bg-transparent border border-[#E5E7EB] text-[#0E1116] font-medium text-sm rounded-[10px] flex items-center justify-center hover:bg-[#FAFAF9] active:bg-[#E5E7EB]/50 transition-colors shadow-none cursor-pointer"
                  >
                    Review
                  </button>
                </div>
              </div>
            )}

            {/* Section Header */}
            <div className="pt-2">
              <span className="text-sm font-medium text-[#0E1116] block">Cleanup suggestions</span>
            </div>

            {/* Suggestions List */}
            <div className="space-y-2">
              {senders.slice(1, 6).map((s) => (
                <div
                  key={s.id}
                  onClick={() => {
                    setActiveSheetSender(s);
                    setAiSummary(null);
                    setAiReply(null);
                  }}
                  className="bg-white rounded-[12px] border border-[#E5E7EB] p-4 flex items-center justify-between cursor-pointer hover:border-[#0F6E4F]/30 active:bg-[#FAFAF9] transition-all"
                >
                  <div className="flex items-center space-x-3 overflow-hidden">
                    {renderAvatar(s.name, 40)}
                    <div className="overflow-hidden">
                      <div className="text-base font-medium text-[#0E1116] truncate">{s.name}</div>
                      <div className="text-sm text-[#6B7280] truncate">
                        {s.messageCount} emails · <span className="capitalize">{s.category}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    {s.unsubscribed && (
                      <span className="text-[11px] font-medium text-[#0F6E4F] bg-[#0F6E4F]/10 px-2 py-0.5 rounded-full">
                        Unsubbed
                      </span>
                    )}
                    <ChevronRight className="w-5 h-5 text-[#6B7280]" />
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions Footer */}
            <div className="pt-3">
              <button
                onClick={() => setCurrentRoute('senders')}
                className="w-full h-12 border border-[#E5E7EB] bg-white text-[#0E1116] font-medium text-sm rounded-[10px] flex items-center justify-center hover:bg-[#FAFAF9] transition-colors"
              >
                View all {senders.length} senders
              </button>
            </div>
          </div>
        );

      case 'senders':
        return (
          <div className="flex-1 flex flex-col overflow-hidden bg-[#FAFAF9] text-[#0E1116]">
            {/* Sticky Filter Chips */}
            <div className="px-5 py-3 flex items-center space-x-2 overflow-x-auto border-b border-[#E5E7EB] bg-[#FAFAF9] shrink-0">
              {['All', 'Newsletters', 'Promos', 'Spam'].map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`h-8 px-3.5 rounded-full text-xs font-medium transition-colors shrink-0 flex items-center ${
                      isSelected
                        ? 'bg-[#0F6E4F] text-white'
                        : 'bg-white border border-[#E5E7EB] text-[#0E1116] hover:bg-[#FAFAF9]'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Senders LazyColumn list */}
            <div className="flex-1 overflow-y-auto px-5 py-3 space-y-2">
              {filteredSenders.map((s) => (
                <div
                  key={s.id}
                  onClick={() => {
                    setActiveSheetSender(s);
                    setAiSummary(null);
                    setAiReply(null);
                  }}
                  className="bg-white rounded-[12px] border border-[#E5E7EB] p-4 flex items-center justify-between cursor-pointer hover:border-[#0F6E4F]/30 active:bg-[#FAFAF9] transition-all"
                >
                  <div className="flex items-center space-x-3 overflow-hidden">
                    {renderAvatar(s.name, 40)}
                    <div className="overflow-hidden">
                      <div className="text-base font-medium text-[#0E1116] truncate">{s.name}</div>
                      <div className="text-sm text-[#6B7280] truncate">
                        {s.messageCount} emails · <span className="capitalize">{s.category}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    {s.unsubscribed ? (
                      <span className="text-[11px] font-medium text-[#0F6E4F] bg-[#0F6E4F]/10 px-2 py-0.5 rounded-full">
                        Done
                      </span>
                    ) : s.trashed ? (
                      <span className="text-[11px] font-medium text-[#B42318] bg-[#B42318]/10 px-2 py-0.5 rounded-full">
                        Trashed
                      </span>
                    ) : null}
                    <ChevronRight className="w-5 h-5 text-[#6B7280]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-[#FAFAF9] text-[#0E1116]">
            <div>
              <h2 className="text-xl font-semibold text-[#0E1116] tracking-[-0.2px]">Settings</h2>
              <p className="text-sm text-[#6B7280] mt-0.5">Account, limits &amp; privacy controls</p>
            </div>

            {/* Account Card */}
            <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-5 space-y-3">
              <span className="text-xs font-medium text-[#6B7280] tracking-[0.4px] block">Connected Account</span>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-[#0F6E4F]/10 text-[#0F6E4F] flex items-center justify-center font-bold text-sm">
                  JD
                </div>
                <div>
                  <div className="text-base font-medium text-[#0E1116]">Jordan Doe</div>
                  <div className="text-sm text-[#6B7280]">jordan.doe@gmail.com</div>
                </div>
              </div>
            </div>

            {/* Plan & Usage Card */}
            <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-medium text-[#6B7280] tracking-[0.4px] block">Current Plan</span>
                  <div className="text-base font-semibold text-[#0E1116] mt-0.5">Free Tier</div>
                </div>
                <span className="text-xs font-medium text-[#0F6E4F] bg-[#0F6E4F]/10 px-2.5 py-1 rounded-full border border-[#0F6E4F]/20">
                  {unsubCount}/{maxFreeUnsubs} used
                </span>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5">
                <div className="w-full bg-[#E5E7EB] h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#0F6E4F] h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (unsubCount / maxFreeUnsubs) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-[#6B7280]">
                  <span>{unsubCount} unsubscribes completed</span>
                  <span>{maxFreeUnsubs - unsubCount} remaining</span>
                </div>
              </div>

              <button
                onClick={onOpenPaywall}
                className="w-full h-12 bg-[#0F6E4F] active:bg-[#0A4F39] text-white font-medium text-sm rounded-[10px] flex items-center justify-center transition-colors cursor-pointer"
              >
                Upgrade to Pro ($7/mo)
              </button>
            </div>

            {/* Privacy & Guardrails Section */}
            <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-5 space-y-3">
              <span className="text-xs font-medium text-[#6B7280] tracking-[0.4px] block">Privacy &amp; Data Security</span>

              <div className="text-xs text-[#6B7280] space-y-2">
                <p>• Zero email content stored permanently.</p>
                <p>• Only reads headers (RFC 8058) &amp; sender metadata.</p>
                <p>• Deletions move to Gmail Trash (recoverable in 30 days).</p>
              </div>

              <div className="pt-2 flex flex-col space-y-2">
                <button
                  onClick={() => setCurrentRoute('onboarding')}
                  className="w-full h-12 bg-transparent border border-[#E5E7EB] text-[#0E1116] font-medium text-sm rounded-[10px] flex items-center justify-center hover:bg-[#FAFAF9]"
                >
                  <LogOut className="w-4 h-4 mr-2 text-[#6B7280]" />
                  Disconnect Google Account
                </button>
              </div>
            </div>

            <div className="text-center text-xs text-[#6B7280] pt-2">
              Brumy Android v0.1.0 (SDK 35) • Section 7 Compliant
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Device View Mode Switcher Header */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 flex items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-[#0F6E4F]/10 text-[#0F6E4F] flex items-center justify-center shrink-0">
            <BrushCleaning className="w-4 h-4 text-[#0F6E4F]" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-[#0E1116] whitespace-nowrap">Android Compose Implementation</h2>
            <p className="text-xs text-[#6B7280]">
              Jetpack Compose + Material 3 Design System • Color tokens: BrumyGreen (#0F6E4F), BrumySurface (#FAFAF9)
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => setDeviceMode('mobile')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg flex items-center space-x-1.5 transition-colors whitespace-nowrap ${
              deviceMode === 'mobile'
                ? 'bg-[#0E1116] text-white'
                : 'bg-[#FAFAF9] border border-[#E5E7EB] text-[#6B7280] hover:text-[#0E1116]'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 shrink-0" />
            <span>Pixel 8 Frame</span>
          </button>
          <button
            onClick={() => setDeviceMode('responsive')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg flex items-center space-x-1.5 transition-colors whitespace-nowrap ${
              deviceMode === 'responsive'
                ? 'bg-[#0E1116] text-white'
                : 'bg-[#FAFAF9] border border-[#E5E7EB] text-[#6B7280] hover:text-[#0E1116]'
            }`}
          >
            <Monitor className="w-3.5 h-3.5 shrink-0" />
            <span>Fluid View</span>
          </button>
        </div>
      </div>

      {/* Main Device Stage */}
      <div className="flex justify-center">
        <div 
          className={`relative bg-[#FAFAF9] transition-all overflow-hidden ${
            deviceMode === 'mobile'
              ? 'w-full max-w-[390px] h-[780px] rounded-[40px] border-[10px] border-[#0E1116] shadow-2xl flex flex-col'
              : 'w-full max-w-2xl h-[700px] rounded-[16px] border border-[#E5E7EB] shadow-xs flex flex-col'
          }`}
        >
          {/* Android Status Bar (for Mobile Frame) */}
          {deviceMode === 'mobile' && (
            <div className="h-9 px-6 bg-[#FAFAF9] flex items-center justify-between text-[11px] font-semibold text-[#0E1116] shrink-0 select-none">
              <span>9:41</span>
              {/* Dynamic Island / Camera cutout */}
              <div className="w-20 h-4 bg-[#0E1116] rounded-full mx-auto" />
              <div className="flex items-center space-x-1.5 text-[10px]">
                <span>5G</span>
                <span>100%</span>
              </div>
            </div>
          )}

          {/* Screen Content */}
          <div className="flex-1 flex flex-col overflow-hidden relative">
            {renderScreen()}

            {/* Modal Bottom Sheet: Screen 4 — SenderDetailSheet */}
            {activeSheetSender && (
              <div className="absolute inset-0 z-40 bg-black/40 flex flex-col justify-end animate-in fade-in duration-200">
                <div 
                  className="bg-white rounded-t-[20px] border-t border-[#E5E7EB] max-h-[85%] flex flex-col animate-in slide-in-from-bottom duration-200 shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Drag Handle */}
                  <div className="py-2.5 flex justify-center shrink-0 cursor-grab">
                    <div className="w-9 h-1 bg-[#E5E7EB] rounded-full" />
                  </div>

                  {/* Sheet Body */}
                  <div className="overflow-y-auto px-6 pb-6 pt-1 space-y-4">
                    {/* Header: Avatar + Sender info */}
                    <div className="flex items-center space-x-3">
                      {renderAvatar(activeSheetSender.name, 48)}
                      <div className="overflow-hidden">
                        <div className="text-xl font-semibold text-[#0E1116] truncate">
                          {activeSheetSender.name}
                        </div>
                        <div className="text-sm text-[#6B7280] truncate">
                          {activeSheetSender.email}
                        </div>
                      </div>
                    </div>

                    {/* Stat Rows */}
                    <div className="border-y border-[#E5E7EB] py-3 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-[#6B7280]">Emails</span>
                        <span className="font-semibold text-[#0E1116]">{activeSheetSender.messageCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#6B7280]">Unread</span>
                        <span className="font-semibold text-[#0E1116]">{activeSheetSender.unread ?? Math.floor(activeSheetSender.messageCount * 0.4)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#6B7280]">Last received</span>
                        <span className="font-semibold text-[#0E1116]">{activeSheetSender.lastReceived}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#6B7280]">Category</span>
                        <span className="font-semibold text-[#0E1116] capitalize">{activeSheetSender.category}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2 pt-1">
                      <button
                        onClick={() => {
                          onUnsubscribe(activeSheetSender);
                          setActiveSheetSender(prev => prev ? { ...prev, unsubscribed: true } : null);
                        }}
                        disabled={activeSheetSender.unsubscribed}
                        className="w-full h-12 bg-[#0F6E4F] active:bg-[#0A4F39] disabled:bg-[#0F6E4F]/40 text-white font-medium text-sm rounded-[10px] flex items-center justify-center transition-colors cursor-pointer"
                      >
                        {activeSheetSender.unsubscribed ? 'Unsubscribed' : 'Unsubscribe'}
                      </button>

                      <button
                        onClick={() => {
                          onBulkTrash(activeSheetSender);
                          setActiveSheetSender(prev => prev ? { ...prev, trashed: true } : null);
                        }}
                        disabled={activeSheetSender.trashed}
                        className="w-full h-12 bg-transparent border border-[#E5E7EB] text-[#0E1116] font-medium text-sm rounded-[10px] flex items-center justify-center hover:bg-[#FAFAF9] cursor-pointer"
                      >
                        {activeSheetSender.trashed ? 'Moved to Trash' : `Trash all ${activeSheetSender.messageCount} emails`}
                      </button>

                      <button
                        id="sender-sheet-assistant-action"
                        onClick={() => setShowAssistant(prev => !prev)}
                        className={`w-full h-12 border border-[#E5E7EB] text-[#0E1116] font-medium text-sm rounded-[10px] flex items-center justify-center space-x-2 transition-colors cursor-pointer ${
                          showAssistant ? 'bg-[#FAFAF9] border-[#0F6E4F]/40 text-[#0F6E4F]' : 'bg-transparent hover:bg-[#FAFAF9]'
                        }`}
                      >
                        <FileText className="w-4 h-4 text-[#0F6E4F]" />
                        <span>Thread Tools</span>
                      </button>
                    </div>

                    {/* Assistant Action Details (Ungrouped) */}
                    {showAssistant && (
                      <div className="space-y-3 pt-1">
                        <div className="flex space-x-1 bg-[#E5E7EB]/60 p-0.5 rounded-lg text-[11px]">
                          <button
                            onClick={() => setAiTab('summary')}
                            className={`px-2 py-0.5 rounded flex-1 text-center ${aiTab === 'summary' ? 'bg-white font-semibold text-[#0E1116]' : 'text-[#6B7280]'}`}
                          >
                            Summarize
                          </button>
                          <button
                            onClick={() => setAiTab('reply')}
                            className={`px-2 py-0.5 rounded flex-1 text-center ${aiTab === 'reply' ? 'bg-white font-semibold text-[#0E1116]' : 'text-[#6B7280]'}`}
                          >
                            Draft Reply
                          </button>
                        </div>

                        {aiTab === 'summary' ? (
                          <div className="space-y-2">
                            {aiSummary ? (
                              <div className="text-xs text-[#0E1116] whitespace-pre-line bg-white p-2.5 rounded-lg border border-[#E5E7EB]">
                                {aiSummary}
                              </div>
                            ) : (
                              <button
                                onClick={() => handleGenerateSummary(activeSheetSender)}
                                disabled={isAiLoading}
                                className="w-full py-2 bg-white border border-[#E5E7EB] text-xs font-medium text-[#0E1116] rounded-lg hover:bg-stone-50 flex items-center justify-center space-x-1 cursor-pointer"
                              >
                                <RefreshCw className={`w-3 h-3 ${isAiLoading ? 'animate-spin' : ''}`} />
                                <span>{isAiLoading ? 'Summarizing...' : 'Summarize Thread'}</span>
                              </button>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={replyIntent}
                              onChange={(e) => setReplyIntent(e.target.value)}
                              placeholder="Your reply intent..."
                              className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#E5E7EB] rounded-lg outline-none"
                            />
                            {aiReply ? (
                              <div className="space-y-1.5">
                                <div className="text-xs text-[#0E1116] whitespace-pre-line bg-white p-2.5 rounded-lg border border-[#E5E7EB]">
                                  <div className="font-semibold">{aiReply.subject}</div>
                                  <div className="mt-1 text-[#6B7280]">{aiReply.body}</div>
                                </div>
                                <div className="flex items-center justify-between text-[11px] text-[#0F6E4F]">
                                  <span className="flex items-center"><ShieldCheck className="w-3.5 h-3.5 mr-1" /> Guardrail #1 User Approval</span>
                                  <button 
                                    onClick={() => {
                                      navigator.clipboard.writeText(aiReply.body);
                                      setCopiedReply(true);
                                      setTimeout(() => setCopiedReply(false), 2000);
                                    }}
                                    className="text-[#0E1116] font-medium"
                                  >
                                    {copiedReply ? 'Copied!' : 'Copy'}
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleDraftReply(activeSheetSender)}
                                disabled={isAiLoading}
                                className="w-full py-2 bg-white border border-[#E5E7EB] text-xs font-medium text-[#0E1116] rounded-lg hover:bg-stone-50 flex items-center justify-center space-x-1 cursor-pointer"
                              >
                                <Send className={`w-3 h-3 ${isAiLoading ? 'animate-spin' : ''}`} />
                                <span>{isAiLoading ? 'Drafting...' : 'Draft Reply'}</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    <button
                      onClick={() => setActiveSheetSender(null)}
                      className="w-full py-2 text-sm text-[#6B7280] hover:text-[#0E1116] font-medium text-center"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Navigation Bar: Screen Navigation (BrumyBottomBar) */}
          {currentRoute !== 'onboarding' && (
            <div className="h-16 bg-white border-t border-[#E5E7EB] flex items-center justify-around shrink-0 px-4 select-none">
              {[
                { route: 'home', icon: Home, label: 'Home' },
                { route: 'senders', icon: Inbox, label: 'Senders' },
                { route: 'settings', icon: Settings, label: 'Settings' },
              ].map(({ route, icon: IconComponent, label }) => {
                const isSelected = currentRoute === route;
                return (
                  <button
                    key={route}
                    onClick={() => setCurrentRoute(route as typeof currentRoute)}
                    className="flex flex-col items-center justify-center flex-1 py-1 cursor-pointer transition-colors"
                  >
                    <div 
                      className={`px-4 py-1 rounded-full flex items-center justify-center transition-colors ${
                        isSelected ? 'bg-[#0F6E4F]/10 text-[#0F6E4F]' : 'text-[#6B7280]'
                      }`}
                    >
                      <IconComponent className={`w-5 h-5 ${isSelected ? 'text-[#0F6E4F]' : 'text-[#6B7280]'}`} />
                    </div>
                    <span className={`text-[11px] font-medium mt-0.5 ${isSelected ? 'text-[#0F6E4F]' : 'text-[#6B7280]'}`}>
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Android Home Navigation Bar Line (for Mobile Frame) */}
          {deviceMode === 'mobile' && (
            <div className="h-4 bg-white flex justify-center items-center shrink-0">
              <div className="w-32 h-1 bg-[#0E1116]/20 rounded-full" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
