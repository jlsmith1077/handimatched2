import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { ChatTypesMessage } from './chat-types-message';
import * as WebSocket from 'ws';
import {io} from 'socket.io-client'

export const WS_ENDPOINT = 'wss://api.jermainsprojects.com:8081';

@Injectable({
  providedIn: 'root'
})
export class VideoChatService {

  private socket$!: WebSocketSubject<ChatTypesMessage>;
  private messagesSubject = new Subject<ChatTypesMessage>();
  public messages$ = this.messagesSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  public connect(): void {
    this.socket$ = this.getNewWebSocket()
    this.socket$.subscribe(msg => {
      console.log('received message of type' + msg.data);
      this.messagesSubject.next(msg)
    })
  }

  private getNewWebSocket(): WebSocketSubject<any> {
    return webSocket({
      url: WS_ENDPOINT,
      openObserver: {
        next: () => {
          console.log('Video-Chat-Service: Connection Good!');
        }
      },
      closeObserver: {
        next: () => {
          console.log('Video-Chat-Service: Connection Closed')
          this.socket$.closed = true
          this.connect();
        }
      }
    })
  }

  sendMessage(msg: ChatTypesMessage): void {
    console.log('sending message:', + msg.type);
    this.socket$.next(msg);
  }

  chatRequest(data: any) {
    this.http.post<any>("http//:localhost:3000/file", data).
      subscribe(result => {
        console.log('results from chatRequest', result)
      })
  }
}
