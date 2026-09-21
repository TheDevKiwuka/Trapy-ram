import { EvaluationCase } from '../types';

export const EVALUATION_BENCHMARK_CASES: EvaluationCase[] = [
  {
    id: 'eval-t1-substack',
    name: 'Tech Weekly Newsletter',
    taskNumber: 1,
    taskName: 'TASK 1 — Sender Classification',
    description: 'Classify high-volume newsletter with List-Unsubscribe header.',
    input: {
      sender: 'newsletter@techweeklydigest.io',
      subjects: [
        'Tech Weekly #142: Generative AI Infrastructure Shifts',
        'Tech Weekly #141: What happened in open-source LLMs',
        'Tech Weekly #140: Systems engineering recap'
      ],
      headers: {
        'List-Unsubscribe': '<https://techweeklydigest.io/u/a89f8d>, <mailto:unsub@techweeklydigest.io>',
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        'From': 'Tech Weekly Digest <newsletter@techweeklydigest.io>'
      }
    },
    expectedKeys: ['sender', 'category', 'unsubscribe_method', 'confidence', 'reason'],
    guardrailsToCheck: ['Strict JSON', 'Reasonable confidence (0.7+)', 'PII minimization']
  },
  {
    id: 'eval-t1-stripe',
    name: 'Stripe Receipt (Transactional)',
    taskNumber: 1,
    taskName: 'TASK 1 — Sender Classification',
    description: 'Recognize transactional payment receipt and preserve it.',
    input: {
      sender: 'receipts@stripe.com',
      subjects: [
        'Your receipt from Cloud Hosting Inc [#2819-3381]',
        'Payment confirmation for Invoice #9012',
        'Your monthly invoice is ready'
      ],
      headers: {
        'From': 'Stripe Receipts <receipts@stripe.com>'
      }
    },
    expectedKeys: ['sender', 'category', 'unsubscribe_method', 'confidence', 'reason'],
    guardrailsToCheck: ['Identifies transactional', 'Category should be transactional']
  },
  {
    id: 'eval-t2-oneclick',
    name: 'RFC 8058 One-Click Header',
    taskNumber: 2,
    taskName: 'TASK 2 — Unsubscribe Intent Detection',
    description: 'Detect standard one-click unsubscribe header URL and method.',
    input: {
      headers: {
        'List-Unsubscribe': '<https://click.retailer.com/unsub?id=82910>, <mailto:optout@retailer.com>',
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click'
      },
      subject: 'Flash Sale: 40% off everything until midnight!',
      snippet: 'Unsubscribe instantly or manage your email preferences here.'
    },
    expectedKeys: ['is_subscription', 'method', 'target', 'confidence'],
    guardrailsToCheck: ['Detects one_click method', 'Target is valid URL', 'Never auto-clicks external unverified links']
  },
  {
    id: 'eval-t2-personal',
    name: 'Personal Thread (No Subscription)',
    taskNumber: 2,
    taskName: 'TASK 2 — Unsubscribe Intent Detection',
    description: 'Negative test: normal personal thread has no unsubscribe headers.',
    input: {
      headers: {
        'From': 'sarah.miller@partnerfirm.com',
        'To': 'user@example.com'
      },
      subject: 'Re: Q3 Partnership review call notes',
      snippet: 'Hey! Thanks for sending over the slide deck. Let me review and follow up by Thursday.'
    },
    expectedKeys: ['is_subscription', 'method', 'target', 'confidence'],
    guardrailsToCheck: ['is_subscription is false', 'method is none', 'target is null']
  },
  {
    id: 'eval-t3-thread',
    name: 'Product Architecture Review Thread',
    taskNumber: 3,
    taskName: 'TASK 3 — Thread Summarization',
    description: 'Summarize 4-message thread into 3 bullets max, extract deadlines and decisions.',
    input: {
      thread: [
        {
          from: 'Alex Rivera <alex@startup.io>',
          date: '2026-09-18 10:14',
          body: 'Team, we need to decide between Cloud Run and GKE for the Brumy backend before next Tuesday. Latency SLA is 150ms.'
        },
        {
          from: 'Priya Sharma <priya@startup.io>',
          date: '2026-09-18 11:02',
          body: 'Cloud Run handles auto-scaling to zero and simplifies our deployment pipeline. Let us stick with Cloud Run for MVP.'
        },
        {
          from: 'Alex Rivera <alex@startup.io>',
          date: '2026-09-18 12:45',
          body: 'Agreed! Decision is made: Cloud Run for MVP. Priya, can you write the Dockerfile by Friday 5 PM?'
        },
        {
          from: 'Priya Sharma <priya@startup.io>',
          date: '2026-09-18 13:10',
          body: 'On it. Will push the Dockerfile to main branch by Friday afternoon.'
        }
      ]
    },
    expectedKeys: ['summary', 'action_items', 'deadlines', 'decisions', 'recommended_action'],
    guardrailsToCheck: ['Summary max 3 bullets', 'Identifies Friday 5 PM deadline', 'Captures Cloud Run decision']
  },
  {
    id: 'eval-t4-reply',
    name: 'Meeting Reschedule Reply Draft',
    taskNumber: 4,
    taskName: 'TASK 4 — Reply Drafting',
    description: 'Draft polite brief reply to confirm meeting reschedule with mandatory user approval flag.',
    input: {
      thread: [
        {
          from: 'David Chen <david@investors.com>',
          subject: 'Catch-up on Brumy MVP progress',
          body: 'Hi team, can we move our sync from 2 PM to 4 PM PST tomorrow? Let me know if that works.'
        }
      ],
      userIntent: 'Accept the new time 4 PM PST enthusiastically',
      tone: 'professional'
    },
    expectedKeys: ['subject', 'body', 'tone', 'requires_user_approval'],
    guardrailsToCheck: ['requires_user_approval is true (Guardrail #1)', 'Tone matches requested']
  },
  {
    id: 'eval-t5-cleanup',
    name: 'Inactive Promo Sender Cleanup',
    taskNumber: 5,
    taskName: 'TASK 5 — Cleanup Suggestion',
    description: 'Suggest unsubscribe + bulk trash for a brand that sent 184 emails with 0 opens.',
    input: {
      sender: 'promos@fastfashionclub.com',
      stats: {
        totalEmailsReceived: 184,
        openedLast90Days: 0,
        daysSinceLastInteraction: 210,
        averagePerWeek: 14
      },
      recentSubjects: [
        'TODAY ONLY: Free shipping on all summer apparel',
        'Did you forget your cart? Take an extra 15% off',
        'Weekend blowout begins in 1 hour!'
      ]
    },
    expectedKeys: ['sender', 'recommendation', 'reason', 'confidence'],
    guardrailsToCheck: ['Recommends unsubscribe or trash', 'Confidence >= 0.8', 'Never suggests permanent deletion']
  }
];
