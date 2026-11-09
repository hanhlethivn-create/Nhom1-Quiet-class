import React from 'react';
import {
  X,
  Volume2,
  Sliders,
  Bell,
  MessageSquare,
  Sparkles,
  RotateCcw,
  ShieldAlert,
} from 'lucide-react';
import { AudioSettings } from '../types';

interface TeacherSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AudioSettings;
  onUpdateSettings: (newSettings: Partial<AudioSettings>) => void;
  onTestVoice: () => void;
  onTestChime: () => void;
  onResetAllData: () => void;
  simulationVolume: number;
  onSimulationVolumeChange: (vol: number) => void;
  isSimulationActive: boolean;
  onToggleSimulation: () => void;
}

export const TeacherSettingsModal: React.FC<TeacherSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onTestVoice,
  onTestChime,
  onResetAllData,
  simulationVolume,
  onSimulationVolumeChange,
  isSimulationActive,
  onToggleSimulation,
}) => {
  if (!isOpen) return null;

  const phraseOptions = [
    'Im lặng đi!',
    'Im lặng đi các bạn ơi!',
    'Trật tự nào, im lặng đi!',
    'Cả lớp giữ yên lặng để học bài nhé!',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-sky-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-sky-50 border-b border-sky-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
                Cài Đặt Lớp Học & Âm Thanh
              </h3>
              <p className="text-xs text-slate-500">
                Tùy chỉnh độ nhạy micro và cảnh báo giọng nói
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* 1. Microphone Sensitivity */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-sky-600" />
                Độ nhạy của Microphone
              </label>
              <span className="text-xs font-mono font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md">
                x{settings.sensitivity.toFixed(1)}
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.5"
              step="0.1"
              value={settings.sensitivity}
              onChange={(e) =>
                onUpdateSettings({ sensitivity: parseFloat(e.target.value) })
              }
              className="w-full accent-sky-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Thấp (Phòng ồn sẵn)</span>
              <span>Tiêu chuẩn (1.0x)</span>
              <span>Cao (Phòng rộng/Mic nhỏ)</span>
            </div>
          </div>

          {/* 2. Thresholds for Yellow & Red */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Ngưỡng Cảnh Báo Âm Lượng
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200">
                <div className="flex items-center justify-between text-xs font-bold text-amber-900 mb-1">
                  <span>Ngưỡng Vàng (Hơi ồn)</span>
                  <span className="font-mono">{settings.yellowThreshold}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="60"
                  value={settings.yellowThreshold}
                  onChange={(e) =>
                    onUpdateSettings({ yellowThreshold: parseInt(e.target.value) })
                  }
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200">
                <div className="flex items-center justify-between text-xs font-bold text-rose-900 mb-1">
                  <span>Ngưỡng Đỏ (Quá ồn)</span>
                  <span className="font-mono">{settings.redThreshold}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="90"
                  value={settings.redThreshold}
                  onChange={(e) =>
                    onUpdateSettings({ redThreshold: parseInt(e.target.value) })
                  }
                  className="w-full accent-rose-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* 3. Voice & Chime Alerts */}
          <div className="space-y-4 pt-3 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Cảnh Báo Khi Chuyển Sang Mức Đỏ (Quá Ồn)
            </h4>

            {/* Voice toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-rose-500" />
                <div>
                  <div className="text-xs font-bold text-slate-800">
                    Phát giọng nói "Im lặng đi!"
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Ứng dụng tự động đọc câu nhắc nhở bằng tiếng Việt
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.voiceAlertEnabled}
                onChange={(e) =>
                  onUpdateSettings({ voiceAlertEnabled: e.target.checked })
                }
                className="w-4 h-4 accent-rose-600 rounded cursor-pointer"
              />
            </div>

            {/* Voice phrase selection */}
            {settings.voiceAlertEnabled && (
              <div className="space-y-2 pl-2">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-sky-600" />
                  Chọn câu khẩu hiệu khi lớp quá ồn:
                </label>
                <div className="space-y-1.5">
                  {phraseOptions.map((phrase) => (
                    <label
                      key={phrase}
                      className={`flex items-center gap-2 p-2 rounded-lg text-xs font-medium border cursor-pointer transition-colors ${
                        settings.spokenPhrase === phrase
                          ? 'bg-sky-50 border-sky-400 text-sky-900 font-bold'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="spokenPhrase"
                        checked={settings.spokenPhrase === phrase}
                        onChange={() => onUpdateSettings({ spokenPhrase: phrase })}
                        className="accent-sky-600"
                      />
                      <span>"{phrase}"</span>
                    </label>
                  ))}
                </div>

                {/* Custom phrase */}
                <div className="pt-1">
                  <input
                    type="text"
                    placeholder="Hoặc nhập câu khẩu hiệu riêng của thầy/cô..."
                    value={
                      phraseOptions.includes(settings.spokenPhrase)
                        ? ''
                        : settings.spokenPhrase
                    }
                    onChange={(e) => {
                      if (e.target.value.trim()) {
                        onUpdateSettings({ spokenPhrase: e.target.value });
                      }
                    }}
                    className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-hidden focus:border-sky-500"
                  />
                </div>

                {/* Test button */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={onTestVoice}
                    className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Bấm nghe thử giọng nói</span>
                  </button>
                  <button
                    onClick={onTestChime}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Bell className="w-3.5 h-3.5 text-amber-500" />
                    <span>Thử chuông báo</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 4. Classroom Simulation Mode */}
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  Chế Độ Thử Nghiệm / Giả Lập Âm Thanh
                </h4>
                <p className="text-[11px] text-amber-800">
                  Dành cho giáo viên muốn kiểm tra trước ứng dụng mà không cần nói lớn
                </p>
              </div>
              <button
                onClick={onToggleSimulation}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isSimulationActive
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white border border-amber-300 text-amber-800'
                }`}
              >
                {isSimulationActive ? 'Đang chạy giả lập' : 'Bật giả lập'}
              </button>
            </div>

            {isSimulationActive && (
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-xs font-mono font-bold text-amber-900">
                  <span>Kéo thanh âm lượng giả lập:</span>
                  <span>{simulationVolume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={simulationVolume}
                  onChange={(e) =>
                    onSimulationVolumeChange(parseInt(e.target.value))
                  }
                  className="w-full accent-amber-600 cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* 5. Danger Zone: Reset All */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-800">
                Đặt lại tất cả dữ liệu
              </div>
              <div className="text-[11px] text-slate-500">
                Xóa điểm số và khôi phục cài đặt mặc định
              </div>
            </div>
            <button
              onClick={() => {
                if (
                  window.confirm(
                    'Thầy/Cô có chắc chắn muốn đặt lại toàn bộ điểm và cài đặt không?'
                  )
                ) {
                  onResetAllData();
                }
              }}
              className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Đặt lại</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Đóng Cài Đặt
          </button>
        </div>
      </div>
    </div>
  );
};
