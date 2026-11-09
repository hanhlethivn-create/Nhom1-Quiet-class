/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Sparkles,
  AlertOctagon,
  Volume2,
  Mic,
  MicOff,
  Star,
  Users,
  LayoutGrid,
  Heart,
  VolumeX,
} from 'lucide-react';
import {
  NoiseLevel,
  CompetitionMode,
  GroupTeam,
  AudioSettings,
  ClassScoreState,
} from './types';
import { audioEngine } from './services/audioEngine';
import { soundEffects } from './services/soundEffects';
import { Navbar } from './components/Navbar';
import { NoiseLevelHero } from './components/NoiseLevelHero';
import { ScoreBoard } from './components/ScoreBoard';
import { TeacherSettingsModal } from './components/TeacherSettingsModal';

const DEFAULT_GROUPS: GroupTeam[] = [
  { id: '1', name: 'Tổ 1 - Đại Bàng', score: 15, color: 'blue', badge: '🦅', stars: 2 },
  { id: '2', name: 'Tổ 2 - Sư Tử Vàng', score: 18, color: 'amber', badge: '🦁', stars: 3 },
  { id: '3', name: 'Tổ 3 - Cá Heo Thông Thái', score: 14, color: 'teal', badge: '🐬', stars: 2 },
  { id: '4', name: 'Tổ 4 - Chim Khổng Tước', score: 16, color: 'purple', badge: '🦚', stars: 2 },
];

const DEFAULT_SETTINGS: AudioSettings = {
  sensitivity: 1.0,
  yellowThreshold: 35,
  redThreshold: 65,
  voiceAlertEnabled: true,
  chimeEnabled: true,
  spokenPhrase: 'Im lặng đi!',
  alertCooldownSeconds: 5,
};

const DEFAULT_CLASS_SCORE: ClassScoreState = {
  points: 25,
  stars: 3,
  quietStreakSeconds: 0,
  violationsCount: 0,
};

