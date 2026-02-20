class AudioManager {
    ctx: AudioContext | null = null;
    masterGain: GainNode | null = null;
    currentSource: AudioBufferSourceNode | null = null;

    async attachToContext(ctx: AudioContext) {
        if (this.ctx === ctx) return;

        this.ctx = ctx;

        this.masterGain = ctx.createGain();
        this.masterGain.gain.value = 1;

        this.masterGain.connect(ctx.destination);
    }

    async loadAndPlay(url: string, loop = true) {
        if (!this.ctx || !this.masterGain) return;

        this.stop();

        const res = await fetch(url);
        const arrayBuffer = await res.arrayBuffer();
        const buffer = await this.ctx.decodeAudioData(arrayBuffer);

        const source = this.ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = loop;

        source.connect(this.masterGain);
        source.start(0);

        this.currentSource = source;
    }

    fadeTo(target: number, duration = 1000) {
        if (!this.masterGain || !this.ctx) return;

        const now = this.ctx.currentTime;
        this.masterGain.gain.cancelScheduledValues(now);
        this.masterGain.gain.linearRampToValueAtTime(
            target,
            now + duration / 1000,
        );
    }

    stop() {
        if (this.currentSource) {
            this.currentSource.stop();
            this.currentSource.disconnect();
            this.currentSource = null;
        }
    }

    setMasterVolume(v: number, muted: boolean) {
        if (!this.masterGain) return;
        this.masterGain.gain.value = muted ? 0 : v;
    }
}

export const audioManager = new AudioManager();
