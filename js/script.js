+function () {

  navigator.getUserMedia = navigator.getUserMedia
    || navigator.webkitGetUserMedia
    || navigator.mozGetUserMedia;

  navigator.getUserMedia({ video: false, audio: true }, callback, console.log);

  function callback(stream) {

    // Button and Input Elements
    const playEle = document.querySelector('.play');
    const pauseEle = document.querySelector('.pause');
    const gainEle = document.querySelector('.gain');
    const distortionEle = document.querySelector('.distortion');
    const urssModeEle = document.querySelector('.urss-mode');

    // Canvas, Img and Audio Elements
    const canvasEle = document.querySelector('canvas');
    const audioEle = document.querySelector('audio');
    const img = document.querySelector('.stalin');
    const canvasCtx = canvasEle.getContext('2d');

    // Audio Context and Effects
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();
    const gain = audioCtx.createGain();
    const dist = audioCtx.createWaveShaper();

    source.connect(dist);
    dist.connect(gain);
    gain.connect(analyser);
    analyser.connect(audioCtx.destination);

    canvasEle.width = window.innerWidth;
    canvasEle.height = window.innerHeight;

    let showImg = false;
    let backgroundColor = '#222';
    let barColor = 'rgba(158, 67, 243, $s)';
    const WIDTH = canvasEle.width;
    const HEIGHT = canvasEle.height;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function draw() {
      let i = 0;
      let x = 0;
      let barHeight;
      const barWidth = (WIDTH / bufferLength) * 2.5;

      requestAnimationFrame(draw);

      canvasCtx.fillStyle = backgroundColor;
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
      analyser.getByteFrequencyData(dataArray);

      if (showImg) canvasCtx.drawImage(img, (WIDTH / 2) - (img.width / 2), (HEIGHT / 2) - (img.height / 2));

      for (i; i < bufferLength; i++) {
        barHeight = dataArray[i] * 3;
        dataArray[i] = dataArray[i] - 5;

        canvasCtx.fillStyle = barColor.replace('$s', barHeight / 350);
        canvasCtx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight);

        x += barWidth + 1;
      }
    }

    function makeDistortionCurve(amount) {
      let x;
      let i = 0;
      const k = Number(amount);
      const n_samples = 44100;
      const curve = new Float32Array(n_samples);
      const deg = Math.PI / 180;
      for (i; i < n_samples; i++) {
        x = i * 2 / n_samples - 1;
        curve[i] = (3 + k) * x * 20 * deg / (Math.PI + k * Math.abs(x));
      }
      return curve;
    }

    // Event Listeners
    playEle.addEventListener('click', () => audioEle.play());

    pauseEle.addEventListener('click', () => audioEle.pause());

    gainEle.addEventListener('input', () => gain.gain.value = gainEle.value);

    distortionEle.addEventListener('input', () => dist.curve = makeDistortionCurve(distortionEle.value));

    urssModeEle.addEventListener('click', () => {
      const { style } = document.body;

      showImg = true;
      backgroundColor = '#C00';
      barColor = 'rgba(255, 215, 0, $s)';

      style.setProperty('--primary-color', '#C00');
      style.setProperty('--secondary-color', '#FFD700');
      style.setProperty('--text-color', '#FFD700');
    });

    // Start All
    draw();
  }

}();
