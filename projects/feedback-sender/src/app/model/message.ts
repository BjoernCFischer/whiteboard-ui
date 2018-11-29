import { MessageType } from './message-type.enum';

export class Message {
  type: MessageType;
  author: string;
  content: string;
  timestamp: number;
}
