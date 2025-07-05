class Oscillator {
    constructor(audioContext) {
        this.audioContext = audioContext;
        this.oscillator = null;
        this.gainNode = this.audioContext.createGain();
        this.gainNode.connect(this.audioContext.destination);

        this.waveTypeSelect = document.getElementById('waveType');
        this.frequencyInput = document.getElementById('frequency');
        this.durationInput = document.getElementById('duration');

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.waveTypeSelect.addEventListener('change', () => this.updateOscillatorSettings());
        this.frequencyInput.addEventListener('input', () => this.updateOscillatorSettings());
        this.durationInput.addEventListener('input', () => this.updateOscillatorSettings());
    }

    updateOscillatorSettings() {
        if (this.oscillator) {
            this.oscillator.type = this.waveTypeSelect.value;
            this.oscillator.frequency.setValueAtTime(parseFloat(this.frequencyInput.value), this.audioContext.currentTime);
        }
    }

    play() {
        this.stop(); // Stop any currently playing oscillator

        this.oscillator = this.audioContext.createOscillator();
        this.oscillator.type = this.waveTypeSelect.value;
        this.oscillator.frequency.setValueAtTime(parseFloat(this.frequencyInput.value), this.audioContext.currentTime);
        
        this.oscillator.connect(this.gainNode);
        
        const now = this.audioContext.currentTime;
        this.gainNode.gain.setValueAtTime(0, now);
        this.gainNode.gain.linearRampToValueAtTime(1, now + 0.01);
        
        this.oscillator.start(now);
        this.oscillator.stop(now + parseFloat(this.durationInput.value));
        
        this.gainNode.gain.linearRampToValueAtTime(0, now + parseFloat(this.durationInput.value));
    }

    stop() {
        if (this.oscillator) {
            this.oscillator.stop();
            this.oscillator.disconnect();
            this.oscillator = null;
        }
    }
}

// Create a global oscillator instance
window.oscillator = new Oscillator(window.audioContext);