export default function App() {
  // State: Microphone & Audio
  const [isMicActive, setIsMicActive] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0);
  const [noiseLevel, setNoiseLevel] = useState<NoiseLevel>('green');
  const [audioError, setAudioError] = useState<string | null>(null);

  // State: Mode & Scores
  const [mode, setMode] = useState<CompetitionMode>(() => {
    return (localStorage.getItem('qc_mode') as CompetitionMode) || 'class';
  });

  const [classScore, setClassScore] = useState<ClassScoreState>(() => {
    try {
      const saved = localStorage.getItem('qc_class_score');
      return saved ? JSON.parse(saved) : DEFAULT_CLASS_SCORE;
    } catch {
      return DEFAULT_CLASS_SCORE;
    }
  });

  const [groups, setGroups] = useState<GroupTeam[]>(() => {
    try {
      const saved = localStorage.getItem('qc_groups');
      return saved ? JSON.parse(saved) : DEFAULT_GROUPS;
    } catch {
      return DEFAULT_GROUPS;
    }
  });

  const [settings, setSettings] = useState<AudioSettings>(() => {
    try {
      const saved = localStorage.getItem('qc_settings');
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // State: UI & Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSimulationActive, setIsSimulationActive] = useState(false);
  const [simulationVolume, setSimulationVolume] = useState(25);
  const [isSpeakingAlert, setIsSpeakingAlert] = useState(false);

  // Red duration tracker ref to prevent instantaneous false alerts
  const redStartTimeRef = useRef<number | null>(null);
  const lastAlertTimeRef = useRef<number>(0);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('qc_mode', mode);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem('qc_class_score', JSON.stringify(classScore));
  }, [classScore]);

  useEffect(() => {
    localStorage.setItem('qc_groups', JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    localStorage.setItem('qc_settings', JSON.stringify(settings));
  }, [settings]);

  // Determine current noise level based on volume and thresholds
  const calculateNoiseLevel = useCallback(
    (currentVolume: number): NoiseLevel => {
      if (currentVolume < settings.yellowThreshold) {
        return 'green';
      }
      if (currentVolume < settings.redThreshold) {
        return 'yellow';
      }
      return 'red';
    },
    [settings.yellowThreshold, settings.redThreshold]
  );

  // Trigger alert when in Red zone for more than 1.2s
  useEffect(() => {
    if (!isMicActive && !isSimulationActive) {
      setNoiseLevel('green');
      redStartTimeRef.current = null;
      return;
    }

    const currentLevel = calculateNoiseLevel(volume);
    setNoiseLevel(currentLevel);

    if (currentLevel === 'red') {
      if (redStartTimeRef.current === null) {
        redStartTimeRef.current = Date.now();
      } else {
        const timeInRed = Date.now() - redStartTimeRef.current;
        const now = Date.now();
        const cooldownMs = settings.alertCooldownSeconds * 1000;

        // If in RED for >= 1.2s and cooldown elapsed
        if (timeInRed >= 1200 && now - lastAlertTimeRef.current > cooldownMs) {
          lastAlertTimeRef.current = now;

          if (settings.chimeEnabled) {
            soundEffects.playSoftAlertChime();
          }

          if (settings.voiceAlertEnabled) {
            setIsSpeakingAlert(true);
            setTimeout(() => {
              soundEffects.speakVietnameseAlert(
                settings.spokenPhrase,
                settings.alertCooldownSeconds,
                true
              );
            }, 300);
            setTimeout(() => setIsSpeakingAlert(false), 2500);
          }

          // Increment violation count in state
          setClassScore((prev) => ({
            ...prev,
            violationsCount: prev.violationsCount + 1,
          }));
        }
      }
    } else {
      redStartTimeRef.current = null;
    }
  }, [
    volume,
    isMicActive,
    isSimulationActive,
    calculateNoiseLevel,
    settings.alertCooldownSeconds,
    settings.chimeEnabled,
    settings.voiceAlertEnabled,
    settings.spokenPhrase,
  ]);

  // Handle Microphone Toggle
  const handleToggleMic = async () => {
    setAudioError(null);

    // If currently running, stop it
    if (isMicActive) {
      audioEngine.stop();
      setIsMicActive(false);
      setVolume(0);
      return;
    }

    // Turn off simulation if mic is activated
    if (isSimulationActive) {
      setIsSimulationActive(false);
    }

    const started = await audioEngine.start(
      settings.sensitivity,
      (vol) => {
        setVolume(vol);
      },
      (err) => {
        setAudioError(err);
        setIsMicActive(false);
      }
    );

    if (started) {
      setIsMicActive(true);
      // Play a gentle confirmation chime
      soundEffects.playRewardChime();
    }
  };

  // Clean up audio engine on unmount
  useEffect(() => {
    return () => {
      audioEngine.stop();
    };
  }, []);

  // Simulation mode loop
  useEffect(() => {
    if (!isSimulationActive) return;

    if (isMicActive) {
      audioEngine.stop();
      setIsMicActive(false);
    }

    setVolume(simulationVolume);
  }, [isSimulationActive, simulationVolume, isMicActive]);

  // Fullscreen Handler
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  // Class Points Handlers
  const handleUpdateClassPoints = (delta: number) => {
    if (delta > 0) {
      soundEffects.playRewardChime();
    } else {
      soundEffects.playDeductChime();
    }

    setClassScore((prev) => {
      const nextPoints = Math.max(0, prev.points + delta);
      // Star calculation: award 1 star every 20 points
      const nextStars = Math.floor(nextPoints / 20);
      return {
        ...prev,
        points: nextPoints,
        stars: Math.max(prev.stars, nextStars),
      };
    });
  };

  const handleResetClassPoints = () => {
    if (window.confirm('Thầy/Cô có muốn làm mới điểm số cho tiết học mới không?')) {
      setClassScore({
        points: 0,
        stars: 0,
        quietStreakSeconds: 0,
        violationsCount: 0,
      });
    }
  };

  // Group Points Handlers
  const handleUpdateGroupPoints = (groupId: string, delta: number) => {
    if (delta > 0) {
      soundEffects.playRewardChime();
    } else {
      soundEffects.playDeductChime();
    }

    setGroups((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        const nextScore = Math.max(0, g.score + delta);
        const nextStars = Math.floor(nextScore / 10);
        return {
          ...g,
          score: nextScore,
          stars: Math.max(g.stars, nextStars),
        };
      })
    );
  };

  const handleResetAllGroups = () => {
    if (window.confirm('Thầy/Cô có muốn đặt lại điểm của cả 4 tổ về 0 không?')) {
      setGroups((prev) =>
        prev.map((g) => ({
          ...g,
          score: 0,
          stars: 0,
        }))
      );
    }
  };

  const handleRenameGroup = (groupId: string, newName: string) => {
    setGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, name: newName } : g))
    );
  };

  const handleResetAllData = () => {
    setClassScore(DEFAULT_CLASS_SCORE);
    setGroups(DEFAULT_GROUPS);
    setSettings(DEFAULT_SETTINGS);
    setVolume(0);
    if (isMicActive) {
      audioEngine.stop();
      setIsMicActive(false);
    }
    setIsSettingsOpen(false);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col font-sans overflow-x-hidden">
      {/* 1. VIBRANT SKY BLUE BACKDROP WITH RAINBOW & PLAYING CHILDREN */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <img
          src="/src/assets/images/playground_rainbow_sky_1794225565747.jpg"
          alt="Trường học sôi động, cầu vồng và các em nhỏ vui đùa trên sân cỏ"
          className="w-full h-full object-cover object-center filter brightness-[1.03] contrast-[1.02]"
          referrerPolicy="no-referrer"
        />
        {/* Soft, crisp glass gradient scrim to ensure 100% text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-900/25 via-sky-800/10 to-sky-950/30 backdrop-blur-[1px]" />
      </div>

      {/* Screen Shake / Red Flashing border when classroom is TOO NOISY (Red Level) */}
      {noiseLevel === 'red' && isMicActive && (
        <div className="fixed inset-0 pointer-events-none z-40 border-8 border-rose-500/80 animate-pulse transition-opacity duration-200" />
      )}

      {/* 2. TOP NAVIGATION BAR */}
      <Navbar
        isMicActive={isMicActive}
        onToggleMic={handleToggleMic}
        mode={mode}
        onModeChange={setMode}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onTestVoice={() =>
          soundEffects.speakVietnameseAlert(settings.spokenPhrase, 0, true)
        }
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
      />

      {/* Audio Error Alert Notice */}
      {audioError && (
        <div className="max-w-4xl mx-auto w-full px-4 pt-4">
          <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-900 shadow-md flex items-start gap-3">
            <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1 text-xs sm:text-sm">
              <strong className="font-bold">Lỗi truy cập microphone:</strong> {audioError}
            </div>
            <button
              onClick={() => setAudioError(null)}
              className="text-xs font-bold text-rose-700 hover:underline cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* Voice Speaking Active Toast */}
      {isSpeakingAlert && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl bg-rose-600 text-white font-bold text-sm sm:text-base shadow-2xl flex items-center gap-2.5 animate-bounce ring-4 ring-rose-300">
          <Volume2 className="w-5 h-5 animate-pulse" />
          <span>Ứng dụng đang nhắc: "{settings.spokenPhrase}"</span>
        </div>
      )}

      {/* 3. MAIN WORKSPACE CONTENT */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* HERO SECTION: 3 CẤP ĐỘ XANH - VÀNG - ĐỎ & ĐỒNG HỒ ĐỘ ỒN */}
        <section aria-label="Mức độ âm thanh và 3 cấp độ">
          <NoiseLevelHero
            volume={volume}
            noiseLevel={noiseLevel}
            isMicActive={isMicActive || isSimulationActive}
            onToggleMic={handleToggleMic}
            yellowThreshold={settings.yellowThreshold}
            redThreshold={settings.redThreshold}
            onQuickAddPoint={() => handleUpdateClassPoints(1)}
            onQuickDeductPoint={() => handleUpdateClassPoints(-1)}
          />
        </section>

        {/* SCOREBOARD SECTION: CẢ LỚP HOẶC 4 TỔ THI ĐUA */}
        <section aria-label="Bảng tính điểm thi đua trật tự">
          <ScoreBoard
            mode={mode}
            classScore={classScore}
            groups={groups}
            onUpdateClassPoints={handleUpdateClassPoints}
            onResetClassPoints={handleResetClassPoints}
            onUpdateGroupPoints={handleUpdateGroupPoints}
            onResetAllGroups={handleResetAllGroups}
            onRenameGroup={handleRenameGroup}
          />
        </section>
      </main>

      {/* 4. FOOTER NOTE */}
      <footer className="w-full py-4 text-center text-xs text-sky-950/80 font-medium bg-white/40 backdrop-blur-xs border-t border-white/40">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>Quiet Class - Dành tặng quý thầy cô và các em học sinh</span>
          </p>
          <p className="text-slate-600">
            Giữ trật tự tốt nhận ngay điểm thưởng · Học tập hăng say
          </p>
        </div>
      </footer>

      {/* 5. TEACHER SETTINGS MODAL */}
      <TeacherSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={(newSettings) =>
          setSettings((prev) => ({ ...prev, ...newSettings }))
        }
        onTestVoice={() =>
          soundEffects.speakVietnameseAlert(settings.spokenPhrase, 0, true)
        }
        onTestChime={() => soundEffects.playSoftAlertChime()}
        onResetAllData={handleResetAllData}
        simulationVolume={simulationVolume}
        onSimulationVolumeChange={setSimulationVolume}
        isSimulationActive={isSimulationActive}
        onToggleSimulation={() => {
          setIsSimulationActive((prev) => !prev);
          if (!isSimulationActive) {
            audioEngine.stop();
            setIsMicActive(false);
          }
        }}
      />
    </div>
  );
}
