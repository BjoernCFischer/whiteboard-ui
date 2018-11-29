import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { NoSseMessage } from '../model/no-sse-message';
import { map, startWith } from 'rxjs/operators';
import { Message } from '../model/message';
import { MessageType } from '../model/message-type.enum';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private http: HttpClient) {
  }

  resolveAllMessages(): Observable<Array<Message>> {
    return this.http.get<Array<NoSseMessage>>('/messagesnosse')
      .pipe(
        map(list => list.map(item => <any> this.mapNoSseMessage(item))),
        map(list => list.filter(item => item.type !== MessageType.UNKNOWN)),
      );
  }

  private mapNoSseMessage(value: NoSseMessage): Message {
    try {
      return JSON.parse(value.message);
    } catch (e) {
      return {
        type: MessageType.UNKNOWN,
        author: null,
        timestamp: null,
        content: null
      };
    }
  }

  deleteAllMessages(): Observable<any> {
    return this.http.delete('/clearmessages');
  }

  watchMessages(): Observable<any> {
    const eventSource = new EventSource('/messages');
    const message$ = new Subject<any>();

    eventSource.addEventListener('message', (item: any) => {
      message$.next(item.data);
    });

    return message$.pipe(
      startWith(null),
      map(value => this.mapNewMessage(value))
    );
  }

  private mapNewMessage(value: string): Message | null {
    try {
      return JSON.parse(value);
    } catch (e) {
      return null;
    }
  }
}
