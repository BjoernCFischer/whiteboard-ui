import { MessageType } from './message-type.enum';

export interface Message {
  type: MessageType;
  author: string;
  content: string;
  timestamp: number;
}
