const MIDDLE_C = 261.63;

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

    playSlide() {
        const beepLengthInSeconds = 0.25;

        const now = this.audioContext.currentTime;
        this.gainNode.gain.setTargetAtTime(1, now, this.smoothingInterval);
        this.gainNode.gain.setTargetAtTime(0, now + beepLengthInSeconds, this.smoothingInterval);
        this.oscillator.frequency.setValueAtTime(256, now);
        this.oscillator.frequency.setTargetAtTime(512, now, 0.2);
        this.oscillator.frequency.setValueAtTime(256, now + beepLengthInSeconds + 0.01);
    }

    playNotesByNumber(notes: readonly number[]) {
        const toneDuration = 0.22;
        const silenceDuration = 0.03;
        const noteDuration = toneDuration + silenceDuration;

        const now = this.audioContext.currentTime;
        let t = now;
        for (const n of notes) {
            const f = MIDDLE_C * Math.pow(2, n/12);
            this.oscillator.frequency.setValueAtTime(f, t);
            this.gainNode.gain.setTargetAtTime(1, t, this.smoothingInterval);
            this.gainNode.gain.setTargetAtTime(0, t + toneDuration, this.smoothingInterval);
            t += noteDuration;
        }        
    }

    playNotes(notes: readonly string[]|string) {
        if (typeof notes === 'string') {
            notes = notes.split(' ');
        }
        const numbers = notes.map(ch => ch.toLowerCase().charCodeAt(0) - 'c'.charCodeAt(0));
        this.playNotesByNumber(numbers);
    }

    playScale() {
        this.playNotesByNumber([0, 2, 4, 5, 7, 9, 11, 12]);
    }

    playSong() {
        this.playNotes("e d c d e e e d d d e g g e d c d d e e e e d e d c")
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

    document.addEventListener('keydown', (event) => {
        if (event.key === '1') {
            event.preventDefault();
            getSynth().playNotes("c");
        }
    })

    document.addEventListener('keydown', (event) => {
        if (event.key === '2') {
            event.preventDefault();
            getSynth().playNotesByNumber([0, 5, 0]);
        }
    })

    document.addEventListener('keydown', (event) => {
        if (event.key === 's') {
            event.preventDefault();
            getSynth().playSlide();
        }
    })

    document.addEventListener('keydown', (event) => {
        if (event.key === 'c') {
            event.preventDefault();
            getSynth().playScale();
        }
    })

    document.addEventListener('keydown', (event) => {
        if (event.key === 'z') {
            event.preventDefault();
            getSynth().playSong();
        }
    })   
});
