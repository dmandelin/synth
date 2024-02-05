const MIDDLE_C = 261.63;
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
    playSlide() {
        const beepLengthInSeconds = 0.25;
        const now = this.audioContext.currentTime;
        this.gainNode.gain.setTargetAtTime(1, now, this.smoothingInterval);
        this.gainNode.gain.setTargetAtTime(0, now + beepLengthInSeconds, this.smoothingInterval);
        this.oscillator.frequency.setValueAtTime(256, now);
        this.oscillator.frequency.setTargetAtTime(512, now, 0.2);
        this.oscillator.frequency.setValueAtTime(256, now + beepLengthInSeconds + 0.01);
    }
    playNotes(notes) {
        const toneDuration = 0.22;
        const silenceDuration = 0.03;
        const noteDuration = toneDuration + silenceDuration;
        const now = this.audioContext.currentTime;
        let t = now;
        for (const n of notes) {
            const f = MIDDLE_C * Math.pow(2, n / 12);
            this.oscillator.frequency.setValueAtTime(f, t);
            this.gainNode.gain.setTargetAtTime(1, t, this.smoothingInterval);
            this.gainNode.gain.setTargetAtTime(0, t + toneDuration, this.smoothingInterval);
            t += noteDuration;
        }
    }
    playScale() {
        this.playNotes([0, 2, 4, 5, 7, 9, 11, 12]);
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
        if (event.key === '1') {
            event.preventDefault();
            getSynth().playNotes([0]);
        }
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === '2') {
            event.preventDefault();
            getSynth().playNotes([0, 5, 0]);
        }
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === 's') {
            event.preventDefault();
            getSynth().playSlide();
        }
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'c') {
            event.preventDefault();
            getSynth().playScale();
        }
    });
});
