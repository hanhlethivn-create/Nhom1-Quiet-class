import React from 'react';
import {
  Mic,
  MicOff,
  Settings as SettingsIcon,
  Maximize2,
  Minimize2,
  Users,
  LayoutGrid,
  Volume2,
  Sparkles,
} from 'lucide-react';
import { CompetitionMode } from '../types';

interface NavbarProps {
  isMicActive: boolean;
  onToggleMic: () => void;
  mode: CompetitionMode;
  onModeChange: (mode: CompetitionMode) => void;
  onOpenSettings: () => void;
  onTestVoice: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isMicActive,
  onToggleMic,
  mode,
  onModeChange,
  onOpenSettings,
  onTestVoice,
  isFullscreen,
  onToggleFullscreen,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full px-4 sm:px-6 py-3 bg-white/85 backdrop-blur-md border-b border-sky-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative w-10 h-10 rounded-full overflow-hidden shadow-xs ring-2 ring-sky-300 bg-amber-100 flex items-center justify-center">
            <img
              src="/src/assets/images/quiet_class_mascot_1794225567238.jpg"
              alt="Mascot Quiet Class"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-sky-950 font-['Outfit'] flex items-center gap-1.5 leading-tight">
              Quiet Class
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 tracking-normal hidden sm:inline-block">
                Lớp Học Trật Tự
              </span>
            </h1>
            <p className="text-xs text-slate-500 hidden md:block">
              Theo dõi âm lượng thông minh & thi đua khen thưởng
            </p>
          </div>
        </div>

        {/* Mode Selector (Cả Lớp vs 4 Tổ) */}
        <div className="flex items-center p-1 bg-sky-100/90 rounded-xl border border-sky-200/60 shadow-inner">
          <button
            onClick={() => onModeChange('class')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
              mode === 'class'
                ? 'bg-white text-sky-900 shadow-sm'
                : 'text-slate-600 hover:text-sky-900'
            }`}
            title="Tính điểm thi đua chung cho cả lớp"
          >
            <Users className="w-4 h-4 text-sky-600" />
            <span>Cả Lớp</span>
          </button>
          <button
            onClick={() => onModeChange('groups')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
              mode === 'groups'
                ? 'bg-white text-sky-900 shadow-sm'
                : 'text-slate-600 hover:text-sky-900'
            }`}
            title="Thi đua cộng/trừ điểm giữa 4 tổ nhóm"
          >
            <LayoutGrid className="w-4 h-4 text-amber-600" />
            <span>Thi Đua 4 Tổ</span>
          </button>
        </div>

        {/* Action Controls & Microphone Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Quick Voice Alert Tester */}
          <button
            onClick={onTestVoice}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors cursor-pointer"
            title="Thử giọng nói 'Im lặng đi!'"
          >
            <Volume2 className="w-3.5 h-3.5 text-rose-500" />
            <span>Thử giọng nói</span>
          </button>

          {/* Core Microphone Button: State 1 (Gạch / Tắt) vs State 2 (Đang Bật) */}
          <button
            onClick={onToggleMic}
            className={`relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all duration-200 cursor-pointer ${
              isMicActive
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white ring-4 ring-emerald-200/70 animate-none'
                : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-2 border-rose-300'
            }`}
            title={
              isMicActive
                ? 'Microphone: ĐANG BẬT (Đo độ ồn thời gian thực) - Bấm để tắt'
                : 'Microphone: ĐANG TẮT (Chưa hoạt động) - Bấm để bật'
            }
          >
            {isMicActive ? (
              <>
                <div className="relative">
                  <Mic className="w-4 h-4 text-white" />
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-200"></span>
                  </span>
                </div>
                <span className="hidden sm:inline">Mic Đang Bật</span>
                <span className="sm:hidden">Bật</span>
              </>
            ) : (
              <>
                <MicOff className="w-4 h-4 text-rose-600" />
                <span className="hidden sm:inline">Mic Đang Tắt</span>
                <span className="sm:hidden">Tắt</span>
              </>
            )}
          </button>

          {/* Settings Modal Button */}
          <button
            onClick={onOpenSettings}
            className="p-2 text-slate-600 hover:text-sky-900 hover:bg-sky-100 rounded-xl transition-colors cursor-pointer"
            title="Cài đặt độ nhạy âm thanh & giọng nói"
          >
            <SettingsIcon className="w-5 h-5" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={onToggleFullscreen}
            className="p-2 text-slate-600 hover:text-sky-900 hover:bg-sky-100 rounded-xl transition-colors cursor-pointer hidden md:flex"
            title={isFullscreen ? 'Thoát toàn màn hình' : 'Toàn màn hình trình chiếu'}
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
};
