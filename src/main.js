console.log(window.BarcodeDetector);

const activateCameraButton = document.querySelector('#activate-camera');
const canvasElement = document.querySelector('#barcode-canvas');
const videoElement = document.querySelector('#barcode-video');

const detectVideo = repeat => {

};

activateCameraButton.addEventListener('click', async () => {
    let stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: 'environment' }});
    videoElement.srcObject = stream;
    detectVideo();
});