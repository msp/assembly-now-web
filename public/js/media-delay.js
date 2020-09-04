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
    const mimeType = 'video/webm; codecs="opus,vp9"';
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
        await this.streamAddedCallback();
        this.streamAddedCallbackCalled = true;
      }
    }.bind(this), false);
    this.videoElement.play();
    this.mediaRecorder.ondataavailable = function(event) {
      var reader = new FileReader();
      reader.addEventListener("loadend", function() {
        var arr = new Uint8Array(reader.result);
        sourceBuffer.appendBuffer(arr);
      });
      reader.readAsArrayBuffer(event.data);
    };
    this.mediaRecorder.start(10000);
  }

  finalize() {
    this.mediaRecorder.ondataavailable = null;
    this.mediaRecorder.stop();
    this.delayedStream = null;
    this.mediaRecorder = null;
    this.streamAddedCallbackCalled = false;
  }

}

export { MediaDelay }
