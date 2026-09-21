import React, { useState, useMemo } from 'react';
import { 
  Search, Trash2, Check, RefreshCw, X, 
  CheckSquare, Square, ArrowUpDown, FileText, 
  RotateCcw, ShieldCheck, Mail, ShieldAlert, Lock
} from 'lucide-react';
import { Sender, SenderCategory, UserAccount } from '../types';
import { triggerHapticFeedback } from '../utils/haptics';

interface InboxCleanupProps {
  senders: Sender[];
  onUnsubscribe: (sender: Sender) => void;
  onBulkTrash: (sender: Sender) => void;
  onBatchUnsubscribe?: (senders: Sender[]) => void;
  onBatchTrash?: (senders: Sender[]) => void;
  onToggleWhitelist?: (sender: Sender) => void;
  onSelectSenderForAI: (sender: Sender) => void;
  onRescanInbox: () => void;
  isScanning: boolean;
  unsubCount: number;
  maxFreeUnsubs: number;
  currentUser?: UserAccount | null;
  onRequestPermission?: () => void;
}

export const InboxCleanup: React.FC<InboxCleanupProps> = ({
  senders,
  onUnsubscribe,
  onBulkTrash,
  onBatchUnsubscribe,
  onBatchTrash,
  onSelectSenderForAI,
  onRescanInbox,
  isScanning,
  unsubCount,
  maxFreeUnsubs,
  currentUser,
  onRequestPermission,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'volume-desc' | 'volume-asc' | 'name-asc'>('volume-desc');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [confirmTrashSender, setConfirmTrashSender] = useState<Sender | null>(null);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: senders.length,
      newsletter: 0,
      promotion: 0,
      spam: 0,
      transactional: 0,
      personal: 0,
    };
    senders.forEach(s => {
      if (counts[s.category] !== undefined) {
        counts[s.category]++;
      }
    });
    return counts;
  }, [senders]);

  // Filtered and sorted senders
  const filteredSenders = useMemo(() => {
    const list = senders.filter(s => {
      const matchesSearch = 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.domain.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || s.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    return list.sort((a, b) => {
      if (sortBy === 'volume-desc') return b.messageCount - a.messageCount;
      if (sortBy === 'volume-asc') return a.messageCount - b.messageCount;
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [senders, searchQuery, selectedCategory, sortBy]);

  const totalClutterEmails = senders.reduce((acc, s) => acc + s.messageCount, 0);
  const totalCleanedEmails = senders
    .filter(s => s.trashed)
    .reduce((acc, s) => acc + s.messageCount, 0);
  const totalUnsubscribed = senders.filter(s => s.unsubscribed).length;
  const reclaimableMB = ((totalClutterEmails * 55) / 1024).toFixed(0);

  // Multi-select handlers
  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedIds.size === filteredSenders.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredSenders.map(s => s.id)));
    }
  };

  const selectedSenders = useMemo(() => {
    return senders.filter(s => selectedIds.has(s.id));
  }, [senders, selectedIds]);

  const selectedTotalEmails = useMemo(() => {
    return selectedSenders.reduce((acc, s) => acc + s.messageCount, 0);
  }, [selectedSenders]);

  const handleExecuteBatchUnsubscribe = () => {
    if (onBatchUnsubscribe) {
      onBatchUnsubscribe(selectedSenders);
    } else {
      selectedSenders.forEach(s => {
        if (!s.unsubscribed && s.unsubscribeMethod !== 'none') {
          onUnsubscribe(s);
        }
      });
    }
    setSelectedIds(new Set());
  };

  const handleExecuteBatchTrash = () => {
    if (onBatchTrash) {
      onBatchTrash(selectedSenders);
    } else {
      selectedSenders.forEach(s => {
        if (!s.trashed) {
          onBulkTrash(s);
        }
      });
    }
    setSelectedIds(new Set());
  };

  const getCategoryLabel = (cat: SenderCategory) => {
    switch (cat) {
      case 'newsletter': return 'Newsletter';
      case 'promotion': return 'Promotion';
      case 'spam': return 'Spam';
      case 'transactional': return 'Updates';
      case 'personal': return 'Personal';
      default: return cat;
    }
  };

  // If user is logged in but permission to access their email has not been granted yet
  if (currentUser && currentUser.emailAccessGranted === false) {
    return (
      <div id="inbox-permission-gate" className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-6 w-full text-stone-900 dark:text-stone-100">
        <div className="bg-white dark:bg-[#171A21] rounded-2xl border border-stone-200 dark:border-stone-800 p-8 sm:p-10 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center text-amber-600 dark:text-amber-400 mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
              Email Access Permission Required
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
              Before Brumy can start scanning your inbox, detecting newsletters, or organizing clutter, we ask for your explicit permission. If access is granted, we connect to <strong className="text-stone-800 dark:text-stone-200">{currentUser.email}</strong>.
            </p>
          </div>

          <div className="bg-stone-50 dark:bg-stone-850 rounded-xl p-4 max-w-md mx-auto text-left border border-stone-100 dark:border-stone-800 space-y-2 text-xs">
            <div className="flex items-center text-stone-700 dark:text-stone-300">
              <Check className="w-3.5 h-3.5 mr-2 text-emerald-600 shrink-0" />
              <span>Permission is requested before starting any inbox work</span>
            </div>
            <div className="flex items-center text-stone-700 dark:text-stone-300">
              <Check className="w-3.5 h-3.5 mr-2 text-emerald-600 shrink-0" />
              <span>You can allow or deny permission at any time</span>
            </div>
            <div className="flex items-center text-stone-700 dark:text-stone-300">
              <Check className="w-3.5 h-3.5 mr-2 text-emerald-600 shrink-0" />
              <span>Zero email content or personal passwords are saved</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              id="open-permission-popup-btn"
              onClick={onRequestPermission}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#0F6E4F] hover:bg-[#0c593f] text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Review Permission Request</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="inbox-cleanup-container" className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6 w-full text-stone-900 dark:text-stone-100">
      {/* 1. Calm, Human-Friendly Overview Card */}
      <div className="bg-white dark:bg-[#171A21] rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-xs transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
              Clean your inbox
            </h1>
            <p className="text-sm text-stone-600 dark:text-stone-400">
              You have <strong className="text-stone-900 dark:text-stone-200 font-semibold">{senders.length} senders</strong> filling your inbox with <strong className="text-stone-900 dark:text-stone-200 font-semibold">{totalClutterEmails.toLocaleString()} emails</strong> (~{reclaimableMB} MB).
            </p>
          </div>

          <button
            id="rescan-inbox-btn"
            onClick={onRescanInbox}
            disabled={isScanning}
            className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-semibold bg-stone-50 hover:bg-stone-100 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-700 transition-colors shrink-0 disabled:opacity-50 whitespace-nowrap self-start sm:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-2 ${isScanning ? 'animate-spin' : ''}`} />
            {isScanning ? 'Checking mail...' : 'Refresh Inbox'}
          </button>
        </div>

        {/* Quick summary stats in calm pills */}
        <div className="flex flex-wrap items-center gap-3 pt-4 mt-4 border-t border-stone-100 dark:border-stone-800 text-xs">
          <div className="flex items-center space-x-1.5 text-stone-600 dark:text-stone-300 bg-stone-50 dark:bg-stone-800/60 px-3 py-1.5 rounded-lg border border-stone-200/60 dark:border-stone-700">
            <Mail className="w-3.5 h-3.5 text-stone-400" />
            <span><strong>{totalClutterEmails}</strong> total emails found</span>
          </div>
          <div className="flex items-center space-x-1.5 text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1.5 rounded-lg border border-emerald-200/60 dark:border-emerald-800/60">
            <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span><strong>{totalUnsubscribed}</strong> unsubscribed</span>
          </div>
          {totalCleanedEmails > 0 && (
            <div className="flex items-center space-x-1.5 text-rose-800 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50 px-3 py-1.5 rounded-lg border border-rose-200/60 dark:border-rose-800/60">
              <Trash2 className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              <span><strong>{totalCleanedEmails}</strong> moved to Trash</span>
            </div>
          )}
          <div className="text-stone-400 dark:text-stone-500 text-xs ml-auto hidden sm:block">
            Safe: Trash is held for 30 days before deleting
          </div>
        </div>
      </div>

      {/* 2. Simple Controls: Search & Category Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="sender-search-input"
            type="text"
            placeholder="Search sender or brand..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-white dark:bg-[#171A21] border border-stone-200 dark:border-stone-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0F6E4F]/20 focus:border-[#0F6E4F] text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort */}
        <div className="flex items-center space-x-2 shrink-0">
          <span className="text-xs text-stone-500 dark:text-stone-400">Sort by:</span>
          <select
            id="sort-by-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-white dark:bg-[#171A21] border border-stone-200 dark:border-stone-800 rounded-xl px-3 py-1.5 text-xs text-stone-700 dark:text-stone-300 font-medium focus:outline-none focus:ring-1 focus:ring-stone-400 shadow-xs"
          >
            <option value="volume-desc">Most emails first</option>
            <option value="volume-asc">Fewest emails first</option>
            <option value="name-asc">Sender name (A–Z)</option>
          </select>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'all', label: 'All Senders', count: categoryCounts.all },
          { id: 'newsletter', label: 'Newsletters', count: categoryCounts.newsletter },
          { id: 'promotion', label: 'Promotions', count: categoryCounts.promotion },
          { id: 'spam', label: 'Spam', count: categoryCounts.spam },
          { id: 'transactional', label: 'Updates', count: categoryCounts.transactional },
        ].map((tab) => (
          <button
            key={tab.id}
            id={`filter-tab-${tab.id}`}
            onClick={() => setSelectedCategory(tab.id)}
            className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
              selectedCategory === tab.id
                ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-xs'
                : 'bg-white dark:bg-[#171A21] border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              selectedCategory === tab.id 
                ? 'bg-stone-700 dark:bg-stone-300 text-white dark:text-stone-900' 
                : 'bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* 3. Senders List */}
      <div className="bg-white dark:bg-[#171A21] rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-xs w-full transition-colors">
        {/* Table Header: Select All & Count */}
        <div className="px-5 py-3 bg-stone-50/60 dark:bg-stone-800/40 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
          <button
            onClick={handleSelectAll}
            className="flex items-center space-x-2 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white transition-colors font-medium"
          >
            {selectedIds.size > 0 && selectedIds.size === filteredSenders.length ? (
              <CheckSquare className="w-4 h-4 text-[#0F6E4F] dark:text-[#34D399]" />
            ) : (
              <Square className="w-4 h-4 text-stone-400" />
            )}
            <span>Select All ({filteredSenders.length})</span>
          </button>

          <span className="text-stone-400 dark:text-stone-500 text-[11px] hidden sm:inline">
            Tip: Click any sender to preview emails and thread details
          </span>
        </div>

        {/* Sender Rows */}
        <div className="divide-y divide-stone-100 dark:divide-stone-800/70">
          {filteredSenders.length === 0 ? (
            <div className="text-center py-16 px-4">
              <Mail className="w-8 h-8 mx-auto text-stone-300 dark:text-stone-600 mb-2" />
              <p className="font-semibold text-stone-700 dark:text-stone-300 text-sm">No senders match this filter</p>
              <p className="text-xs text-stone-400 dark:text-stone-500 mt-1">Try changing your search keywords or switching back to &quot;All Senders&quot;.</p>
            </div>
          ) : (
            filteredSenders.map((sender) => {
              const isSelected = selectedIds.has(sender.id);

              return (
                <div
                  key={sender.id}
                  id={`sender-row-${sender.id}`}
                  className={`px-5 py-4 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isSelected 
                      ? 'bg-amber-50/50 dark:bg-amber-950/20' 
                      : sender.trashed 
                        ? 'bg-stone-50/70 dark:bg-stone-900/40 opacity-60' 
                        : 'hover:bg-stone-50/50 dark:hover:bg-stone-800/40'
                  }`}
                >
                  {/* Left: Checkbox + Sender info */}
                  <div className="flex items-start space-x-3 min-w-0 flex-1">
                    <button
                      onClick={() => handleToggleSelect(sender.id)}
                      className="mt-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 shrink-0"
                      title="Select for batch action"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-[#0F6E4F] dark:text-[#34D399]" />
                      ) : (
                        <Square className="w-4 h-4 text-stone-300 dark:text-stone-600" />
                      )}
                    </button>

                    {/* Sender Avatar */}
                    <div 
                      onClick={() => onSelectSenderForAI(sender)}
                      className="w-9 h-9 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-center text-xs font-bold text-stone-700 dark:text-stone-200 shrink-0 cursor-pointer select-none hover:border-stone-300 dark:hover:border-stone-600"
                    >
                      {sender.name.slice(0, 2).toUpperCase()}
                    </div>

                    {/* Text Details */}
                    <div 
                      onClick={() => onSelectSenderForAI(sender)}
                      className="min-w-0 flex-1 cursor-pointer space-y-0.5"
                    >
                      <div className="flex items-center space-x-2 flex-wrap gap-y-0.5">
                        <span className="font-semibold text-stone-900 dark:text-stone-100 text-sm hover:text-[#0F6E4F] dark:hover:text-[#34D399] transition-colors">
                          {sender.name}
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-medium">
                          {getCategoryLabel(sender.category)}
                        </span>
                        {sender.unsubscribed && (
                          <span className="inline-flex items-center text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-medium border border-emerald-200 dark:border-emerald-800">
                            <Check className="w-3 h-3 mr-1" /> Unsubscribed
                          </span>
                        )}
                        {sender.trashed && (
                          <span className="inline-flex items-center text-[11px] px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-medium border border-rose-200 dark:border-rose-800">
                            <Trash2 className="w-3 h-3 mr-1" /> In Trash
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-stone-500 dark:text-stone-400 truncate">
                        {sender.email}
                      </p>

                      {sender.sampleSubjects && sender.sampleSubjects[0] && (
                        <p className="text-xs text-stone-400 dark:text-stone-500 truncate italic">
                          &quot;{sender.sampleSubjects[0]}&quot;
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Email count & Clear Action Buttons */}
                  <div className="flex items-center space-x-2 sm:space-x-2.5 sm:self-center shrink-0 flex-wrap sm:flex-nowrap gap-y-1.5 pl-7 sm:pl-0">
                    {/* Volume pill */}
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 whitespace-nowrap">
                      {sender.messageCount} emails
                    </span>

                    {/* 1-Click Unsubscribe Button */}
                    <button
                      id={`unsub-btn-${sender.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onUnsubscribe(sender);
                      }}
                      disabled={sender.unsubscribed}
                      className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold transition-all active:scale-95 ${
                        sender.unsubscribed
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 cursor-default'
                          : 'bg-[#0F6E4F] hover:bg-[#0c593f] text-white shadow-xs'
                      }`}
                    >
                      {sender.unsubscribed ? (
                        <>
                          <Check className="w-3 h-3 mr-1" />
                          Unsubscribed
                        </>
                      ) : (
                        'Unsubscribe'
                      )}
                    </button>

                    {/* Trash Button */}
                    <button
                      id={`trash-btn-${sender.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmTrashSender(sender);
                      }}
                      className="inline-flex items-center px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-stone-800 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/50 dark:hover:text-rose-300 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 transition-colors shadow-xs"
                      title={`Move ${sender.messageCount} emails from ${sender.name} to Trash`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Thread Preview & Details Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectSenderForAI(sender);
                      }}
                      className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                      title="Inspect sender emails and thread details"
                    >
                      <FileText className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 4. Floating Batch Action Bar for Easy One-Tap Cleanup */}
      {selectedSenders.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-stone-900 dark:bg-stone-800 text-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl shadow-2xl border border-stone-700 flex items-center space-x-2.5 sm:space-x-4 animate-in fade-in slide-in-from-bottom duration-200 max-w-[calc(100vw-1.5rem)] flex-wrap justify-center gap-y-2">
          <span className="text-xs font-medium whitespace-nowrap">
            <strong className="text-white font-bold">{selectedSenders.length}</strong> selected ({selectedTotalEmails} emails)
          </span>

          <div className="h-4 w-px bg-stone-700 hidden sm:block" />

          <button
            id="batch-unsub-btn"
            onClick={handleExecuteBatchUnsubscribe}
            className="px-3 py-1.5 rounded-xl bg-[#0F6E4F] hover:bg-[#0d5e43] text-white text-xs font-semibold shadow-xs transition-colors whitespace-nowrap"
          >
            Unsubscribe All
          </button>

          <button
            id="batch-trash-btn"
            onClick={handleExecuteBatchTrash}
            className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition-colors whitespace-nowrap"
          >
            Move All to Trash
          </button>

          <button
            onClick={() => setSelectedIds(new Set())}
            className="text-stone-400 hover:text-white text-xs font-medium transition-colors px-1"
          >
            Clear
          </button>
        </div>
      )}

      {/* Trash Confirmation Modal */}
      {confirmTrashSender && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#171A21] rounded-2xl p-6 max-w-sm w-full border border-stone-200 dark:border-stone-800 shadow-2xl space-y-4">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
              <Trash2 className="w-5 h-5" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                Move {confirmTrashSender.messageCount} emails to Trash?
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                All emails from <strong className="text-stone-800 dark:text-stone-200">{confirmTrashSender.name}</strong> will be moved to your Gmail Trash. You can undo and restore them anytime within 30 days.
              </p>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setConfirmTrashSender(null)}
                className="px-3.5 py-2 rounded-xl text-xs font-medium text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onBulkTrash(confirmTrashSender);
                  setConfirmTrashSender(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white transition-colors shadow-xs"
              >
                Move to Trash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
