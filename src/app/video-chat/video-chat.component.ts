import { AfterViewInit, Component, ChangeDetectorRef, ElementRef, OnInit, ViewChild } from '@angular/core';
import { VideoChatService } from './video-chat.service';
import { error } from 'console';
import { ChatTypesMessage } from './chat-types-message';
import { environment } from '../../environments/environment';
import { io, Socket } from 'socket.io-client';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SocketioService } from './socketio.service';
import { Subscription } from 'rxjs';
import { VideoService } from '../profile-edit/media-folder/media.service';
import { RecordVideoService } from '../profile-edit/media-folder/record-video/record-video.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { VideoObject } from './video-object';

type RecordingState = 'NONE' | 'RECORDING' | 'RECORDED';

@Component({
  selector: 'app-video-chat',
  templateUrl: './video-chat.component.html',
  styleUrls: ['./video-chat.component.css']
})
export class VideoChatComponent implements OnInit, AfterViewInit {
num: number = 0;
socket: any;
private SOCKETENDPOINT?: string;
connectTo: string = '';
username: string = '';
messages: string[] = [];
images: any;
multipleImages = [];
chatForm!: FormGroup;
receiveMessageSub: Subscription = new Subscription;
handshakeSub: Subscription = new Subscription;
@ViewChild('videoElement') videoElement: any;
videoBlobUrl: any = null;
video: any;
videoElConnectedUsers: VideoObject[] = [];
state: RecordingState = 'NONE';
recordType: boolean = false; // false will be video true will be canvas

mediaConstraints = {
  audio: true,
  video: { width: 720, height: 540}
}

offerOptionsRemoveInProduction = {
  offerToReceiveAudio: true, 
  offerToReceiveVideo: false
}

offerOptions = {
  offerToReceiveAudio: true,
  offerToReceiveVideo: true
}

private peerConnection!: RTCPeerConnection;

@ViewChild('local_video') localVideo!: ElementRef
@ViewChild('received_video') receivedVideo!: ElementRef
private localStream!: MediaStream

constructor(private videochatService: VideoChatService,
              private videoService: RecordVideoService,
              private socketIoService: SocketioService,
              private router: Router,
              private route: ActivatedRoute,
              private ref: ChangeDetectorRef,
              private sanitizer: DomSanitizer) { 
  // this.videoService.getMediastreamListener().subscribe((data) => {
  //   this.video.srcObject = data;
  //   this.ref.detectChanges();
  //   this.socketIoService.sendStream(data)
  // })
  // this.videoService.getBlobListener().subscribe((video) => {
  //   console.log('blob', video);
  //   this.video.srcObject = null;
  //   this.videoBlobUrl = this.sanitizer?.bypassSecurityTrustResourceUrl(video);
  //   this.videoElement.srcObject
  //   this.ref?.detectChanges();
  // })
}

  ngOnInit(): void {
      // this.videochatService.connect();
      this.requestMediaDevices()
      this.receiveMessageSub = this.socketIoService.messageUpdateListener().subscribe(message => {
      console.log('message from listener', message);
      this.messages.push(message);
      console.log('pushed to messages', message);
    });
    this.handshakeSub = this.socketIoService.handshakeListener().
    subscribe(res => {
      console.log('response')
    })
    this.socketIoService.connect();
    this.socket.on('message', (message: any)=> {
      console.log('message')
    })
    this.username = localStorage.getItem('username') as string;
    this.chatForm = new FormGroup({
      'user': new FormControl(this.username,{
        validators: [Validators.required]
      }),
      'message': new FormControl(null, {
        validators: [Validators.required]
      }) 
    })
  }
  ngAfterViewInit(): void {
    this.addIncomingMessageHandler();
    console.log('requested Media devices')
  }

  sendMessage() {
    const message = this.chatForm.value.message;
    const username = this.chatForm.value.username
    this.socketIoService.sendMessage(message);
    this.chatForm.reset()
  }

  ngOnDestroy() {
    this.receiveMessageSub.unsubscribe()
  }
  

  openRoom() {
    this.router.navigate([this.username], {relativeTo: this.route});
  }

 startStream() {
  this.videoService.startRecording();
 }
 pauseStream() {
  this.video.srcObject = null;
 }


