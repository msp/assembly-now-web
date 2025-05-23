class MediaDelay {
  constructor(stream, videoElement) {
    this.originalStream  = stream;
    this.videoElement = videoElement;

    this.mediaRecorder = null;
    this.delayedStream = null;
    this.streamAddedCallback = null;
    this.streamAddedCallbackCalled = false;
  }

  initialize() {
    if(!window.MediaRecorder) {
      this.videoElement.srcObject = this.originalStream;
      this.videoElement.muted = true;
      if(this.streamAddedCallback && !this.streamAddedCallbackCalled) {
        this.streamAddedCallback();
        this.streamAddedCallbackCalled = true;
      }
      return;
    }
    // Check for supported MIME types with fallbacks for Safari
    let mimeType;
    if (MediaRecorder.isTypeSupported('video/webm; codecs="opus,vp8"')) {
      mimeType = 'video/webm; codecs="opus,vp8"';
    } else if (MediaRecorder.isTypeSupported('video/mp4; codecs="avc1.42E01E,mp4a.40.2"')) {
      mimeType = 'video/mp4; codecs="avc1.42E01E,mp4a.40.2"';
    } else if (MediaRecorder.isTypeSupported('video/webm')) {
      mimeType = 'video/webm';
    } else if (MediaRecorder.isTypeSupported('video/mp4')) {
      mimeType = 'video/mp4';
    } else {
      console.error('No supported MediaRecorder MIME types found');
      return;
    }
    
    var sourceBuffer;
    this.mediaRecorder = new MediaRecorder(this.originalStream, {
      mimeType: mimeType
    });
    const delayedStream = new MediaSource();
    this.videoElement.pause();
    this.videoElement.srcObject = null;
    this.videoElement.src = null;
    this.videoElement.src = URL.createObjectURL(delayedStream);
    this.delayedStream = delayedStream;
    delayedStream.addEventListener('sourceopen', async function(event) {
      sourceBuffer = delayedStream.addSourceBuffer(mimeType);
      if(this.streamAddedCallback && !this.streamAddedCallbackCalled) {
        this.streamAddedCallbackCalled = true;
        await this.streamAddedCallback();
      }
    }.bind(this), false);
    this.mediaRecorder.ondataavailable = function(event) {
      var reader = new FileReader();
      reader.addEventListener("loadend", function() {
        var arr = new Uint8Array(reader.result);
        sourceBuffer.appendBuffer(arr);
      });
      reader.readAsArrayBuffer(event.data);
    };
    this.mediaRecorder.start(3000);
  }

  finalize() {
    if(!window.MediaRecorder) {
      if (this.videoElement.srcObject == this.originalStream) {
        this.videoElement.srcObject = null;
      }
      this.videoElement.muted = false;
      this.streamAddedCallbackCalled = false;
      return;
    }
    if(this.mediaRecorder) {
      this.mediaRecorder.ondataavailable = null;
      this.mediaRecorder.stop();
    }
    this.delayedStream = null;
    this.mediaRecorder = null;
    this.streamAddedCallbackCalled = false;
  }

}

export { MediaDelay }
