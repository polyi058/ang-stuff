import { Component, OnInit } from '@angular/core';
import { Settings } from 'http2';
import { Capabilities } from 'protractor';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss']
})
export class CameraComponent implements OnInit {
  
  constructor() { }

  imageCapture: ImageCapture
  stream: MediaStream
  track: MediaStreamTrack
  wantLight: boolean

  photoSettings: PhotoSettings;
  capabilities: MediaTrackCapabilities;

  constraints: MediaTrackConstraints;

  trackBarResolution: any;
  trackBarZoom: any;
  zoomSliderValue: any;

  ngOnInit(): void {
  }

  onGetUserMediaButtonClick(): void {
    navigator.mediaDevices.getUserMedia({video: {facingMode:['environment'],}})
      .then(mediaStream => {
        this.stream = mediaStream;
        (document.querySelector('#videoStream') as HTMLVideoElement).srcObject = this.stream;
        this.track = this.stream.getVideoTracks()[0];
        this.imageCapture = new ImageCapture(this.track);
        return this.imageCapture.getPhotoCapabilities();
      })
      .then(photoCapabilities => {
        this.initializeTrackbarResolution(photoCapabilities);
        return this.imageCapture.getPhotoSettings()
      })
      .then(photoSettings => {
        this.photoSettings = photoSettings
        this.trackBarResolution.value = this.photoSettings.imageWidth;
        return this.track.getCapabilities();
      })  
      .then(capabilities => {
        this.capabilities = capabilities;
        this.trackBarZoom = document.querySelector('#changeZoomRange');
        this.zoomSliderValue = document.querySelector('#valueChangeZoomRange');
        this.trackBarZoom.min = this.capabilities.zoom.min;
        this.trackBarZoom.max = this.capabilities.zoom.max;
        this.trackBarZoom.step = this.capabilities.zoom.step;
        let settings = this.track.getSettings();
        this.trackBarZoom.value = settings.zoom;

        this.trackBarZoom.addEventListener('change', (event) => {
          this.zoomSliderValue.value = this.trackBarZoom.value;
          this.track.applyConstraints({
            advanced: [{zoom: event.target.value}]
          })
        })
      })
      .catch(error => {
        console.log('Oh, no!', error.name || error)
      });
  }

  initializeTrackbarResolution(photoCapabilities): void {
    this.trackBarResolution = document.querySelector('#changeResolutionRange');
    this.trackBarResolution.min = photoCapabilities.imageWidth.min;
    this.trackBarResolution.max = photoCapabilities.imageWidth.max;
    this.trackBarResolution.step = photoCapabilities.imageWidth.step;
  }

  onTakePhotoButtonClick(): void {
    this.imageCapture.takePhoto({imageWidth: this.trackBarResolution.value})
    .then(blob => createImageBitmap(blob))
    .then(imageBitmap => {
      const canvas = document.querySelector('#takePhotoCanvas');
      this.drawCanvas(canvas, imageBitmap);
    })
    .catch(error => console.log(error));
  }

  onToggleFlashButtonClick(): void {
    this.wantLight = !this.wantLight;
    this.track.applyConstraints({
      advanced: [{torch: this.wantLight}]
    })
  }

  onApplyConstraintsButtonClick(): void {
    this.track.applyConstraints({
      advanced: [{zoom: (this.trackBarZoom.value as W3C.ConstrainNumber)}]
    });
  }

  drawCanvas(canvas, img): void {
    canvas.width = getComputedStyle(canvas).width.split('px')[0];
    canvas.height = getComputedStyle(canvas).height.split('px')[0];
    let ratio  = Math.min(canvas.width / img.width, canvas.height / img.height);
    let x = (canvas.width - img.width * ratio) / 2;
    let y = (canvas.height - img.height * ratio) / 2;
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height,
        x, y, img.width * ratio, img.height * ratio);
  }

}