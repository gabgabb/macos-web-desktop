class AudioManager {
    ctx: AudioContext | null = null;
    masterGain: GainNode | null = null;

    attachToContext(ctx: AudioContext) {
        if (this.ctx === ctx) return;

        this.ctx = ctx;

        this.masterGain = ctx.createGain();
        this.masterGain.gain.value = 1;

        const dest = ctx.destination;

        dest.disconnect();
        this.masterGain.connect(dest);
    }

    setMasterVolume(v: number, muted: boolean) {
        if (!this.masterGain) return;
        this.masterGain.gain.value = muted ? 0 : v;
    }
}

export const audioManager = new AudioManager();
