/**
 * Audio Engine for Quiet Class - analyzes microphone input in real time.
 */

export class AudioEngine {
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private mediaStream: MediaStream | null = null;
  private animationFrameId: number | null = null;
  private isRunning = false;
  private smoothedVolume = 0;

  // Smoothing factor: higher = smoother, lower = more reactive
  private readonly smoothingFactor = 0.22;

  public async start(
    sensitivity: number,
    onVolumeUpdate: (volume: number) => void,
    onError: (err: string) => void
  ): Promise<boolean> {
    if (this.isRunning) return true;

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Trình duyệt không hỗ trợ truy cập microphone.');
      }

      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: false, // We want raw classroom volume
          autoGainControl: false,
        },
      });

      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();

      if (this.audioCtx.state === 'suspended') {
        await this.audioCtx.resume();
      }

      const source = this.audioCtx.createMediaStreamSource(this.mediaStream);
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 512;
      this.analyser.minDecibels = -90;
      this.analyser.maxDecibels = -10;
      this.analyser.smoothingTimeConstant = 0.3;

      source.connect(this.analyser);
      this.isRunning = true;

      const dataArray = new Uint8Array(this.analyser.frequencyBinCount);

      const updateVolume = () => {
        if (!this.isRunning || !this.analyser) return;

        this.analyser.getByteFrequencyData(dataArray);

        // Calculate average amplitude across speech frequency spectrum
        let sum = 0;
        const length = dataArray.length;
        for (let i = 0; i < length; i++) {
          sum += dataArray[i];
        }

        const rawAverage = sum / length;
        // Normalize 0 - 100 based on standard speech input
        let normalizedVolume = (rawAverage / 128) * 100 * sensitivity;
        normalizedVolume = Math.min(100, Math.max(0, normalizedVolume));

        // Exponential moving average for pleasant visual smoothness
        this.smoothedVolume =
          this.smoothedVolume * (1 - this.smoothingFactor) +
          normalizedVolume * this.smoothingFactor;

        onVolumeUpdate(Math.round(this.smoothedVolume));
        this.animationFrameId = requestAnimationFrame(updateVolume);
      };

      updateVolume();
      return true;
    } catch (err: unknown) {
      this.stop();
      let errorMsg = 'Không thể truy cập microphone. Vui lòng cấp quyền trong cài đặt trình duyệt.';
      if (err instanceof DOMException) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          errorMsg = 'Quyền truy cập micro đã bị từ chối. Thầy/Cô vui lòng bấm vào biểu tượng ổ khóa cạnh thanh địa chỉ để cho phép.';
        } else if (err.name === 'NotFoundError') {
          errorMsg = 'Không tìm thấy thiết bị microphone nào kết nối trên máy tính.';
        }
      }
      onError(errorMsg);
      return false;
    }
  }

  public stop(): void {
    this.isRunning = false;

    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }

    if (this.audioCtx && this.audioCtx.state !== 'closed') {
      this.audioCtx.close().catch(() => {});
      this.audioCtx = null;
    }

    this.analyser = null;
    this.smoothedVolume = 0;
  }

  public getRunningState(): boolean {
    return this.isRunning;
  }
}

export const audioEngine = new AudioEngine();
