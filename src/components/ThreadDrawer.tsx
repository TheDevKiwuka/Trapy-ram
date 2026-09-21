import React, { useState } from 'react';
import { 
  X, SlidersHorizontal, Send, FileText, CheckCircle, ShieldCheck, 
  Trash2, ExternalLink, RefreshCw, Copy, Check
} from 'lucide-react';
import { Sender, EmailMessage, Task3Output, Task4Output, Task5Output } from '../types';

interface ThreadDrawerProps {
  sender: Sender | null;
  sampleMessages: EmailMessage[];
  onClose: () => void;
  onUnsubscribe: (sender: Sender) => void;
  onBulkTrash: (sender: Sender) => void;
}

export const ThreadDrawer: React.FC<ThreadDrawerProps> = ({
  sender,
  sampleMessages,
  onClose,
  onUnsubscribe,
  onBulkTrash,
}) => {
  const [activeAITab, setActiveAITab] = useState<'summary' | 'reply' | 'cleanup'>('summary');
  
  // AI states
  const [isGenerating, setIsGenerating] = useState(false);
  const [summaryResult, setSummaryResult] = useState<Task3Output | null>(null);
  const [replyResult, setReplyResult] = useState<Task4Output | null>(null);
  const [cleanupResult, setCleanupResult] = useState<Task5Output | null>(null);
  const [copiedBody, setCopiedBody] = useState(false);

  // Reply configuration inputs
  const [replyIntent, setReplyIntent] = useState('Acknowledge receipt and express interest in connecting next week');
  const [replyTone, setReplyTone] = useState<'professional' | 'casual' | 'brief'>('professional');

  if (!sender) return null;

  // Filter messages for this sender or use sample
  const relevantMessages = sampleMessages.filter(m => m.senderId === sender.id || m.senderEmail === sender.email);
  const currentMessage = relevantMessages[0] || {
    subject: sender.sampleSubjects[0] || 'Latest Update',
    snippet: 'Email thread content loaded from Gmail scan...',
    body: `Sender: ${sender.name} (${sender.email})\nRecent Subject: ${sender.sampleSubjects[0]}\n\nHello,\n\nWe wanted to share our latest announcements and system updates with your team.\n\nBest regards,\n${sender.name}`,
    date: sender.lastReceived,
  };

  // Run Task 3: Thread Summary
  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/task3-summarize-thread', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          thread: [
            {
              from: `${sender.name} <${sender.email}>`,
              date: sender.lastReceived,
              subject: currentMessage.subject,
              body: currentMessage.body || currentMessage.snippet,
            }
          ]
        }),
      });
      const data = await res.json();
      setSummaryResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Run Task 4: Reply Drafting
  const handleGenerateReply = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/task4-draft-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          thread: [
            {
              from: `${sender.name} <${sender.email}>`,
              subject: currentMessage.subject,
              body: currentMessage.body || currentMessage.snippet,
            }
          ],
          userIntent: replyIntent,
          tone: replyTone,
        }),
      });
      const data = await res.json();
      setReplyResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Run Task 5: Cleanup Suggestion
  const handleGenerateCleanup = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/task5-cleanup-suggestion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: sender.email,
          stats: {
            totalEmailsReceived: sender.messageCount,
            openedLast90Days: sender.category === 'personal' ? 8 : 1,
            daysSinceLastInteraction: sender.category === 'personal' ? 2 : 120,
          },
          recentSubjects: sender.sampleSubjects,
        }),
      });
      const data = await res.json();
      setCleanupResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyDraft = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBody(true);
    setTimeout(() => setCopiedBody(false), 2000);
  };

  return (
    <div id="thread-drawer-overlay" className="fixed inset-0 z-50 overflow-hidden bg-stone-900/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-2xl bg-white dark:bg-[#171A21] text-stone-900 dark:text-stone-100 h-full shadow-2xl flex flex-col border-l border-stone-200 dark:border-stone-800 animate-in slide-in-from-right duration-200 transition-colors">
        
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50/70 dark:bg-stone-800/40">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 flex items-center justify-center font-bold text-sm">
              {sender.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="font-bold text-stone-900 dark:text-stone-100 text-base">{sender.name}</h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">{sender.email}</p>
            </div>
          </div>

          <button
            id="close-thread-drawer-btn"
            onClick={onClose}
            className="p-2 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Sender Overview Card */}
          <div className="bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-800 rounded-xl p-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500">Sender Stats</span>
              <div className="text-sm font-medium text-stone-800 dark:text-stone-200">
                <span className="font-bold text-stone-900 dark:text-stone-100">{sender.messageCount} emails</span> in inbox • Category: <span className="capitalize font-semibold">{sender.category}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => onUnsubscribe(sender)}
                disabled={sender.unsubscribed || sender.unsubscribeMethod === 'none'}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors disabled:opacity-50"
              >
                {sender.unsubscribed ? (
                  <span className="inline-flex items-center">
                    <Check className="w-3.5 h-3.5 mr-1" />
                    Unsubscribed
                  </span>
                ) : (
                  'Unsubscribe'
                )}
              </button>
              <button
                onClick={() => onBulkTrash(sender)}
                disabled={sender.trashed}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-stone-800 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors disabled:opacity-50"
              >
                {sender.trashed ? 'In Trash' : 'Move to Trash'}
              </button>
            </div>
          </div>

          {/* Email Preview Snippet */}
          <div className="border border-stone-200 dark:border-stone-800 rounded-xl p-4 bg-white dark:bg-stone-800/40 space-y-2">
            <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
              <span className="font-semibold text-stone-800 dark:text-stone-200">Sample Thread Preview</span>
              <span>{new Date(currentMessage.date).toLocaleDateString()}</span>
            </div>
            <div className="text-sm font-semibold text-stone-900 dark:text-stone-100">{currentMessage.subject}</div>
            <div className="text-xs text-stone-600 dark:text-stone-300 bg-stone-50 dark:bg-stone-900/60 p-3.5 rounded-lg border border-stone-100 dark:border-stone-800 whitespace-pre-wrap max-h-40 overflow-y-auto leading-relaxed">
              {currentMessage.body || currentMessage.snippet}
            </div>
          </div>

          {/* Thread Tools Tabs */}
          <div className="border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800/30 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <SlidersHorizontal className="w-4 h-4 text-[#0F6E4F] dark:text-[#34D399]" />
                <h3 className="font-semibold text-stone-900 dark:text-stone-100 text-sm">Thread Tools</h3>
              </div>
            </div>

            <div className="flex items-center space-x-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl mb-4 text-xs font-medium">
              <button
                onClick={() => setActiveAITab('summary')}
                className={`flex-1 py-1.5 rounded-lg text-center transition-colors ${
                  activeAITab === 'summary' ? 'bg-white dark:bg-[#171A21] text-stone-900 dark:text-stone-100 shadow-xs font-semibold' : 'text-stone-600 dark:text-stone-400'
                }`}
              >
                Summarize
              </button>
              <button
                onClick={() => setActiveAITab('reply')}
                className={`flex-1 py-1.5 rounded-lg text-center transition-colors ${
                  activeAITab === 'reply' ? 'bg-white dark:bg-[#171A21] text-stone-900 dark:text-stone-100 shadow-xs font-semibold' : 'text-stone-600 dark:text-stone-400'
                }`}
              >
                Draft Reply
              </button>
              <button
                onClick={() => setActiveAITab('cleanup')}
                className={`flex-1 py-1.5 rounded-lg text-center transition-colors ${
                  activeAITab === 'cleanup' ? 'bg-white dark:bg-[#171A21] text-stone-900 dark:text-stone-100 shadow-xs font-semibold' : 'text-stone-600 dark:text-stone-400'
                }`}
              >
                Cleanup Advice
              </button>
            </div>

            {/* TAB 1: SUMMARY */}
            {activeAITab === 'summary' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-stone-600 dark:text-stone-400">
                    Extracts up to 3 bullets, deadlines, action items, and recommended inbox action.
                  </p>
                  <button
                    id="run-summary-btn"
                    onClick={handleGenerateSummary}
                    disabled={isGenerating}
                    className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isGenerating ? 'animate-spin' : ''}`} />
                    {summaryResult ? 'Re-generate' : 'Generate Summary'}
                  </button>
                </div>

                {summaryResult && (
                  <div className="bg-white dark:bg-stone-900/60 p-4 rounded-xl border border-stone-200 dark:border-stone-800 space-y-3 text-xs">
                    <div>
                      <span className="font-bold text-stone-800 dark:text-stone-200 uppercase tracking-wider text-[10px]">Summary (Max 3 Bullets)</span>
                      <div className="mt-1 text-stone-700 dark:text-stone-300 whitespace-pre-wrap leading-relaxed">
                        {summaryResult.summary}
                      </div>
                    </div>

                    {summaryResult.action_items?.length > 0 && (
                      <div>
                        <span className="font-bold text-stone-800 dark:text-stone-200 uppercase tracking-wider text-[10px]">Action Items</span>
                        <ul className="list-disc list-inside mt-0.5 text-stone-600 dark:text-stone-400">
                          {summaryResult.action_items.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {summaryResult.deadlines?.length > 0 && (
                      <div>
                        <span className="font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider text-[10px]">Deadlines Detected</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {summaryResult.deadlines.map((dl, i) => (
                            <span key={i} className="px-2 py-0.5 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 rounded font-medium">
                              {dl}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                      <span className="text-stone-500 dark:text-stone-400">Recommended Action:</span>
                      <span className="font-bold capitalize px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200">
                        {summaryResult.recommended_action}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: REPLY DRAFTING */}
            {activeAITab === 'reply' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">What do you want to say?</label>
                  <input
                    type="text"
                    value={replyIntent}
                    onChange={(e) => setReplyIntent(e.target.value)}
                    placeholder="e.g. Confirm the time slot, or politely decline..."
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none text-stone-900 dark:text-stone-100 placeholder:text-stone-400"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-stone-500 dark:text-stone-400 mr-1">Tone:</span>
                    {(['professional', 'casual', 'brief'] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setReplyTone(t)}
                        className={`px-2 py-1 rounded text-xs capitalize ${
                          replyTone === t
                            ? 'bg-amber-600 text-white font-medium'
                            : 'bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  <button
                    id="run-reply-btn"
                    onClick={handleGenerateReply}
                    disabled={isGenerating || !replyIntent.trim()}
                    className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-colors disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5 mr-1.5" />
                    {replyResult ? 'Re-draft' : 'Draft Reply'}
                  </button>
                </div>

                {replyResult && (
                  <div className="bg-white dark:bg-stone-900/60 p-4 rounded-xl border border-stone-200 dark:border-stone-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5 text-xs text-emerald-700 dark:text-emerald-300 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Guardrail #1: Requires User Approval</span>
                      </div>
                      <button
                        onClick={() => copyDraft(replyResult.body)}
                        className="inline-flex items-center text-xs text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200"
                      >
                        {copiedBody ? <Check className="w-3.5 h-3.5 mr-1 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                        {copiedBody ? 'Copied!' : 'Copy Draft'}
                      </button>
                    </div>

                    <div className="space-y-1">
                      <div className="text-xs font-medium text-stone-500 dark:text-stone-400">Subject: <span className="font-semibold text-stone-800 dark:text-stone-200">{replyResult.subject}</span></div>
                      <div className="text-xs text-stone-700 dark:text-stone-300 bg-stone-50 dark:bg-stone-900 p-3 rounded-lg border border-stone-100 dark:border-stone-800 whitespace-pre-wrap leading-relaxed">
                        {replyResult.body}
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-end">
                      <button
                        onClick={() => alert('Reply draft ready. In MVP, you review and paste into Gmail or approve sending.')}
                        className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 dark:bg-stone-700 dark:hover:bg-stone-600 text-white text-xs font-semibold rounded-lg shadow-xs"
                      >
                        Approve & Send via Gmail
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: CLEANUP SUGGESTION */}
            {activeAITab === 'cleanup' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-stone-600 dark:text-stone-400">
                    Brumy evaluates sender volume vs interaction frequency to recommend the best cleanup tactic.
                  </p>
                  <button
                    id="run-cleanup-btn"
                    onClick={handleGenerateCleanup}
                    disabled={isGenerating}
                    className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isGenerating ? 'animate-spin' : ''}`} />
                    {cleanupResult ? 'Re-evaluate' : 'Get Recommendation'}
                  </button>
                </div>

                {cleanupResult && (
                  <div className="bg-white dark:bg-stone-900/60 p-4 rounded-xl border border-stone-200 dark:border-stone-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">Recommendation:</span>
                      <span className={`text-xs font-bold uppercase px-2.5 py-0.5 rounded-md border ${
                        cleanupResult.recommendation === 'unsubscribe'
                          ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                          : cleanupResult.recommendation === 'trash'
                          ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                          : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                      }`}>
                        {cleanupResult.recommendation}
                      </span>
                    </div>

                    <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed bg-stone-50 dark:bg-stone-900 p-3 rounded-lg border border-stone-100 dark:border-stone-800">
                      {cleanupResult.reason}
                    </p>

                    <div className="text-[11px] text-stone-400 dark:text-stone-500">
                      Confidence: {Math.round(cleanupResult.confidence * 100)}% • Compliant with Guardrail #2 (no permanent deletion)
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/40 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
          <span>Target Sender: {sender.domain}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-700 dark:text-stone-200 font-medium hover:bg-stone-100 dark:hover:bg-stone-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
