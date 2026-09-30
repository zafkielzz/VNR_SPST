/**
 * GENERATIVE AMBIENT AUDIO SYNTHESIZER (WEB AUDIO API)
 * Tạo âm hưởng nhạc cụ dân tộc ngũ cung truyền thống (cồng chiêng, chuông đồng, sáo trầm)
 * Hoạt động 100% offline, không phụ thuộc file mp3 ngoài, không lỗi CORS.
 */

class AmbientSoundSynth {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.masterGain = null;
    this.timerId = null;
    this.volume = 0.35;
    // Ngũ cung Việt Nam (Pentatonic scale: C, D, E, G, A) ở tần số thấp ấm áp
    this.frequencies = [130.81, 146.83, 164.81, 196.00, 220.00, 261.63, 293.66, 329.63, 392.00];
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  playDrone() {
    if (!this.ctx || !this.isPlaying) return;

    // Âm nền ngân trầm (Drone pad)
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    // Tần số gốc C2 (65.41 Hz) hoặc G2 (98 Hz)
    const baseFreq = Math.random() > 0.5 ? 65.41 : 98.00;
    osc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, this.ctx.currentTime);

    const now = this.ctx.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 3);
    gain.gain.linearRampToValueAtTime(0, now + 12);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 12.5);
  }

  playChime() {
    if (!this.ctx || !this.isPlaying) return;

    // Tiếng chuông/cồng ngân nhẹ (Bell/Gong chime)
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    const note = this.frequencies[Math.floor(Math.random() * this.frequencies.length)];
    osc.type = 'sine';
    osc.frequency.setValueAtTime(note, this.ctx.currentTime);

    const now = this.ctx.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.06, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 5.5);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 6);
  }

  start() {
    this.init();
    if (this.isPlaying) return;
    this.isPlaying = true;

    // Bắt đầu vòng lặp âm hưởng
    this.playDrone();
    this.playChime();

    this.timerId = setInterval(() => {
      if (!this.isPlaying) return;
      if (Math.random() > 0.3) {
        this.playChime();
      }
      if (Math.random() > 0.6) {
        this.playDrone();
      }
    }, 3200);
  }

  stop() {
    this.isPlaying = false;
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  playStampThud() {
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(32, now + 0.16);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.masterGain || this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.24);
    } catch (e) {}
  }

  toggle() {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }
}

export const soundSynth = new AmbientSoundSynth();
