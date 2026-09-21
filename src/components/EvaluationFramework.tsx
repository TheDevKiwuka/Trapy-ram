import React, { useState } from 'react';
import { 
  Play, CheckCircle2, XCircle, AlertTriangle, Clock, 
  RefreshCw, ShieldCheck, Check, ChevronDown, ChevronRight, Terminal
} from 'lucide-react';
import { EvaluationCase, EvaluationRunResult } from '../types';
import { EVALUATION_BENCHMARK_CASES } from '../data/evaluationCases';

export const EvaluationFramework: React.FC = () => {
  const [testCases] = useState<EvaluationCase[]>(EVALUATION_BENCHMARK_CASES);
  const [results, setResults] = useState<Record<string, EvaluationRunResult>>({});
  const [isRunningAll, setIsRunningAll] = useState(false);
  const [runningCaseId, setRunningCaseId] = useState<string | null>(null);
  const [expandedCaseId, setExpandedCaseId] = useState<string | null>(testCases[0]?.id || null);

  // Compute aggregate metrics
  const totalCases = testCases.length;
  const executedResults = Object.values(results);
  const completedCount = executedResults.length;
  const passedCount = executedResults.filter(r => r.passed).length;
  const passRate = completedCount > 0 ? Math.round((passedCount / completedCount) * 100) : 0;
  const avgLatency = completedCount > 0
    ? Math.round(executedResults.reduce((acc, r) => acc + r.latencyMs, 0) / completedCount)
    : 0;
  const schemaRate = completedCount > 0
    ? Math.round((executedResults.filter(r => r.schemaValid).length / completedCount) * 100)
    : 0;
  const guardrailRate = completedCount > 0
    ? Math.round((executedResults.filter(r => r.guardrailCompliant).length / completedCount) * 100)
    : 0;

  // Run a single evaluation test case
  const runSingleTest = async (testCase: EvaluationCase) => {
    setRunningCaseId(testCase.id);
    try {
      const res = await fetch('/api/ai/run-evaluation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testCase }),
      });
      const data: EvaluationRunResult = await res.json();
      setResults(prev => ({ ...prev, [testCase.id]: data }));
    } catch (err) {
      console.error(err);
      setResults(prev => ({
        ...prev,
        [testCase.id]: {
          caseId: testCase.id,
          caseName: testCase.name,
          taskNumber: testCase.taskNumber,
          passed: false,
          latencyMs: 0,
          tokensUsed: 0,
          schemaValid: false,
          guardrailCompliant: false,
          actualOutput: null,
          error: (err as Error).message,
          validationNotes: ['Network request to evaluation runner failed.'],
        }
      }));
    } finally {
      setRunningCaseId(null);
    }
  };

  // Run all evaluation test cases sequentially
  const runAllTests = async () => {
    setIsRunningAll(true);
    for (const testCase of testCases) {
      setRunningCaseId(testCase.id);
      try {
        const res = await fetch('/api/ai/run-evaluation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ testCase }),
        });
        const data: EvaluationRunResult = await res.json();
        setResults(prev => ({ ...prev, [testCase.id]: data }));
      } catch (err) {
        console.error(err);
      }
    }
    setRunningCaseId(null);
    setIsRunningAll(false);
  };

  return (
    <div id="evaluation-framework-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Framework Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 text-xs font-bold rounded-md bg-orange-100 text-orange-800 border border-orange-200">
                AI System Evaluation Suite
              </span>
              <span className="text-xs text-stone-400">Section 6 & 7 Compliance</span>
            </div>
            <h1 className="text-2xl font-bold text-stone-900 mt-1">Brumy AI Evaluation Benchmark</h1>
            <p className="text-sm text-stone-600 mt-1 max-w-3xl">
              Rigorous automated test harness for all 5 Brumy AI Tasks. Verifies strict JSON output contracts,
              latency budgets, confidence calibration, and non-negotiable guardrails (PII redaction, user approval flag, no permanent deletion).
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              id="run-all-benchmarks-btn"
              onClick={runAllTests}
              disabled={isRunningAll}
              className="inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-semibold bg-stone-900 hover:bg-stone-800 text-white shadow-xs transition-all active:scale-95 disabled:opacity-50"
            >
              <Play className={`w-4 h-4 mr-2 ${isRunningAll ? 'animate-spin text-amber-400' : 'text-amber-400'}`} />
              {isRunningAll ? 'Running Benchmark...' : 'Run All Benchmark Evals'}
            </button>
          </div>
        </div>

        {/* Aggregate Benchmark Scorecard */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-stone-100">
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
            <div className="text-xs font-semibold uppercase tracking-wider text-stone-500">Benchmark Pass Rate</div>
            <div className="text-2xl font-bold text-stone-900 mt-1">
              {completedCount > 0 ? `${passRate}%` : '—'}
            </div>
            <div className="text-xs text-stone-500 mt-0.5">
              {passedCount} of {totalCases} tests passed
            </div>
          </div>

          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
            <div className="text-xs font-semibold uppercase tracking-wider text-stone-500">Schema Validity</div>
            <div className="text-2xl font-bold text-emerald-700 mt-1">
              {completedCount > 0 ? `${schemaRate}%` : '100% Target'}
            </div>
            <div className="text-xs text-stone-500 mt-0.5">Strict JSON schema validation</div>
          </div>

          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
            <div className="text-xs font-semibold uppercase tracking-wider text-stone-500">Guardrail Adherence</div>
            <div className="text-2xl font-bold text-indigo-700 mt-1">
              {completedCount > 0 ? `${guardrailRate}%` : '100% Target'}
            </div>
            <div className="text-xs text-stone-500 mt-0.5">P0 non-negotiables</div>
          </div>

          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
            <div className="text-xs font-semibold uppercase tracking-wider text-stone-500">Average Latency</div>
            <div className="text-2xl font-bold text-stone-900 mt-1">
              {completedCount > 0 ? `${avgLatency} ms` : '—'}
            </div>
            <div className="text-xs text-stone-500 mt-0.5">Flash vs Pro routing SLA</div>
          </div>
        </div>
      </div>

      {/* Benchmark Test Cases List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-stone-900">Standard Test Cases ({testCases.length})</h2>
          <span className="text-xs text-stone-500 font-medium">Click any test case to expand input/output details</span>
        </div>

        <div className="space-y-3">
          {testCases.map((tc) => {
            const res = results[tc.id];
            const isExpanded = expandedCaseId === tc.id;
            const isCurrentlyRunning = runningCaseId === tc.id;

            return (
              <div
                key={tc.id}
                id={`eval-case-card-${tc.id}`}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs transition-all"
              >
                {/* Collapsible Header */}
                <div
                  className="p-5 flex items-center justify-between cursor-pointer hover:bg-stone-50/70 transition-colors"
                  onClick={() => setExpandedCaseId(isExpanded ? null : tc.id)}
                >
                  <div className="flex items-center space-x-3.5">
                    <button className="text-stone-400 hover:text-stone-600">
                      {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                    </button>

                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                          {tc.taskName.split('—')[0].trim()}
                        </span>
                        <h3 className="font-bold text-sm text-stone-900">{tc.name}</h3>
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5">{tc.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3" onClick={(e) => e.stopPropagation()}>
                    {/* Status Badge */}
                    {res ? (
                      res.passed ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> PASSED ({res.latencyMs}ms)
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">
                          <XCircle className="w-3.5 h-3.5 mr-1" /> FAILED
                        </span>
                      )
                    ) : (
                      <span className="text-xs text-stone-400 font-medium">Not evaluated</span>
                    )}

                    {/* Run Single Button */}
                    <button
                      id={`run-eval-btn-${tc.id}`}
                      onClick={() => runSingleTest(tc)}
                      disabled={isCurrentlyRunning}
                      className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 transition-colors disabled:opacity-50"
                    >
                      <Play className={`w-3.5 h-3.5 mr-1 ${isCurrentlyRunning ? 'animate-spin' : ''}`} />
                      {isCurrentlyRunning ? 'Evaluating...' : 'Run Test'}
                    </button>
                  </div>
                </div>

                {/* Expanded Details Pane */}
                {isExpanded && (
                  <div className="px-6 pb-6 pt-2 border-t border-stone-100 grid grid-cols-1 lg:grid-cols-2 gap-6 bg-stone-50/40">
                    {/* Left: Input Payload & Constraints */}
                    <div className="space-y-3">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Test Input Payload</span>
                        <pre className="mt-1 p-3 bg-white border border-stone-200 rounded-xl text-[11px] font-mono text-stone-800 overflow-x-auto max-h-56">
                          {JSON.stringify(tc.input, null, 2)}
                        </pre>
                      </div>

                      <div className="space-y-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Guardrails & Assertions</span>
                        <ul className="text-xs text-stone-600 space-y-1">
                          {tc.guardrailsToCheck.map((g, idx) => (
                            <li key={idx} className="flex items-center space-x-1.5">
                              <ShieldCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                              <span>{g}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Right: Actual Output & Diff */}
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Model Output (Live Gemini API)</span>
                          {res && (
                            <span className="text-[11px] text-stone-500 font-medium">
                              Latency: {res.latencyMs}ms • Tokens: ~{res.tokensUsed}
                            </span>
                          )}
                        </div>

                        {res ? (
                          <pre className="mt-1 p-3 bg-white border border-stone-200 rounded-xl text-[11px] font-mono text-stone-800 overflow-x-auto max-h-56">
                            {JSON.stringify(res.actualOutput || { error: res.error }, null, 2)}
                          </pre>
                        ) : (
                          <div className="mt-1 p-8 bg-white border border-dashed border-stone-300 rounded-xl text-center text-xs text-stone-400">
                            Click &quot;Run Test&quot; to execute live inference and benchmark validation.
                          </div>
                        )}
                      </div>

                      {res && res.validationNotes?.length > 0 && (
                        <div className="p-3 bg-white border border-stone-200 rounded-xl space-y-1">
                          <span className="text-[11px] font-bold text-stone-700 uppercase tracking-wider">Evaluation Assertions</span>
                          <ul className="text-xs space-y-0.5">
                            {res.validationNotes.map((note, idx) => (
                              <li
                                key={idx}
                                className={`flex items-start space-x-1.5 ${
                                  note.startsWith('Violation') ? 'text-rose-700 font-semibold' : 'text-emerald-700'
                                }`}
                              >
                                {note.startsWith('Violation') ? (
                                  <XCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                                ) : (
                                  <Check className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                                )}
                                <span>{note}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
