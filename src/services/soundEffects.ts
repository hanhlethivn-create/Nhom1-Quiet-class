/**
 * Sound synthesis and speech alert utilities for Quiet Class
 */

class SoundEffectsService {
  private audioCtx: AudioContext | null = null;
  private lastAlertTime = 0;

  private getAudioContext(): AudioContext {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  /**
   * Gentle, soft alert chime to draw attention without frightening children
   */
  public playSoftAlertChime(): void {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // Tone 1: E5 (659.25Hz) -> Tone 2: C5 (523.25Hz)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';

      osc1.frequency.setValueAtTime(659.25, now);
      osc1.frequency.exponentialRampToValueAtTime(523.25, now + 0.3);

      osc2.frequency.setValueAtTime(329.63, now);
      osc2.frequency.exponentialRampToValueAtTime(261.63, now + 0.3);

      gainNode.gain.setValueAtTime(0.001, now);
      gainNode.gain.linearRampToValueAtTime(0.22, now + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.65);
      osc2.stop(now + 0.65);
    } catch (err) {
      console.warn('Could not play alert chime:', err);
    }
  }

  /**
   * Joyful cheer chime when adding points or earning stars
   */
  public playRewardChime(): void {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.001, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.35);
      });
    } catch (err) {
      console.warn('Could not play reward chime:', err);
    }
  }

  /**
   * Negative buzz when subtracting points
   */
  public playDeductChime(): void {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(160, now + 0.25);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch (err) {
      console.warn('Could not play deduct sound:', err);
    }
  }

  /**
   * Speak phrase in Vietnamese using browser SpeechSynthesis
   */
  public speakVietnameseAlert(phrase: string, cooldownSec = 5, force = false): boolean {
    const now = Date.now();
    if (!force && now - this.lastAlertTime < cooldownSec * 1000) {
      return false; // On cooldown
    }

    if (!('speechSynthesis' in window)) {
      console.warn('SpeechSynthesis is not supported in this browser.');
      return false;
    }

    try {
      // Cancel pending utterances
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(phrase);
      utterance.lang = 'vi-VN';
      utterance.rate = 1.0;
      utterance.pitch = 1.05;
      utterance.volume = 1.0;

      // Try to find a Vietnamese voice if available
      const voices = window.speechSynthesis.getVoices();
      const viVoice = voices.find((v) => v.lang.startsWith('vi') || v.lang.includes('VIE'));
      if (viVoice) {
        utterance.voice = viVoice;
      }

      window.speechSynthesis.speak(utterance);
      this.lastAlertTime = now;
      return true;
    } catch (err) {
      console.warn('Speech synthesis failed:', err);
      return false;
    }
  }
}

export const soundEffects = new SoundEffectsService();
