import React from 'react';
import {
  Volume2,
  VolumeX,
  Volume1,
  Sparkles,
  AlertTriangle,
  Smile,
  Mic,
  MicOff,
  Flame,
  Award,
} from 'lucide-react';
import { NoiseLevel } from '../types';

interface NoiseLevelHeroProps {
  volume: number; // 0 - 100
  noiseLevel: NoiseLevel;
  isMicActive: boolean;
  onToggleMic: () => void;
  yellowThreshold: number;
  redThreshold: number;
  onQuickAddPoint: () => void;
  onQuickDeductPoint: () => void;
}

export const NoiseLevelHero: React.FC<NoiseLevelHeroProps> = ({
  volume,
  noiseLevel,
  isMicActive,
  onToggleMic,
  yellowThreshold,
  redThreshold,
  onQuickAddPoint,
  onQuickDeductPoint,
}) => {
  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-white/75 backdrop-blur-md border border-white/60 shadow-lg p-5 sm:p-7 transition-all duration-300">
      {/* Mic Inactive Reminder Banner */}
      {!isMicActive && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-500/15 border border-amber-300/80 backdrop-blur-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <MicOff className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-950">
                Microphone đang gạch (Đang tắt - Chưa hoạt động tính năng)
              </h4>
              <p className="text-xs text-amber-800">
                Bấm vào nút bên cạnh để cấp quyền và bắt đầu theo dõi tiếng ồn thời gian thực.
              </p>
            </div>
          </div>
          <button
            onClick={onToggleMic}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <Mic className="w-4 h-4 animate-bounce" />
            <span>Bật Microphone Ngay</span>
          </button>
        </div>
      )}

      {/* Main 3-Level Traffic Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* LEVEL 1: XANH LÁ CÂY */}
        <div
          className={`relative rounded-2xl p-4 sm:p-5 transition-all duration-300 border-2 ${
            noiseLevel === 'green' && isMicActive
              ? 'bg-emerald-500/15 border-emerald-500 shadow-lg shadow-emerald-500/20 scale-[1.02] ring-4 ring-emerald-400/30'
              : 'bg-white/60 border-slate-200/80 opacity-70 hover:opacity-90'
          }`}
        >
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white shadow-xs ${
                  noiseLevel === 'green' && isMicActive ? 'bg-emerald-600 animate-pulse' : 'bg-emerald-400'
                }`}
              >
                <Smile className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                  Cấp độ 1
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 font-['Outfit']">
                  Màu Xanh Lá Cây
                </h3>
              </div>
            </div>

            {noiseLevel === 'green' && isMicActive && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 animate-bounce">
                <Sparkles className="w-3 h-3 text-emerald-600" /> Đang Yên Lặng
              </span>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-xs sm:text-sm font-semibold text-emerald-900">
              Lớp đang yên lặng, chăm ngoan.
            </p>
            <div className="p-2.5 rounded-xl bg-emerald-100/80 border border-emerald-300 text-xs text-emerald-950 font-medium flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 font-bold">
                <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                Chỉ định: NÊN CỘNG ĐIỂM
              </span>
              <button
                onClick={onQuickAddPoint}
                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
                title="Cộng điểm thưởng trật tự cho lớp"
              >
                + Thưởng
              </button>
            </div>
          </div>
        </div>

        {/* LEVEL 2: VÀNG */}
        <div
          className={`relative rounded-2xl p-4 sm:p-5 transition-all duration-300 border-2 ${
            noiseLevel === 'yellow' && isMicActive
              ? 'bg-amber-500/15 border-amber-500 shadow-lg shadow-amber-500/20 scale-[1.02] ring-4 ring-amber-400/30'
              : 'bg-white/60 border-slate-200/80 opacity-70 hover:opacity-90'
          }`}
        >
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white shadow-xs ${
                  noiseLevel === 'yellow' && isMicActive ? 'bg-amber-500 animate-pulse' : 'bg-amber-400'
                }`}
              >
                <Volume1 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
                  Cấp độ 2
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 font-['Outfit']">
                  Màu Vàng Chú Ý
                </h3>
              </div>
            </div>

            {noiseLevel === 'yellow' && isMicActive && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                <AlertTriangle className="w-3 h-3 text-amber-600" /> Hơi Ồn Ào
              </span>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-xs sm:text-sm font-semibold text-amber-950">
              Lớp có chút ồn ào (tiếng xì xào, thảo luận).
            </p>
            <div className="p-2.5 rounded-xl bg-amber-100/80 border border-amber-300 text-xs text-amber-950 font-medium">
              <span className="font-bold flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-amber-700 shrink-0" />
                Chỉ định: KHÔNG NÊN CỘNG HOẶC TRỪ ĐIỂM
              </span>
              <p className="text-[11px] text-amber-800 mt-1">
                Nhắc nhở nhẹ để các bạn hạ giọng trật tự lại.
              </p>
            </div>
          </div>
        </div>

        {/* LEVEL 3: ĐỎ */}
        <div
          className={`relative rounded-2xl p-4 sm:p-5 transition-all duration-300 border-2 ${
            noiseLevel === 'red' && isMicActive
              ? 'bg-rose-500/20 border-rose-500 shadow-xl shadow-rose-500/30 scale-[1.02] ring-4 ring-rose-400/40 animate-pulse'
              : 'bg-white/60 border-slate-200/80 opacity-70 hover:opacity-90'
          }`}
        >
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white shadow-xs ${
                  noiseLevel === 'red' && isMicActive ? 'bg-rose-600 animate-bounce' : 'bg-rose-400'
                }`}
              >
                <VolumeX className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700">
                  Cấp độ 3
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 font-['Outfit']">
                  Màu Đỏ Cảnh Báo
                </h3>
              </div>
            </div>

            {noiseLevel === 'red' && isMicActive && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 animate-ping">
                <Flame className="w-3 h-3 text-rose-600" /> Quá Ồn!
              </span>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-xs sm:text-sm font-semibold text-rose-950">
              Lớp quá ồn ào vượt ngưỡng cho phép!
            </p>
            <div className="p-2.5 rounded-xl bg-rose-100/90 border border-rose-300 text-xs text-rose-950 font-medium flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 font-bold">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                Chỉ định: SẼ BỊ TRỪ ĐIỂM
              </span>
              <button
                onClick={onQuickDeductPoint}
                className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
                title="Trừ điểm phạt lớp quá ồn"
              >
                - Trừ Điểm
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Decibel / Noise Level Progress Meter */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white/80 border border-sky-200 shadow-inner">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                !isMicActive
                  ? 'bg-slate-300'
                  : noiseLevel === 'green'
                  ? 'bg-emerald-500 animate-ping'
                  : noiseLevel === 'yellow'
                  ? 'bg-amber-500 animate-ping'
                  : 'bg-rose-500 animate-ping'
              }`}
            />
            <span className="text-xs sm:text-sm font-bold text-slate-700">
              Mức Độ Âm Thanh Thời Gian Thực
            </span>
          </div>
          <div className="flex items-center gap-2 font-mono tabular-nums text-sm sm:text-base font-bold text-sky-950">
            <span>{isMicActive ? `${volume}%` : '0%'}</span>
            <span className="text-xs font-normal text-slate-500 hidden sm:inline">
              ({isMicActive ? (noiseLevel === 'green' ? 'Yên lặng' : noiseLevel === 'yellow' ? 'Hơi ồn' : 'Quá ồn') : 'Đang tắt mic'})
            </span>
          </div>
        </div>

        {/* Visual Bar with colored zones */}
        <div className="relative w-full h-6 rounded-xl bg-slate-100 overflow-hidden p-1 flex items-center border border-slate-200">
          {/* Threshold markers */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-amber-400 z-10 opacity-70"
            style={{ left: `${yellowThreshold}%` }}
            title={`Ngưỡng vàng: ${yellowThreshold}%`}
          />
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-rose-500 z-10 opacity-70"
            style={{ left: `${redThreshold}%` }}
            title={`Ngưỡng đỏ: ${redThreshold}%`}
          />

          {/* Dynamic Fill Indicator */}
          <div
            className={`h-full rounded-lg transition-all duration-150 ease-out ${
              !isMicActive
                ? 'w-0'
                : noiseLevel === 'green'
                ? 'bg-gradient-to-r from-emerald-400 to-emerald-500 shadow-xs'
                : noiseLevel === 'yellow'
                ? 'bg-gradient-to-r from-emerald-400 via-amber-400 to-amber-500 shadow-xs'
                : 'bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-600 shadow-md'
            }`}
            style={{ width: `${isMicActive ? Math.max(3, volume) : 0}%` }}
          />
        </div>

        {/* Legend for thresholds */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            <span>0 - {yellowThreshold}%: Xanh (Cộng điểm)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
            <span>{yellowThreshold} - {redThreshold}%: Vàng (Giữ nguyên)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
            <span>&gt; {redThreshold}%: Đỏ (Trừ điểm + Nói "Im lặng đi")</span>
          </div>
        </div>
      </div>
    </div>
  );
};
