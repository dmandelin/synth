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

    playNotesByNumber(notes: readonly Note[]) {
        const toneDuration = 0.88;
        const silenceDuration = 0.12;
        const noteDuration = toneDuration + silenceDuration;

        const now = this.audioContext.currentTime;
        let t = now;
        for (const n of notes) {
            const f = MIDDLE_C * Math.pow(2, n.pitch/12);
            this.oscillator.frequency.setValueAtTime(f, t);
            this.gainNode.gain.setTargetAtTime(1, t, this.smoothingInterval);
            this.gainNode.gain.setTargetAtTime(0, t + toneDuration * n.duration, this.smoothingInterval);
            t += noteDuration * n.duration;
        }        
    }

    playNotes(notes: readonly string[]|string) {
        if (typeof notes === 'string') {
            notes = notes.split(' ');
        }
        this.playNotesByNumber(notes.map(ns => Note.parse(ns)));
    }

    playScale() {
        this.playNotes("c d e f g a b c4 c4 b a g f e d c");
    }

    playSong() {
        this.playNotes("e d c d e e eh d d dh e g gh e d c d e e e e d d e d ch")
    }
}

class Note {
    constructor(readonly pitch: number, readonly duration: number = 0.25) {}

    static parse(s: string) {
        const [pitch, rest] = Note.parsePitch(s);
        const duration = rest.length ? Note.parseDuration(rest) : 0.25;
        return new Note(pitch, duration);
    }

    static parsePitch(s: string): [number, string] {
        const pitch = this.parsePitchLetter(s);
        if (s.length == 1) {
            return [pitch, s.substring(1)];
        }
        const d = Note.parseDigit(s[1]);
        if (d === undefined) {
            return [pitch, s.substring(1)];
        }
        return [pitch + (d - 3) * 12, s.substring(2)]
    }

    static parsePitchLetter(s: string) {
        const c = s[0].toLowerCase();
        switch (c) {
            case 'c': return 0;
            case 'd': return 2;
            case 'e': return 4;
            case 'f': return 5;
            case 'g': return 7;
            case 'a': return 9;
            case 'b': return 11;
            default: return -0.5;
        }
    }

    static parseDigit(s: string) {
        const d = s.charCodeAt(0) - '0'.charCodeAt(0);
        return d >= 0 && d <= 9 ? d : undefined;
    }

    static parseDuration(s: string) {
        switch (s) {
            case 'w': return 1.0;
            case 'h': return 0.5;
            case 'e': return 0.125;
            default: return 0.25;
        }
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
            getSynth().playNotes("ch gh ch");
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
