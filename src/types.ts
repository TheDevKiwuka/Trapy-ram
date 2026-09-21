export type BrumyMode = 'INBOX_CLEANUP' | 'ACTIVITY_TRASH' | 'SETTINGS' | 'SIGNUP';

export type NotificationChannel = 'push' | 'sms' | 'in_app';

export interface NotificationItem {
  id: string;
  userId?: string;
  type: NotificationChannel;
  title: string;
  message: string;
  category: 'sweep' | 'security' | 'digest' | 'system';
  timestamp: string;
  read: boolean;
  status: 'delivered' | 'failed' | 'simulated' | 'pending';
  channelDetails?: {
    phone?: string;
    carrier?: string;
    messageSid?: string;
    pushDevice?: string;
    sound?: boolean;
  };
}

export interface NotificationPreferences {
  // Push Channel
  pushEnabled: boolean;
  pushPermission: 'default' | 'granted' | 'denied';
  pushOnSweepComplete: boolean;
  pushOnNewClutter: boolean;
  
  // SMS Channel
  smsEnabled: boolean;
  smsPhoneNumber: string;
  smsCountryCode: string;
  smsCriticalAlerts: boolean;
  smsWeeklyDigest: boolean;

  // In-App Channel
  inAppEnabled: boolean;
  inAppSound: boolean;
  inAppBadge: boolean;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  photoUrl?: string; // exact pic on their email or avatar link
  countryCode: string; // e.g. "US", "KE", "GB"
  dialCode: string; // e.g. "+1", "+254", "+44"
  phoneNumber?: string; // national phone number or formatted E.164
  emailAccessGranted?: boolean; // whether user granted access to their email account
  permissionStatus?: 'prompt' | 'granted' | 'denied';
  createdAt: string;
  lastLoginAt?: string;
}

export type SenderCategory = 'newsletter' | 'promotion' | 'transactional' | 'personal' | 'spam' | 'unknown';

export type UnsubscribeMethod = 'one_click' | 'mailto' | 'link' | 'none';

export interface Sender {
  id: string;
  userId: string;
  email: string;
  name: string;
  domain: string;
  messageCount: number;
  unread?: number;
  lastReceived: string;
  category: SenderCategory;
  unsubscribeMethod: UnsubscribeMethod;
  unsubscribeTarget?: string;
  unsubscribed: boolean;
  trashed: boolean;
  whitelisted?: boolean;
  sampleSubjects: string[];
}

export interface EmailMessage {
  id: string;
  userId: string;
  senderId: string;
  senderEmail: string;
  senderName: string;
  threadId: string;
  subject: string;
  snippet: string;
  date: string;
  labels: string[];
  body?: string;
  headers?: {
    listUnsubscribe?: string;
    listUnsubscribePost?: string;
    from?: string;
    to?: string;
    date?: string;
  };
}

export interface ActionLog {
  id: string;
  userId: string;
  action: 'unsubscribe' | 'bulk_trash' | 'ai_classify' | 'ai_summarize' | 'ai_reply' | 'ai_suggest';
  target: string;
  status: 'success' | 'failed' | 'simulated';
  details?: string;
  timestamp: string;
}

export interface AIJobLog {
  id: string;
  userId: string;
  type: 'TASK_1_CLASSIFICATION' | 'TASK_2_UNSUBSCRIBE' | 'TASK_3_SUMMARY' | 'TASK_4_REPLY' | 'TASK_5_CLEANUP';
  inputHash: string;
  output: Record<string, unknown>;
  model: string;
  tokens: number;
  latencyMs: number;
  timestamp: string;
}

// 5 AI TASK SCHEMAS (Master Prompt Section 6)
export interface Task1Output {
  sender: string;
  category: SenderCategory;
  unsubscribe_method: UnsubscribeMethod;
  confidence: number;
  reason: string;
}

export interface Task2Output {
  is_subscription: boolean;
  method: UnsubscribeMethod;
  target: string | null;
  confidence: number;
}

export interface Task3Output {
  summary: string; // 3 bullets max
  action_items: string[];
  deadlines: string[];
  decisions: string[];
  recommended_action: 'keep' | 'trash' | 'unsubscribe' | 'reply';
}

export interface Task4Output {
  subject: string;
  body: string;
  tone: 'professional' | 'casual' | 'brief';
  requires_user_approval: boolean; // Must always be true according to Guardrail #1
}

export interface Task5Output {
  sender: string;
  recommendation: 'unsubscribe' | 'keep' | 'trash' | 'review';
  reason: string;
  confidence: number;
}

// EVALUATION FRAMEWORK TYPES
export interface EvaluationCase {
  id: string;
  name: string;
  taskNumber: 1 | 2 | 3 | 4 | 5;
  taskName: string;
  description: string;
  input: Record<string, unknown>;
  expectedKeys: string[];
  guardrailsToCheck: string[];
}

export interface EvaluationRunResult {
  caseId: string;
  caseName: string;
  taskNumber: number;
  passed: boolean;
  latencyMs: number;
  tokensUsed: number;
  schemaValid: boolean;
  guardrailCompliant: boolean;
  actualOutput: Record<string, unknown> | null;
  error?: string;
  validationNotes: string[];
}
