import { Directive } from '@angular/core';

@Directive({
  selector: '[appCheckFileExtension]'
})
export class CheckFileExtensionDirective {

  constructor() { }
  getExtension(fileName: string | File) {
    let fileExt;
    if(typeof fileName == 'string' ) {
      fileExt = fileName.split('.').pop();
    } console.log('file extension', fileExt)
    if(fileExt == 'png' || 'jpg' || 'gif' && fileExt){
      return 'image'
    } 
    if(fileExt == 'mov' || 'wmv' || 'webm' || 'm3u8' || 'ts' || 'ogg' || 'JPEG' || 'MPV'|| '3gpp' || '3gpp2' || 'flv' || 'avi' && fileExt) {
      console.log('in video')
      return 'video'
    } else {
      return
    }
  }
}
