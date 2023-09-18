import { Injectable } from '@angular/core';
import * as RecordRTC from 'recordrtc';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { last, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

const backendURL = environment.apiURL + "/video/";
const videoLength: number = 0;


@Injectable()
export class RecordVideoService {
    private savedStream: any = null;
    private mediaStream: any = null;
    private recorder: any = null;
    private blob: any;
    private _mediaStream = new Subject<any>();
    private _blob = new Subject<any>();

    constructor(private http: HttpClient) {}

    getBlobListener() {
        return this._blob.asObservable();
    }
    
    getMediastreamListener() {
        return this._mediaStream.asObservable();
    }

    
    async handleRecording() {
        this.mediaStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true
          });
          this._mediaStream.next(this.mediaStream);
          this.recorder = new RecordRTC(this.mediaStream, { type: 'video',
            mimeType: 'video/webm;codecs=vp9',
            recorderType: RecordRTC.MediaStreamRecorder
            });
          this.recorder.startRecording();
    }
    

    startRecording() {
        this.handleRecording();
    }

    async handleCanvasRecording() {
        this.mediaStream = await navigator.mediaDevices.getDisplayMedia({
            audio: true,
            video: true
          });
          this._mediaStream.next(this.mediaStream);
          this.recorder = new RecordRTC(this.mediaStream, { type: 'video',
            mimeType: 'video/webm;codecs=vp9',
            recorderType: RecordRTC.MediaStreamRecorder });
    }
    
    startCanvasRecording() {
        this.handleCanvasRecording()
    }
    stopRecording() {
        if (!this.recorder) {
            return;
          }
        this.recorder.stopRecording(() => {
            this.blob = this.recorder.getBlob();
            this.blob = new File([this.blob], 'handimatched-video', {
                type: 'video/webm'
            });
            console.log('blob', this.blob, this.blob.filename)
            this._blob.next(URL.createObjectURL(this.blob));
            this.mediaStream.stop();
            this.recorder.destroy();
            this.mediaStream = null;
            this.recorder = null;
          })
    }

    saveRecording(t: string) {
        const date = new Date().toISOString()
        const creator = localStorage.getItem('userId') as string;
        const username = localStorage.getItem('userId') as string;
        const title =  t;
        const videoData = new FormData();
        videoData.append('title', title),
        videoData.append('username', username),
        videoData.append('creator', creator),
        videoData.append("video", this.blob)
        this.http.put<{message: string}>(backendURL, videoData).
        subscribe(res => {
            console.log('backend made it', res.message)
            alert(res.message);
        })
    }
    downloadRecording() {
        RecordRTC.invokeSaveAsDialog(this.blob, `${Date.now()}.webm`);
    }

    clearRecording() {
        this.blob = null;
        this.recorder = null;
        this.mediaStream = null;
    }

}