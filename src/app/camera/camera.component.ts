import { Component, OnInit, ViewChild } from '@angular/core';
import {ZXingScannerComponent} from '@zxing/ngx-scanner';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss']
})
export class CameraComponent implements OnInit {
  
  constructor() { }

  @ViewChild('scanner', { static: false })
  scanner: ZXingScannerComponent;

  mediaButtonClicked = false;

  stream: MediaStream;
  track: MediaStreamTrack;
  imageCapture: ImageCapture;
  photoCapabilities: PhotoCapabilities;
  photoSettings: PhotoSettings;
  mediaTrackCapabilities: MediaTrackCapabilities;
  mediaTrackSettings: MediaTrackSettings;

  wantLight: boolean;

  constraints: MediaTrackConstraints;

  trackBarResolution: any;
  trackBarZoom: any;
  trackBarZoomValue: any;
  trackBarBrightness: any;
  trackBarBrightnessValue: any;
  trackBarContrast: any;
  trackBarContrastValue: any;
  trackBarSaturation: any;
  trackBarSaturationValue: any;
  trackBarSharpness: any;
  trackBarSharpnessValue: any;
  trackBarFocusDistance: any;
  trackBarFocusDistanceValue: any;


  ngOnInit(): void {
  }

  onGetUserMediaButtonClick(): void {
    this.mediaButtonClicked = true;
    navigator.mediaDevices.getUserMedia({video: {facingMode:['environment'],}})
      .then(mediaStream => {
        this.stream = mediaStream;
        (document.querySelector('#videoStream') as HTMLVideoElement).srcObject = this.stream;
        this.track = this.stream.getVideoTracks()[0];
        this.imageCapture = new ImageCapture(this.track);
        return this.imageCapture.getPhotoCapabilities();
      })
      .then(photoCapabilities => {
        this.photoCapabilities = photoCapabilities
        return this.imageCapture.getPhotoSettings()
      })
      .then(photoSettings => {
        this.photoSettings = photoSettings
        return this.track.getCapabilities();
      })  
      .then(mediaTrackCapabilities => {
        this.mediaTrackCapabilities = mediaTrackCapabilities;  
        this.mediaTrackSettings = this.track.getSettings();
        this.initUI();
      })
      .catch(error => {
        console.log('Oh, no!', error.name || error)
      });
  }

  initUI(): void {
    this.initResolution();
    this.initZoom();
  }

  initResolution(): void {
    this.trackBarResolution = document.querySelector('#changeResolutionRange');
    this.trackBarResolution.min = this.photoCapabilities.imageWidth.min;
    this.trackBarResolution.max = this.photoCapabilities.imageWidth.max;
    this.trackBarResolution.step = this.photoCapabilities.imageWidth.step;
    this.trackBarResolution.value = this.photoSettings.imageWidth;
  }

  initZoom(): void {
    this.trackBarZoom = document.querySelector('#changeZoomRange');
    this.trackBarZoomValue = document.querySelector('#valueChangeZoomRange');
    this.trackBarZoom.min = this.mediaTrackCapabilities.zoom.min;
    this.trackBarZoom.max = this.mediaTrackCapabilities.zoom.max;
    this.trackBarZoom.step = this.mediaTrackCapabilities.zoom.step;
    this.trackBarZoom.value = this.mediaTrackSettings.zoom;
    
    this.trackBarZoom.addEventListener('change', (event) => {
      this.trackBarZoomValue.value = this.trackBarZoom.value;
      this.track.applyConstraints({
        advanced: [{zoom: event.target.value}]
      })
    })
  }

  initBrightness(): void {
    this.trackBarBrightness = document.querySelector('#changeBrightnessRange');
    this.trackBarBrightnessValue = document.querySelector('#valuechangeBrightnessRange');
    this.trackBarBrightness.min = this.mediaTrackCapabilities.brightness.min;
    this.trackBarBrightness.max = this.mediaTrackCapabilities.brightness.max;
    this.trackBarBrightness.step = this.mediaTrackCapabilities.brightness.step;
    this.trackBarBrightness.value = this.mediaTrackSettings.brightness;
    
    this.trackBarBrightness.addEventListener('change', (event) => {
      this.trackBarBrightnessValue.value = this.trackBarBrightness.value;
      this.track.applyConstraints({
        advanced: [{brightness: event.target.value}]
      })
    })
  }

  initContrast(): void {
    this.trackBarContrast = document.querySelector('#changeContrastRange');
    this.trackBarContrastValue = document.querySelector('#valuechangeContrastRange');
    this.trackBarContrast.min = this.mediaTrackCapabilities.contrast.min;
    this.trackBarContrast.max = this.mediaTrackCapabilities.contrast.max;
    this.trackBarContrast.step = this.mediaTrackCapabilities.contrast.step;
    this.trackBarContrast.value = this.mediaTrackSettings.contrast;
    
    this.trackBarContrast.addEventListener('change', (event) => {
      this.trackBarContrastValue.value = this.trackBarContrast.value;
      this.track.applyConstraints({
        advanced: [{contrast: event.target.value}]
      })
    })
  }

  initSaturation(): void {
    this.trackBarSaturation = document.querySelector('#changeSaturationRange');
    this.trackBarSaturationValue = document.querySelector('#valuechangeSaturationRange');
    this.trackBarSaturation.min = this.mediaTrackCapabilities.saturation.min;
    this.trackBarSaturation.max = this.mediaTrackCapabilities.saturation.max;
    this.trackBarSaturation.step = this.mediaTrackCapabilities.saturation.step;
    this.trackBarSaturation.value = this.mediaTrackSettings.saturation;
    
    this.trackBarSaturation.addEventListener('change', (event) => {
      this.trackBarSaturationValue.value = this.trackBarSaturation.value;
      this.track.applyConstraints({
        advanced: [{saturation: event.target.value}]
      })
    })
  }

  initSharpness(): void {
    this.trackBarSharpness = document.querySelector('#changeSharpnessRange');
    this.trackBarSharpnessValue = document.querySelector('#valuechangeSharpnessRange');
    this.trackBarSharpness.min = this.mediaTrackCapabilities.sharpness.min;
    this.trackBarSharpness.max = this.mediaTrackCapabilities.sharpness.max;
    this.trackBarSharpness.step = this.mediaTrackCapabilities.sharpness.step;
    this.trackBarSharpness.value = this.mediaTrackSettings.sharpness;
    
    this.trackBarSharpness.addEventListener('change', (event) => {
      this.trackBarSharpnessValue.value = this.trackBarSharpness.value;
      this.track.applyConstraints({
        advanced: [{sharpness: event.target.value}]
      })
    })
  }

  initFocusDistance(): void {
    this.trackBarFocusDistance = document.querySelector('#changeFocusDistanceRange');
    this.trackBarFocusDistanceValue = document.querySelector('#valuechangeFocusDistanceRange');
    this.trackBarFocusDistance.min = this.mediaTrackCapabilities.focusDistance.min;
    this.trackBarFocusDistance.max = this.mediaTrackCapabilities.focusDistance.max;
    this.trackBarFocusDistance.step = this.mediaTrackCapabilities.focusDistance.step;
    this.trackBarFocusDistance.value = this.mediaTrackSettings.focusDistance;
    
    this.trackBarFocusDistance.addEventListener('change', (event) => {
      this.trackBarFocusDistanceValue.value = this.trackBarFocusDistance.value;
      this.track.applyConstraints({
        advanced: [{focusDistance: event.target.value}]
      })
    })
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

  onCodeResult(result: String): void {
    this.onTakePhotoButtonClick();
    this.scanner.reset();
  }

  onCanvasClick(): void {

  }

}