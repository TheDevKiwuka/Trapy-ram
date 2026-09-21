import { Sender, EmailMessage } from '../types';

export const INITIAL_SAMPLE_SENDERS: Sender[] = [
  {
    id: 'sender-1',
    userId: 'user-demo',
    email: 'news@dailytechdigest.com',
    name: 'Daily Tech Digest',
    domain: 'dailytechdigest.com',
    messageCount: 184,
    lastReceived: '2026-09-20T08:15:00Z',
    category: 'newsletter',
    unsubscribeMethod: 'one_click',
    unsubscribeTarget: 'https://dailytechdigest.com/unsub/u819230',
    unsubscribed: false,
    trashed: false,
    sampleSubjects: [
      'Tech Digest #312: Next-gen inference architectures',
      'Tech Digest #311: Scaling vector databases in 2026',
      'Tech Digest #310: Open weights vs closed frontier models'
    ]
  },
  {
    id: 'sender-2',
    userId: 'user-demo',
    email: 'deals@fashionoutlet24.com',
    name: 'Fashion Outlet 24',
    domain: 'fashionoutlet24.com',
    messageCount: 142,
    lastReceived: '2026-09-19T17:40:00Z',
    category: 'promotion',
    unsubscribeMethod: 'one_click',
    unsubscribeTarget: 'https://fashionoutlet24.com/api/unsubscribe?token=f90a2',
    unsubscribed: false,
    trashed: false,
    sampleSubjects: [
      '48-Hour Weekend Flash Sale: Up to 70% Off',
      'Your cart items are selling out quickly!',
      'Exclusive Fall VIP preview starts now'
    ]
  },
  {
    id: 'sender-3',
    userId: 'user-demo',
    email: 'digest@curatedreads.co',
    name: 'Curated Reads Weekly',
    domain: 'curatedreads.co',
    messageCount: 96,
    lastReceived: '2026-09-18T09:00:00Z',
    category: 'newsletter',
    unsubscribeMethod: 'link',
    unsubscribeTarget: 'https://curatedreads.co/manage-subscription/c7710a',
    unsubscribed: false,
    trashed: false,
    sampleSubjects: [
      'The 5 long-form essays you should read this Sunday',
      'Why deep focus is becoming a superpower in the AI era',
      'Reflections on digital minimalism and work'
    ]
  },
  {
    id: 'sender-4',
    userId: 'user-demo',
    email: 'notifications@linkedin.com',
    name: 'LinkedIn Network Updates',
    domain: 'linkedin.com',
    messageCount: 88,
    lastReceived: '2026-09-20T11:22:00Z',
    category: 'promotion',
    unsubscribeMethod: 'one_click',
    unsubscribeTarget: 'https://www.linkedin.com/e/v2/unsub/token9921',
    unsubscribed: false,
    trashed: false,
    sampleSubjects: [
      'Alex and 4 others viewed your profile this week',
      'People are talking about AI Agents in Cloud Run',
      'Congratulate Sarah on her new role at Acme Corp'
    ]
  },
  {
    id: 'sender-5',
    userId: 'user-demo',
    email: 'offers@foodexpress-delivery.net',
    name: 'FoodExpress Rewards',
    domain: 'foodexpress-delivery.net',
    messageCount: 71,
    lastReceived: '2026-09-19T19:05:00Z',
    category: 'promotion',
    unsubscribeMethod: 'mailto',
    unsubscribeTarget: 'mailto:optout@foodexpress-delivery.net?subject=unsubscribe_user_129',
    unsubscribed: false,
    trashed: false,
    sampleSubjects: [
      'Hungry? Take $15 off your dinner order tonight',
      'Free delivery this Friday on orders over $25',
      'Weekend treats are just a tap away'
    ]
  },
  {
    id: 'sender-6',
    userId: 'user-demo',
    email: 'news@cryptoinsideralert.xyz',
    name: 'Crypto Alert Wire',
    domain: 'cryptoinsideralert.xyz',
    messageCount: 65,
    lastReceived: '2026-09-20T04:10:00Z',
    category: 'spam',
    unsubscribeMethod: 'link',
    unsubscribeTarget: 'https://cryptoinsideralert.xyz/optout?sid=1829',
    unsubscribed: false,
    trashed: false,
    sampleSubjects: [
      'ALERT: Key support levels tested across major tokens',
      'Top 3 undervalued ecosystems to watch this cycle',
      'Macro liquidity report & weekly token unlocks'
    ]
  },
  {
    id: 'sender-7',
    userId: 'user-demo',
    email: 'receipts@stripe.com',
    name: 'Stripe Invoicing & Receipts',
    domain: 'stripe.com',
    messageCount: 42,
    lastReceived: '2026-09-17T14:30:00Z',
    category: 'transactional',
    unsubscribeMethod: 'none',
    unsubscribed: false,
    trashed: false,
    sampleSubjects: [
      'Receipt for Google Cloud Platform Services (#9981-22)',
      'Invoice #4810 from Vercel Inc. has been paid',
      'Monthly payment confirmation for OpenAI API'
    ]
  },
  {
    id: 'sender-8',
    userId: 'user-demo',
    email: 'marcus.vance@ventureflow.io',
    name: 'Marcus Vance',
    domain: 'ventureflow.io',
    messageCount: 14,
    lastReceived: '2026-09-20T13:45:00Z',
    category: 'personal',
    unsubscribeMethod: 'none',
    unsubscribed: false,
    trashed: false,
    sampleSubjects: [
      'Re: Brumy seed round notes & deck feedback',
      'Intro to potential design partner at ScaleOps',
      'Quick sync next Wednesday afternoon?'
    ]
  }
];

