import React, { useState } from 'react';
import { 
  Trash2, RotateCcw, Download, Clock, Search, Mail, Check
} from 'lucide-react';
import { Sender, ActionLog } from '../types';

interface ActivityTrashViewProps {
  senders: Sender[];
  actionLogs: ActionLog[];
  onRestoreSender: (sender: Sender) => void;
  onClearLogs?: () => void;
}

export const ActivityTrashView: React.FC<ActivityTrashViewProps> = ({
  senders,
  actionLogs,
  onRestoreSender,
}) => {
  const [activeTab, setActiveTab] = useState<'trash' | 'history'>('trash');
  const [searchQuery, setSearchQuery] = useState('');

  const trashedSenders = senders.filter(s => s.trashed);
  const totalTrashedEmails = trashedSenders.reduce((acc, s) => acc + s.messageCount, 0);

  // Filtered trash items
  const filteredTrash = trashedSenders.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filtered logs
  const filteredLogs = actionLogs.filter(log =>
    log.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (log.details && log.details.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleExportHistory = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(actionLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `brumy_history_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const formatLogAction = (log: ActionLog) => {
    if (log.action === 'unsubscribe') {
      return {
        title: `Unsubscribed from ${log.target}`,
        icon: <Check className="w-3.5 h-3.5 text-emerald-600" />,
        badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      };
    }
    if (log.action === 'bulk_trash') {
      return {
        title: `Moved emails from ${log.target} to Trash`,
        icon: <Trash2 className="w-3.5 h-3.5 text-rose-600" />,
        badgeClass: 'bg-rose-50 text-rose-800 border-rose-200',
      };
    }
    return {
      title: `Analyzed ${log.target}`,
      icon: <Mail className="w-3.5 h-3.5 text-blue-600" />,
      badgeClass: 'bg-stone-50 text-stone-700 border-stone-200',
    };
  };

  return (
    <div id="activity-trash-view" className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6 w-full text-stone-900 dark:text-stone-100">
      {/* 1. Human reassurance banner */}
      <div className="bg-white dark:bg-[#171A21] rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-xs transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
              Trash &amp; History
            </h1>
            <p className="text-sm text-stone-600 dark:text-stone-400">
              Items moved to trash stay safely in your Gmail Trash for 30 days. You can restore any sender back to your inbox anytime.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              id="export-history-btn"
              onClick={handleExportHistory}
              className="inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-semibold bg-stone-50 hover:bg-stone-100 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-700 transition-colors shadow-xs whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Download History
            </button>
          </div>
        </div>

        {/* Quick Summary Pill Row */}
        <div className="flex flex-wrap items-center gap-3 pt-4 mt-4 border-t border-stone-100 dark:border-stone-800 text-xs">
          <div className="flex items-center space-x-1.5 text-stone-700 dark:text-stone-300 bg-stone-50 dark:bg-stone-800/60 px-3 py-1.5 rounded-lg border border-stone-200/60 dark:border-stone-700">
            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
            <span><strong>{totalTrashedEmails}</strong> emails in Trash</span>
          </div>
          <div className="flex items-center space-x-1.5 text-stone-700 dark:text-stone-300 bg-stone-50 dark:bg-stone-800/60 px-3 py-1.5 rounded-lg border border-stone-200/60 dark:border-stone-700">
            <Clock className="w-3.5 h-3.5 text-stone-400" />
            <span><strong>30 days</strong> safety recovery window</span>
          </div>
        </div>
      </div>

      {/* 2. Navigation Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-1 bg-stone-200/60 dark:bg-stone-800 p-1 rounded-xl text-xs font-medium">
          <button
            id="tab-trash"
            onClick={() => setActiveTab('trash')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg transition-all ${
              activeTab === 'trash'
                ? 'bg-white dark:bg-[#171A21] text-stone-900 dark:text-stone-100 shadow-xs font-semibold'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
            <span>Trash ({trashedSenders.length})</span>
          </button>

          <button
            id="tab-history"
            onClick={() => setActiveTab('history')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg transition-all ${
              activeTab === 'history'
                ? 'bg-white dark:bg-[#171A21] text-stone-900 dark:text-stone-100 shadow-xs font-semibold'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400" />
            <span>Recent Activity ({actionLogs.length})</span>
          </button>
        </div>

        <div className="relative flex-1 max-w-xs">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="activity-search-input"
            type="text"
            placeholder="Search trash or history..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-[#171A21] border border-stone-200 dark:border-stone-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0F6E4F]/20 focus:border-[#0F6E4F] text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 shadow-xs"
          />
        </div>
      </div>

      {/* Tab 1: Trash Recovery */}
      {activeTab === 'trash' && (
        <div className="bg-white dark:bg-[#171A21] rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-xs w-full transition-colors">
          <div className="px-6 py-4 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
            <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100">
              Senders in Gmail Trash ({filteredTrash.length})
            </h2>
            <span className="text-xs text-stone-500 dark:text-stone-400">
              Click &quot;Restore&quot; to move emails back to your Inbox
            </span>
          </div>

          <div className="divide-y divide-stone-100 dark:divide-stone-800/70">
            {filteredTrash.length === 0 ? (
              <div className="text-center py-16 px-4">
                <Trash2 className="w-8 h-8 mx-auto text-stone-300 dark:text-stone-600 mb-2" />
                <p className="font-semibold text-stone-700 dark:text-stone-300 text-sm">Your Trash list is empty</p>
                <p className="text-xs text-stone-400 dark:text-stone-500 mt-1">
                  When you clean up senders from the Clean Inbox tab, they will appear here so you can easily undo.
                </p>
              </div>
            ) : (
              filteredTrash.map((sender) => (
                <div
                  key={sender.id}
                  id={`trash-item-${sender.id}`}
                  className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-stone-50/50 dark:hover:bg-stone-800/40 transition-colors"
                >
                  <div className="flex items-start space-x-3.5">
                    <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-100 dark:border-rose-900/40 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-stone-900 dark:text-stone-100 text-sm">{sender.name}</span>
                        <span className="text-xs text-stone-500 dark:text-stone-400">• {sender.email}</span>
                      </div>
                      <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                        <strong className="text-rose-600 dark:text-rose-400 font-semibold">{sender.messageCount} emails</strong> in Trash · Available to restore for 29 more days
                      </p>
                    </div>
                  </div>

                  <button
                    id={`restore-btn-${sender.id}`}
                    onClick={() => onRestoreSender(sender)}
                    className="inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#0F6E4F] hover:bg-[#0c593f] text-white shadow-xs transition-all self-start sm:self-center shrink-0 active:scale-95"
                  >
                    <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                    Restore to Inbox
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Recent Activity Timeline */}
      {activeTab === 'history' && (
        <div className="bg-white dark:bg-[#171A21] rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-xs w-full transition-colors">
          <div className="px-6 py-4 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
            <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100">
              Recent Actions ({filteredLogs.length})
            </h2>
            <span className="text-xs text-stone-500 dark:text-stone-400">
              Clean, automatic record of your unsubscriptions and trashing
            </span>
          </div>

          <div className="divide-y divide-stone-100 dark:divide-stone-800/70">
            {filteredLogs.length === 0 ? (
              <div className="text-center py-16 px-4 text-stone-500">
                <Clock className="w-8 h-8 mx-auto text-stone-300 dark:text-stone-600 mb-2" />
                <p className="font-semibold text-stone-700 dark:text-stone-300 text-sm">No activity recorded yet</p>
                <p className="text-xs text-stone-400 dark:text-stone-500 mt-1">Actions you take will be listed here chronologically.</p>
              </div>
            ) : (
              filteredLogs.map((log) => {
                const actionInfo = formatLogAction(log);
                return (
                  <div key={log.id} className="px-6 py-3.5 flex items-center justify-between gap-4 hover:bg-stone-50/50 dark:hover:bg-stone-800/40 transition-colors">
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center shrink-0">
                        {actionInfo.icon}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-stone-900 dark:text-stone-100 truncate">
                          {actionInfo.title}
                        </p>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
                          {log.details || log.target}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs text-stone-400 dark:text-stone-500">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