  private addIncomingMessageHandler() {
    this.socketIoService.connect();
    this.socketIoService.handshakeListener().
    subscribe(res => {
      switch (res.type) {
        case 'offer':
          this.handleOfferMesssage(res.data);
          break;
        case 'answer':
            this.handleAnswerMessage(res.data);
            break;
        case 'hangup':
              this.handleHangupMessage(res);
              break;
        case 'ice-candidate':
                this.handleIceCandidateMessage(res.data);
                break;
                default:
                  console.log('unknown message of type' + res.type)
      }
    }, 
      error => {
        console.log('error', error);
      }
    );
  }
  handleOfferMesssage(msg: RTCSessionDescription):void {
    if(this.peerConnection) {
      this.createPeerConnection();
    }

    if(this.localStream) {
      this.startLocalVideo();
    }
    this.peerConnection.setRemoteDescription(new RTCSessionDescription(msg)).
      then(() => {
        this.localVideo.nativeElement.srcObject = this.localStream;

        this.localStream?.getTracks().forEach(track => {
          this.peerConnection.addTrack(track, this.localStream!)
        })
      }).
        then(() => {
          return this.peerConnection.createAnswer()
        }).
          then((answer) => {
            return this.peerConnection.setLocalDescription(answer);
          }).
          then(() => {
            this.socketIoService.initiateRequest({type: 'answer', data: this.peerConnection.localDescription});
          }).
          catch(this.handleGetUserMediaError);
  }
  private handleAnswerMessage(data: RTCSessionDescriptionInit): void {
    this.peerConnection.setRemoteDescription(data);
  }
  private handleHangupMessage(msg: ChatTypesMessage): void {
    this.closeVideoCall();
  }
  private handleIceCandidateMessage(data: RTCIceCandidateInit | undefined): void {
    this.peerConnection.addIceCandidate(data).
      catch(this.reportError)
  }
  reportError = (error: Error) => {
    console.log('got error', + error.name, error)
  }

  hangup(): void {
    this.socketIoService.initiateRequest({type: 'hangup', data: ''});
    this.closeVideoCall();
  }
  selectImage(event: any){
    if(event.target != null) {
      if(event.target.files.length > 0) {
        const file = event.target.files[0];
        console.log(file);
        this.images = file
      }
    }

    }
  private async  requestMediaDevices(): Promise<void> {
    this.localStream = await navigator.mediaDevices.getUserMedia(this.mediaConstraints)
    console.log('local stream', this.localStream)
    this.startLocalVideo();
    // this.pauseLocalVideo()
    
  }

  pauseLocalVideo(): void {
    this.localStream?.getTracks().forEach(track => {
      track.enabled = false;
    });
    this.localVideo.nativeElement.srcObject = undefined;
  }

  startLocalVideo(): void {
    this.localStream?.getTracks().forEach(track => {
      console.log('local video started')
      track.enabled = true;
    });
    this.localVideo.nativeElement.srcObject = this.localStream;
  }

  async call(): Promise<void> {
    console.log('this peer connection', this.peerConnection)
    this.localStream?.getTracks().forEach(track => this.peerConnection.addTrack(track, this.localStream!));
    try {
      const offer: RTCSessionDescriptionInit = await this.peerConnection.createOffer(this.offerOptions);
      await this.peerConnection.setLocalDescription(offer)
      this.socketIoService.initiateRequest({type: 'offer', data: offer})
    }
    catch (err: any) {
      this.handleGetUserMediaError(err);
    }
  }

  handleGetUserMediaError(err: Error) {
    switch (err.name) {
      case 'NotFoundError':
        alert('unable to open call because no camera and/or microphone were found');
        break;
      case 'SeurityError':
      case 'PermissionDeniedError':
        break;
        default:
          console.log('error',err);
          alert('Error opening your camera' + err.message)
          break;
    }
    this.closeVideoCall();
  }

  private handleIceCandidateEvent = (event: RTCPeerConnectionIceEvent) => {
    console.log('event', event);
    if (event.candidate) {
      this.socketIoService.initiateRequest({
        type: 'ice-candidate',
        data: event.candidate
      })
    }
  }

  private handleIceConnectionStateChangeEvent = (event: Event) => {
    console.log(event);
    switch (this.peerConnection.iceConnectionState) {
      case 'closed':
      case 'failed':
      case 'disconnected':
        this.closeVideoCall();
        break;
    }
  }

  private handleSignalingStateEvent = (event: Event) => {
    console.log(event)
    switch (this.peerConnection.signalingState) {
      case 'closed':
        this.closeVideoCall();
    }
  }

  private handleTrackEvents = (event: RTCTrackEvent) => {
    console.log(event);
    this.receivedVideo.nativeElement.srcObject = event.streams[0];
  }

  createPeerConnection():void {
    this.peerConnection = new RTCPeerConnection({
      iceServers: [
        {
          urls: ['stun:stun.wwdl.net:3478']
        }
      ]
    })
    this.peerConnection.onicecandidate = this.handleIceCandidateEvent;
    this.peerConnection.onicegatheringstatechange = this.handleIceConnectionStateChangeEvent;
    this.peerConnection.onsignalingstatechange = this.handleSignalingStateEvent;
    this.peerConnection.ontrack = this.handleTrackEvents;
  }

  private closeVideoCall(): void {
    if (this.peerConnection) {
      this.peerConnection.onicecandidate = null;
    this.peerConnection.onicegatheringstatechange = null;
    this.peerConnection.onsignalingstatechange = null;
      this.peerConnection.ontrack = null;
    }
    this.peerConnection.getTransceivers().forEach(transreceiver => {
      transreceiver.stop();
    });
    this.peerConnection.close();
    this.localStream?.getTracks().forEach(track => track.stop());;
    
  }

  onSubmit() {
    // construct form data
    const formdata = new FormData()
    formdata.append('file', this.images)
    // post request to backend
    this.socketIoService.chatRequest(formdata)
  }
}
