class Synth {
    audioContext = new window.AudioContext();
    gainNode = this.audioContext.createGain();
    oscillator = this.audioContext.createOscillator();
    smoothingInterval = 0.02;
    constructor() {
        this.gainNode.connect(this.audioContext.destination);
        this.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        this.oscillator.frequency.value = 262;
        this.oscillator.connect(this.gainNode);
        this.oscillator.start();
    }
    on() {
        const now = this.audioContext.currentTime;
        this.gainNode.gain.setTargetAtTime(1, now, this.smoothingInterval);
    }
    off() {
        const now = this.audioContext.currentTime;
        this.gainNode.gain.setTargetAtTime(0, now, this.smoothingInterval);
    }
    playNote() {
        const beepLengthInSeconds = 0.25;
        const now = this.audioContext.currentTime;
        this.gainNode.gain.setTargetAtTime(1, now, this.smoothingInterval);
        this.gainNode.gain.setTargetAtTime(0, now + beepLengthInSeconds, this.smoothingInterval);
    }
    playNotes() {
        const beepLengthInSeconds = 0.25;
        const now = this.audioContext.currentTime;
        this.gainNode.gain.setTargetAtTime(1, now, this.smoothingInterval);
        this.gainNode.gain.setTargetAtTime(0, now + beepLengthInSeconds * 2, this.smoothingInterval);
        this.oscillator.frequency.setValueAtTime(256, now);
        this.oscillator.frequency.setValueAtTime(512, now + beepLengthInSeconds);
        this.oscillator.frequency.setValueAtTime(256, now + beepLengthInSeconds * 2);
    }
    playSlide() {
        const beepLengthInSeconds = 0.25;
        const now = this.audioContext.currentTime;
        this.gainNode.gain.setTargetAtTime(1, now, this.smoothingInterval);
        this.gainNode.gain.setTargetAtTime(0, now + beepLengthInSeconds, this.smoothingInterval);
        this.oscillator.frequency.setValueAtTime(256, now);
        this.oscillator.frequency.setTargetAtTime(512, now, 0.2);
        this.oscillator.frequency.setValueAtTime(256, now + beepLengthInSeconds + 0.01);
    }
}
let synth;
function getSynth() {
    if (!synth) {
        synth = new Synth();
    }
    return synth;
}
document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startButton');
    const stopButton = document.getElementById('stopButton');
    startButton.addEventListener('click', () => {
        getSynth().on();
    });
    stopButton.addEventListener('click', () => {
        getSynth().off();
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === ' ' || event.key === 'Spacebar') {
            event.preventDefault();
            getSynth().playNote();
        }
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === '2') {
            event.preventDefault();
            getSynth().playNotes();
        }
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === 's') {
            event.preventDefault();
            getSynth().playSlide();
        }
    });
});
