
class Synth {
    private readonly audioContext = new window.AudioContext();
    private readonly gainNode = this.audioContext.createGain();
    private readonly oscillator = this.audioContext.createOscillator();

    private readonly smoothingInterval = 0.02;
 
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
}

let synth: Synth | undefined;

function getSynth(): Synth {
    if (!synth) {
        synth = new Synth();
    }
    return synth;
}

document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startButton') as HTMLButtonElement;
    const stopButton = document.getElementById('stopButton') as HTMLButtonElement;

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
    })
});
