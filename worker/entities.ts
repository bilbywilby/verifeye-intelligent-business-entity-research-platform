import { IndexedEntity } from "./core-utils";
import type { User, Chat, ChatMessage, ResearchResult } from "@shared/types";
import { MOCK_CHATS, MOCK_USERS } from "@shared/mock-data";
export class UserEntity extends IndexedEntity<User> {
  static readonly entityName = "user";
  static readonly indexName = "users";
  static readonly initialState: User = { id: "", name: "" };
  static seedData = MOCK_USERS;
}
export class ResearchEntity extends IndexedEntity<ResearchResult> {
  static readonly entityName = "research";
  static readonly indexName = "researches";
  static readonly initialState: ResearchResult = {
    id: "",
    profile: { legalName: "", state: "", industry: "" },
    timestamp: 0,
    records: [],
    overallRiskScore: 0,
    summary: ""
  };
}
export type ChatBoardState = Chat & { messages: ChatMessage[] };
export class ChatBoardEntity extends IndexedEntity<ChatBoardState> {
  static readonly entityName = "chat";
  static readonly indexName = "chats";
  static readonly initialState: ChatBoardState = { id: "", title: "", messages: [] };
  async listMessages(): Promise<ChatMessage[]> {
    const { messages } = await this.getState();
    return messages;
  }
  async sendMessage(userId: string, text: string): Promise<ChatMessage> {
    const msg: ChatMessage = { id: crypto.randomUUID(), chatId: this.id, userId, text, ts: Date.now() };
    await this.mutate(s => ({ ...s, messages: [...s.messages, msg] }));
    return msg;
  }
}