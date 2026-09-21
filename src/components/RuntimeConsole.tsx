import React, { useState } from 'react';
import { Terminal, Play, Copy, Check, RefreshCw, ShieldAlert, Cpu } from 'lucide-react';

export const RuntimeConsole: React.FC = () => {
  const [selectedTask, setSelectedTask] = useState<number>(1);
  const [inputJson, setInputJson] = useState<string>(() => {
    return JSON.stringify({
      sender: "promotions@shopdealsweekly.com",
      subjects: [
        "Exclusive 50% discount on summer essentials",
        "Your private invitation to VIP rewards week",
        "Last chance for free priority shipping"
      ],
      headers: {
        "List-Unsubscribe": "<https://shopdealsweekly.com/unsub?user=99281>, <mailto:optout@shopdealsweekly.com>",
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        "From": "ShopDeals <promotions@shopdealsweekly.com>"
      }
    }, null, 2);
  });

  const [outputJson, setOutputJson] = useState<string | null>(null);
  const [telemetry, setTelemetry] = useState<{ latencyMs?: number; inputHash?: string; model?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Pre-set templates for each task
  const taskTemplates: Record<number, { title: string; defaultPayload: object }> = {
    1: {
      title: "TASK 1 — Sender Classification",
      defaultPayload: {
        sender: "promotions@shopdealsweekly.com",
        subjects: [
          "Exclusive 50% discount on summer essentials",
          "Your private invitation to VIP rewards week",
          "Last chance for free priority shipping"
        ],
        headers: {
          "List-Unsubscribe": "<https://shopdealsweekly.com/unsub?user=99281>, <mailto:optout@shopdealsweekly.com>",
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click"
        }
      }
    },
    2: {
      title: "TASK 2 — Unsubscribe Intent Detection",
      defaultPayload: {
        headers: {
          "List-Unsubscribe": "<https://newsletter.digest.com/u/1029>, <mailto:unsub@digest.com>",
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click"
        },
        subject: "Your Weekly Digest: Top 5 AI frameworks compared",
        snippet: "To unsubscribe from this list or manage preferences, visit this link."
      }
    },
    3: {
      title: "TASK 3 — Thread Summarization",
      defaultPayload: {
        thread: [
          {
            from: "Jordan Bell <jordan@company.com>",
            date: "2026-09-19 14:00",
            body: "Hi team, we need to finalize the Brumy MVP launch date by this Thursday. Are there any blocking issues?"
          },
          {
            from: "Elena Rostova <elena@company.com>",
            date: "2026-09-19 15:30",
            body: "All P0 tasks are complete. OAuth verification checklist is ready. Let's aim for Monday morning 9 AM launch."
          }
        ]
      }
    },
    4: {
      title: "TASK 4 — Reply Drafting",
      defaultPayload: {
        thread: [
          {
            from: "Investor Relations <ir@venturecapital.com>",
            subject: "Update on Series Seed allocation",
            body: "Hi Brumy founders, can we schedule 15 minutes tomorrow afternoon to discuss remaining allocation?"
          }
        ],
        userIntent: "Agree to 15-minute call tomorrow at 3 PM PST",
        tone: "professional"
      }
    },
    5: {
      title: "TASK 5 — Cleanup Suggestion",
      defaultPayload: {
        sender: "alerts@dailysalespromos.com",
        stats: {
          totalEmailsReceived: 215,
          openedLast90Days: 0,
          daysSinceLastInteraction: 180,
          averagePerWeek: 15
        },
        recentSubjects: [
          "Super weekend sale blowout",
          "Exclusive deals for top subscribers",
          "Did you leave this behind in your cart?"
        ]
      }
    }
  };

  const handleSelectTask = (taskNum: number) => {
    setSelectedTask(taskNum);
    setInputJson(JSON.stringify(taskTemplates[taskNum].defaultPayload, null, 2));
    setOutputJson(null);
    setTelemetry(null);
    setErrorMsg(null);
  };

  const handleExecute = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    setOutputJson(null);

    try {
      const parsedInput = JSON.parse(inputJson);
      let endpoint = '';
      if (selectedTask === 1) endpoint = '/api/ai/task1-classify-sender';
      else if (selectedTask === 2) endpoint = '/api/ai/task2-detect-unsubscribe';
      else if (selectedTask === 3) endpoint = '/api/ai/task3-summarize-thread';
      else if (selectedTask === 4) endpoint = '/api/ai/task4-draft-reply';
      else if (selectedTask === 5) endpoint = '/api/ai/task5-cleanup-suggestion';

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsedInput),
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data = await res.json();
      const meta = data._meta;
      delete data._meta;

      setOutputJson(JSON.stringify(data, null, 2));
      setTelemetry(meta || null);
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (outputJson) {
      navigator.clipboard.writeText(outputJson);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div id="runtime-console-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-stone-900">Brumy Live Processing Engine (Runtime Mode)</h1>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                Active Protocol
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Direct JSON I/O harness for Brumy&apos;s 5 runtime classification and summarization tasks.
            </p>
          </div>
        </div>

        {/* Task Tabs */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-stone-100">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              id={`runtime-task-tab-${num}`}
              onClick={() => handleSelectTask(num)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedTask === num
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200'
              }`}
            >
              Task {num}: {taskTemplates[num].title.split('—')[1]}
            </button>
          ))}
        </div>
      </div>

      {/* Two-Column Editor & Output Console */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Input Editor */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-700">JSON Input Payload</span>
              <span className="text-[11px] text-stone-400">Strict schema target</span>
            </div>
            <button
              onClick={() => setInputJson(JSON.stringify(taskTemplates[selectedTask].defaultPayload, null, 2))}
              className="text-xs text-amber-600 hover:text-amber-700 font-medium"
            >
              Reset Sample
            </button>
          </div>

          <textarea
            id="runtime-input-editor"
            value={inputJson}
            onChange={(e) => setInputJson(e.target.value)}
            rows={16}
            className="w-full flex-1 p-4 font-mono text-xs text-stone-900 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />

          <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between">
            <span className="text-xs text-stone-400 flex items-center space-x-1">
              <Cpu className="w-3.5 h-3.5 text-stone-500" />
              <span>Routed Model: Gemini 3.8 Flash</span>
            </span>

            <button
              id="execute-runtime-task-btn"
              onClick={handleExecute}
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-all active:scale-95 disabled:opacity-50"
            >
              <Play className={`w-3.5 h-3.5 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Executing Task...' : 'Run Task'}
            </button>
          </div>
        </div>

        {/* Right: Output Console */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-700">Runtime Output (JSON)</span>
              {telemetry && (
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {telemetry.latencyMs}ms
                </span>
              )}
            </div>

            {outputJson && (
              <button
                onClick={handleCopy}
                className="inline-flex items-center text-xs text-stone-500 hover:text-stone-900 font-medium"
              >
                {copied ? <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                {copied ? 'Copied' : 'Copy JSON'}
              </button>
            )}
          </div>

          <div className="flex-1 min-h-[360px] p-4 bg-stone-900 text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto relative">
            {isLoading ? (
              <div className="flex items-center justify-center h-full text-stone-400">
                <RefreshCw className="w-5 h-5 animate-spin mr-2 text-amber-400" />
                <span>Executing {taskTemplates[selectedTask].title}...</span>
              </div>
            ) : errorMsg ? (
              <div className="text-rose-400 p-4">
                <ShieldAlert className="w-5 h-5 mb-2" />
                <p className="font-bold">Execution Error:</p>
                <p>{errorMsg}</p>
              </div>
            ) : outputJson ? (
              <pre className="whitespace-pre-wrap">{outputJson}</pre>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-stone-500 text-center">
                <Terminal className="w-6 h-6 mb-2 text-stone-600" />
                <p>Click &quot;Run Task&quot; to execute live data processing pipeline.</p>
                <p className="text-[11px] text-stone-600 mt-1">Conforms to Brumy Section 6 schema specifications.</p>
              </div>
            )}
          </div>

          {/* Telemetry Footer */}
          {telemetry && (
            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500 font-medium">
              <span>Hash: {telemetry.inputHash}</span>
              <span>Model: {telemetry.model}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
