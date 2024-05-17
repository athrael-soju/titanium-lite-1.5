interface IUser {
  email: string;
  name: string;

  // assistant
  assistantId?: string | null;
  isAssistantEnabled: boolean;
  threadId?: string | null;

  // speech
  isTextToSpeechEnabled: boolean;
  model: string;
  voice: string;

  // vision
  isVisionEnabled: boolean;
  visionId: string;

  // r.a.g.
  isRagEnabled: boolean;
  ragId?: string | null;
  topK: string;
  chunkSize: string;
  chunkBatch: string;
  parsingStrategy: string;

  // persistent memory
  isLongTermMemoryEnabled: boolean;
  memoryType: string;
  historyLength: string;
}
