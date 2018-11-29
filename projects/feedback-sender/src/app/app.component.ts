import { Component, OnInit } from '@angular/core';
import { MessageService } from './message/message.service';
import { Message } from './model/message';
import { MessageType } from './model/message-type.enum';

@Component({
  selector: 'sse-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  private readonly AUTHOR_KEY = 'sse.author';

  message: string;
  author: string;
  authorEditable: boolean;
  disabled: boolean;
  wait = 0;

  constructor(private messageService: MessageService) {
    this.disabled = false;
    this.wait = 0;
  }

  ngOnInit(): void {
    this.author = localStorage.getItem(this.AUTHOR_KEY);
    this.authorEditable = !this.author;
  }

  onSendMessage() {
    const message = new Message();
    message.content = this.message;
    message.author = this.author;
    message.type = MessageType.PLAIN_TEXT;
    message.timestamp = Date.now();

    this.persistAuthor();
    this.clearMessageValue();
    this.disableButton(true);
    this.messageService.addMessage(message)
      .toPromise()
      .then(() => this.clearBlocking(10000));
  }

  private persistAuthor() {
    localStorage.setItem(this.AUTHOR_KEY, this.author);
    this.authorEditable = false;
  }

  private clearMessageValue() {
    this.message = null;
  }

  private disableButton(value: boolean) {
    this.disabled = value;
  }

  private updateWait(value: number) {
    this.wait = value;
  }

  private clearBlocking(time: number) {
    this.updateWait(10);

    const timer = setInterval(() => {
      time -= 1000;
      this.wait--;

      if (time <= 0) {
        this.updateWait(0);
        this.disableButton(false);
        clearInterval(timer);
      }
    }, 1000);
  }


}
