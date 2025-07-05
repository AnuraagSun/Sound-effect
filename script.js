const intervalValue = document.getElementById('intervalValue');
const intervalUnit = document.getElementById('intervalUnit');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const countdown = document.getElementById('countdown');
const accuracyWarning = document.getElementById('accuracyWarning');

let intervalId;
let nextTickTime;
let audioContext;
let tickBuffer;

// Load the tick sound
fetch('assets/tick.mp3')
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioContext.decodeAudioData(arrayBuffer, (buffer) => {
            tickBuffer = buffer;
        });
    });

function playTick() {
    const source = audioContext.createBufferSource();
    source.buffer = tickBuffer;
    source.connect(audioContext.destination);
    source.start();
}

function getIntervalInSeconds() {
    return intervalValue.value * intervalUnit.value;
}

function updateCountdown() {
    const now = performance.now() / 1000;
    const remaining = Math.max(0, nextTickTime - now);
    countdown.textContent = remaining.toFixed(3);
}

function checkAccuracy() {
    const interval = getIntervalInSeconds();
    if (interval < 0.001) {
        accuracyWarning.textContent = "Warning: Intervals below 1ms may not be accurate.";
    } else {
        accuracyWarning.textContent = "";
    }
}

function tick() {
    playTick();
    nextTickTime = performance.now() / 1000 + getIntervalInSeconds();
}

function startTimer() {
    const interval = getIntervalInSeconds();
    checkAccuracy();

    if (interval >= 0.001) {
        intervalId = setInterval(tick, interval * 1000);
    } else {
        function loop() {
            const now = performance.now() / 1000;
            if (now >= nextTickTime) {
                tick();
            }
            requestAnimationFrame(loop);
        }
        nextTickTime = performance.now() / 1000 + interval;
        loop();
    }

    tick();
    requestAnimationFrame(function updateLoop() {
        updateCountdown();
        requestAnimationFrame(updateLoop);
    });
}

function stopTimer() {
    clearInterval(intervalId);
    intervalId = null;
    countdown.textContent = '';
}

startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click', stopTimer);
intervalValue.addEventListener('input', checkAccuracy);
intervalUnit.addEventListener('change', checkAccuracy);
