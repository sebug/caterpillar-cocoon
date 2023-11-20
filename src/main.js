console.log(window.BarcodeDetector);

const activateCameraButton = document.querySelector('#activate-camera');
const canvasElement = document.querySelector('#barcode-canvas');
const ctx = canvasElement.getContext('2d');
const videoElement = document.querySelector('#barcode-video');
const resultsElement = document.querySelector('#results');

let requestId = null;
let supportedFormats;
let detector;

const createDetector = async () => {
    supportedFormats = await BarcodeDetector.getSupportedFormats();
    detector = new BarcodeDetector({ formats: supportedFormats });
};

const detect = async source => {
    let symbols = await detector.detect(source);
    canvasElement.width = source.naturalWidth || source.videoWidth || source.width;
    canvasElement.height = source.naturalHeight || source.videoHeight || source.height;
    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);

    symbols.forEach(symbol => {
        const lastCornerPoint = symbol.cornerPoints[symbol.cornerPoints.length - 1];
        ctx.moveTo(lastCornerPoint.x, lastCornerPoint.y);
        symbol.cornerPoints.forEach(point => ctx.lineTo(point.x, point.y));

        ctx.lineWidth = 3;
        ctx.strokeStyle = '#00e000ff';
        ctx.stroke();
    });

    if (symbols && symbols.length && symbols[0].rawValue) {
        resultsElement.innerText = symbols[0].rawValue;
    } else {
        resultsElement.innerText = '';
    }
};

const detectVideo = async repeat => {
    if (!repeat) {
        ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    }

    if (typeof repeat === 'undefined') {
        repeat = true;
    }

    if (repeat) {
        await detect(videoElement);
        requestId = requestAnimationFrame(() => detectVideo(true));
    } else {
        cancelAnimationFrame(requestId);
        requestId = null;
    }
};

createDetector();

activateCameraButton.addEventListener('click', async () => {
    activateCameraButton.style.display = 'none';
    let stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: 'environment' }});
    videoElement.srcObject = stream;
    detectVideo();
});