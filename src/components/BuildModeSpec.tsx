import React, { useState } from 'react';
import { BookOpen, Shield, Database, Cpu, CheckSquare, Layers, Lock } from 'lucide-react';

export const BuildModeSpec: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'summary' | 'scope' | 'stack' | 'guardrails' | 'release'>('summary');

  return (
    <div id="build-mode-spec-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Spec Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-stone-900">Brumy Master Architecture & Spec</h1>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800">
                BUILD MODE
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Version 0.1 MVP • Product Blueprint, Data Schema, Guardrails &amp; Release Criteria
            </p>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-stone-100">
          {[
            { id: 'summary', label: '1. Product & Personas' },
            { id: 'scope', label: '2. P0 MVP Scope & Boundaries' },
            { id: 'stack', label: '3. Tech Stack & Model Routing' },
            { id: 'guardrails', label: '4. Non-Negotiable Guardrails' },
            { id: 'release', label: '5. Release Criteria & Metrics' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as typeof activeSection)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeSection === tab.id
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-6 text-sm text-stone-700 leading-relaxed">
        {activeSection === 'summary' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-bold text-stone-900 mb-2">Product Summary</h2>
              <p className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-stone-800 font-medium">
                <strong>One-liner:</strong> Connect Gmail, see noisy senders, unsubscribe in one click, bulk-trash the backlog, and let AI handle the rest.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-1">
                <h3 className="font-bold text-stone-900 text-sm">Overloaded Professional</h3>
                <p className="text-xs text-stone-600">100+ emails/day, wants to kill newsletters fast, values privacy and zero spam clutter.</p>
              </div>

              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-1">
                <h3 className="font-bold text-stone-900 text-sm">Founder / SMB Owner</h3>
                <p className="text-xs text-stone-600">Uses Gmail for business, wants AI to summarize and draft quick replies while organizing backlog.</p>
              </div>

              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-1">
                <h3 className="font-bold text-stone-900 text-sm">Casual / Student</h3>
                <p className="text-xs text-stone-600">Thousands of unread marketing emails, seeks a simple free cleanup tool, converts to paid after 10 unsubs.</p>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'scope' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-bold text-stone-900 mb-3">MVP Scope Matrix</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 space-y-2">
                  <div className="flex items-center space-x-2 text-emerald-800 font-bold text-sm">
                    <CheckSquare className="w-4 h-4" />
                    <span>P0 — Must Have (MVP)</span>
                  </div>
                  <ul className="text-xs text-stone-700 space-y-1.5 list-disc list-inside">
                    <li>Google OAuth sign-in + Gmail connect</li>
                    <li>Gmail scan (up to 1,000 recent messages)</li>
                    <li>Sender detection + ranking by volume</li>
                    <li>One-click unsubscribe via RFC 8058 List-Unsubscribe headers</li>
                    <li>Bulk trash all emails from a sender (with confirmation)</li>
                    <li>AI assistant: thread summary + reply drafting</li>
                    <li>Free limit: 10 unsubscribes, then paywall</li>
                    <li>Privacy controls: delete account, revoke access</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/30 space-y-2">
                  <div className="flex items-center space-x-2 text-rose-800 font-bold text-sm">
                    <Lock className="w-4 h-4" />
                    <span>Explicitly OUT OF SCOPE for MVP</span>
                  </div>
                  <ul className="text-xs text-stone-700 space-y-1.5 list-disc list-inside">
                    <li>Non-Gmail providers (Outlook, Yahoo, IMAP)</li>
                    <li>Permanent email deletion (only move to Trash)</li>
                    <li>Full email client (compose, folders, calendar)</li>
                    <li>Team/admin controls</li>
                    <li>Native mobile apps</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'stack' && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-stone-900">Tech Stack & Model Routing</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border border-stone-200 rounded-xl overflow-hidden">
                <thead className="bg-stone-100 text-stone-800 font-semibold">
                  <tr>
                    <th className="p-3">Layer</th>
                    <th className="p-3">Technology</th>
                    <th className="p-3">Role in Brumy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 bg-white">
                  <tr>
                    <td className="p-3 font-semibold">Frontend</td>
                    <td className="p-3">React 19 + Tailwind CSS</td>
                    <td className="p-3">Single-page responsive dashboard, real-time feedback</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Backend</td>
                    <td className="p-3">Node.js + Express (Cloud Run)</td>
                    <td className="p-3">Secure server-side API key proxy, task execution</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">AI Models</td>
                    <td className="p-3">Gemini 3.8 Flash &amp; Pro</td>
                    <td className="p-3">Flash for classification/unsub; Pro for summaries/replies</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Gmail Integration</td>
                    <td className="p-3">Gmail API + OAuth 2.0</td>
                    <td className="p-3">Scanning messages, trash actions, header inspection</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeSection === 'guardrails' && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-stone-900 font-bold text-base">
              <Shield className="w-5 h-5 text-amber-600" />
              <span>Section 7: Non-Negotiable Guardrails</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {[
                { num: 1, text: "Never send an email without explicit user confirmation." },
                { num: 2, text: "Never permanently delete emails in MVP — only move to Trash." },
                { num: 3, text: "Never auto-click external unsubscribe links. Use List-Unsubscribe headers first." },
                { num: 4, text: "Redact or minimize PII before sending content to Gemini when possible." },
                { num: 5, text: "Log every AI decision (input hash, output, model, tokens)." },
                { num: 6, text: "Never claim to be affiliated with Google or Gmail." },
                { num: 7, text: "Never sell, share, or export user email data." },
                { num: 8, text: "Comply with Google API Limited Use requirements." },
                { num: 9, text: "If uncertain, ask. Do not hallucinate senders, headers, or unsubscribe methods." },
                { num: 10, text: "Respect the free limit — after 10 unsubscribes, prompt upgrade flow." },
              ].map((g) => (
                <div key={g.num} className="p-3 rounded-xl border border-stone-200 bg-stone-50/50 flex items-start space-x-2.5">
                  <span className="font-bold text-amber-800 bg-amber-100 rounded-full w-5 h-5 flex items-center justify-center shrink-0 text-[10px]">
                    {g.num}
                  </span>
                  <span className="text-stone-800 font-medium">{g.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'release' && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-stone-900">Release Criteria &amp; Target Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-stone-200 space-y-2 bg-stone-50/50">
                <span className="font-bold text-stone-900 text-sm">Release Criteria (MVP Ships When)</span>
                <ul className="space-y-1 list-disc list-inside text-stone-700">
                  <li>Gmail OAuth works end-to-end</li>
                  <li>Scan lists top 20 senders ranked by volume</li>
                  <li>Unsubscribe works for ≥80% of detected senders</li>
                  <li>Bulk trash works with explicit confirmation</li>
                  <li>AI summarizes a thread and drafts a reply</li>
                  <li>Free limit (10 unsubscribes) enforced</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-stone-200 space-y-2 bg-stone-50/50">
                <span className="font-bold text-stone-900 text-sm">Core Product Metrics</span>
                <ul className="space-y-1 list-disc list-inside text-stone-700">
                  <li><strong>North Star:</strong> Cleanup actions per weekly active user</li>
                  <li><strong>Activation:</strong> First cleanup action within 10 minutes</li>
                  <li><strong>Engagement:</strong> Unsubscribes/user, emails trashed/user</li>
                  <li><strong>Conversion:</strong> Free → paid conversion at 10 unsubs</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
