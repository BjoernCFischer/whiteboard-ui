import { Component, OnInit } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { MessageService } from './message/message.service';
import { Message } from './model/message';
import { map } from 'rxjs/operators';

@Component({
  selector: 'sse-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  messages$: Observable<Array<Message>>;

  constructor(private messageService: MessageService) {
  }

  ngOnInit(): void {
    this.reloadMessages();
  }

  private reloadMessages() {
    this.messages$ = combineLatest(this.messageService.resolveAllMessages(), this.messageService.watchMessages())
      .pipe(
        map(([messages, newMessage]) => this.addMessage(messages, newMessage)),
        map(list => list.sort((a, b) => b.timestamp - a.timestamp))
      );
  }

  private addMessage(messages: Array<Message>, message: Message): Array<Message> {
    if (message) {
      messages.push(message);
    }

    return messages;
  }

  onResetMessages() {
    this.messageService.deleteAllMessages()
      .toPromise()
      .then(() => this.reloadMessages());
  }
}
