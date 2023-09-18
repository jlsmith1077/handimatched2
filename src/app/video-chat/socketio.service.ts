import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { io, Socket } from 'socket.io-client'
import { Subject } from 'rxjs';
import { ChatTypesMessage } from './chat-types-message';

@Injectable({
  providedIn: 'root'
})
export class SocketioService {
  private socket!: Socket
  private message!: any;
  private messageUpdated = new Subject<string>();
  private handshake = new Subject<ChatTypesMessage>();
  private creator = localStorage.getItem('creator') as string;
  private username = localStorage.getItem('username') as string;
  private socketURL = environment.websocketURL
  


  messageUpdateListener() {
    return this.messageUpdated.asObservable();
  }
  handshakeListener() {
    return this.handshake.asObservable();
  }

    constructor() {
     }

  connect() { 
    console.log('connected in service')
    this.socket = io(this.socketURL, {
      transports: ['websocket']
    });

    this.socket.on('startMessage', (message) => {
      this.messageUpdated.next(message);
    })

    this.socket.emit('join-room', this.username, this.username)

    this.socket.emit('startMessage', 'emitting to message socket')
    
    this.socket.on('message', (message) => {
      this.messageUpdated.next(message);
    })
    this.socket.on('handshake', (message) => {
      this.handshake.next(message);
    })

    this.socket.on('sendStream', (stream) => {
      this.messageUpdated.next(stream);
    })

  }

  increment() {
    console.log('incrementing count')
    this.socket.emit('increment')
  }

  chatRequest(data: any) {
    this.connect();
  }

  initiateRequest(msg: ChatTypesMessage): void {
    console.log('sending initial request:', + msg.type);
    this.socket.emit('handshake', msg);
  }
  sendMessage(msg: string): void {
    console.log('sending message:', + msg);
    this.socket.emit('message', msg);
  }

  sendStream(data: any) {
    console.log('data socketio service', data)
    const formData = new FormData();
    formData.append('video', data)
    this.socket.on('sendStream', (formData) => {})
    this.socket.emit('sendStream', formData, (message: any, error: Error) => {
      if(error) {
        return console.log(error)
      }
    })
  }

  meessage(message: string) {
    this.socket.on('message', () => {
    })
  this.socket.emit('message', message, (message: any, error: Error) => {
    if(error) {
      return console.log(error)
      }
    })
  }




}
