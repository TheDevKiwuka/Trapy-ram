import React from 'react';
import { X, Clock, CheckCircle2, AlertCircle, FileCode } from 'lucide-react';
import { ActionLog } from '../types';

interface ActionLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: ActionLog[];
  onClearLogs: () => void;
}

export const ActionLogsModal: React.FC<ActionLogsModalProps> = ({
  isOpen,
  onClose,
  logs,
  onClearLogs,
}) => {
  if (!isOpen) return null;

  return (
    <div id="action-logs-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4">
      <div className="bg-white dark:bg-[#16181E] rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-stone-200 dark:border-stone-800 relative max-h-[85vh] flex flex-col text-stone-900 dark:text-stone-100 animate-in fade-in zoom-in duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-700 dark:text-stone-300">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-stone-900 dark:text-stone-100">Audit &amp; Action Trail</h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">Security &amp; Transparency • Complete log of every action taken</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Logs List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-2">
          {logs.length === 0 ? (
            <div className="text-center py-12 text-stone-400 dark:text-stone-500 text-xs">
              No actions logged yet in this session. Actions such as unsubscribing, moving to trash, or restoral are recorded here.
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/60 flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold uppercase tracking-wider text-[10px] px-2 py-0.5 rounded bg-stone-200 dark:bg-stone-750 text-stone-800 dark:text-stone-200">
                      {log.action}
                    </span>
                    <span className="font-semibold text-stone-900 dark:text-stone-100">{log.target}</span>
                  </div>
                  {log.details && (
                    <div className="text-stone-600 dark:text-stone-400 text-xs">{log.details}</div>
                  )}
                </div>

                <div className="text-right shrink-0">
                  <span className="inline-flex items-center text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> {log.status}
                  </span>
                  <div className="text-[10px] text-stone-400 dark:text-stone-500 mt-1">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs">
          <span className="text-stone-500 dark:text-stone-400">{logs.length} logged events</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClearLogs}
              className="px-3 py-1.5 text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 font-medium transition-colors"
            >
              Clear Log
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-xl font-medium hover:bg-stone-800 dark:hover:bg-white transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