export const INITIAL_SAMPLE_MESSAGES: EmailMessage[] = [
  {
    id: 'msg-101',
    userId: 'user-demo',
    senderId: 'sender-1',
    senderEmail: 'news@dailytechdigest.com',
    senderName: 'Daily Tech Digest',
    threadId: 'th-101',
    subject: 'Tech Digest #312: Next-gen inference architectures',
    snippet: 'This week we unpack the emergence of speculative decoding in enterprise LLM clusters...',
    date: '2026-09-20T08:15:00Z',
    labels: ['INBOX', 'CATEGORY_PROMOTIONS'],
    body: `Hello builder,\n\nIn this issue, we dive into how enterprise AI infrastructure teams are slashing inference latencies by 4x using speculative decoding pipelines.\n\nKey takeaways:\n1. Smaller draft models run ahead to generate candidate tokens.\n2. Verification runs in a single forward pass on the target model.\n3. Cost reductions of up to 45% are documented across high-throughput endpoints.\n\nTo manage your email preferences or opt out, use the header unsubscribe or visit our portal.\n\nCheers,\nDaily Tech Digest Editorial Team`,
    headers: {
      listUnsubscribe: '<https://dailytechdigest.com/unsub/u819230>, <mailto:unsub@dailytechdigest.com>',
      listUnsubscribePost: 'List-Unsubscribe=One-Click',
      from: 'Daily Tech Digest <news@dailytechdigest.com>',
      to: 'user@example.com'
    }
  },
  {
    id: 'msg-102',
    userId: 'user-demo',
    senderId: 'sender-2',
    senderEmail: 'deals@fashionoutlet24.com',
    senderName: 'Fashion Outlet 24',
    threadId: 'th-102',
    subject: '48-Hour Weekend Flash Sale: Up to 70% Off',
    snippet: 'Don\'t miss our seasonal clearance. Limited stock across jackets, footwear, and accessories...',
    date: '2026-09-19T17:40:00Z',
    labels: ['INBOX', 'CATEGORY_PROMOTIONS'],
    body: `Hey Shopper!\n\nOur biggest seasonal flash sale is officially on. Save up to 70% on premium coats, boots, and everyday essentials. Use promo code FLASH70 at checkout before Sunday 11:59 PM.\n\nShop the sale now: https://fashionoutlet24.com/deals\n\nTo unsubscribe from promotional newsletters, visit https://fashionoutlet24.com/api/unsubscribe?token=f90a2`,
    headers: {
      listUnsubscribe: '<https://fashionoutlet24.com/api/unsubscribe?token=f90a2>',
      listUnsubscribePost: 'List-Unsubscribe=One-Click',
      from: 'Fashion Outlet 24 <deals@fashionoutlet24.com>'
    }
  },
  {
    id: 'msg-103',
    userId: 'user-demo',
    senderId: 'sender-8',
    senderEmail: 'marcus.vance@ventureflow.io',
    senderName: 'Marcus Vance',
    threadId: 'th-103',
    subject: 'Re: Brumy seed round notes & deck feedback',
    snippet: 'Hi team, reviewed the latest metrics and deck slides. Really excited by the 10-unsub conversion loop...',
    date: '2026-09-20T13:45:00Z',
    labels: ['INBOX', 'IMPORTANT'],
    body: `Hi team,\n\nI reviewed the updated deck and financial projection sheet over the weekend. Really impressed by the inbox cleanup velocity and the retention numbers on the 10-unsub paywall transition.\n\nCould we arrange a quick 20-minute call this Wednesday at 3:00 PM PST to discuss term sheet specifics and syndication with our partner?\n\nLet me know if that time slot works for you.\n\nBest regards,\nMarcus Vance\nPartner, VentureFlow`,
    headers: {
      from: 'Marcus Vance <marcus.vance@ventureflow.io>',
      to: 'user@example.com'
    }
  }
];
