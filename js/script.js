
+function () {
  const playEle = document.querySelector('.play');
  const canvasEle = document.querySelector('canvas');
  const audioEle = document.querySelector('audio');
  const canvasCtx = canvasEle.getContext('2d');
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const source = audioCtx.createMediaElementSource(audioEle);
  const analyser = audioCtx.createAnalyser();
  const gain = audioCtx.createGain();

  source.connect(analyser);
  source.connect(gain);
  gain.connect(audioCtx.destination);

  canvasEle.width = window.innerWidth;
  canvasEle.height = window.innerHeight;

  const WIDTH = canvasEle.width;
  const HEIGHT = canvasEle.height;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  function draw() {
    let i = 0;
    let x = 0;
    let barHeight;
    const barWidth = (WIDTH / bufferLength) * 2.5;
    const drawVisual = requestAnimationFrame(draw);

    analyser.getByteFrequencyData(dataArray);

    canvasCtx.fillStyle = '#222';
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

    for (i; i < bufferLength; i++) {
      barHeight = dataArray[i] * 5;

      canvasCtx.fillStyle = '#BF7BFF';
      canvasCtx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight);

      x += barWidth + 1;
    }
  }

  draw();
  playEle.addEventListener('click', () => audioEle.play());

}();
