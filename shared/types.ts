export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export interface User {
  id: string;
  name: string;
}
export interface Chat {
  id: string;
  title: string;
}
export interface ChatMessage {
  id: string;
  chatId: string;
  userId: string;
  text: string;
  ts: number;
}
export interface ResearchProfile {
  legalName: string;
  state: string;
  industry: string;
}
export interface ResearchRecord {
  source: string;
  status: 'active' | 'inactive' | 'error' | 'not_found';
  details: string;
  rawUrl?: string;
  riskFlags: string[];
}
export interface ResearchResult {
  id: string;
  profile: ResearchProfile;
  timestamp: number;
  records: ResearchRecord[];
  overallRiskScore: number; // 0-100
  summary: string;
}