import React, { useState } from 'react';
import {
  Trophy,
  Star,
  Plus,
  Minus,
  RotateCcw,
  Sparkles,
  Crown,
  Medal,
  Flame,
  Award,
  Edit2,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CompetitionMode, GroupTeam, ClassScoreState } from '../types';

interface ScoreBoardProps {
  mode: CompetitionMode;
  classScore: ClassScoreState;
  groups: GroupTeam[];
  onUpdateClassPoints: (delta: number) => void;
  onResetClassPoints: () => void;
  onUpdateGroupPoints: (groupId: string, delta: number) => void;
  onResetAllGroups: () => void;
  onRenameGroup: (groupId: string, newName: string) => void;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  mode,
  classScore,
  groups,
  onUpdateClassPoints,
  onResetClassPoints,
  onUpdateGroupPoints,
  onResetAllGroups,
  onRenameGroup,
}) => {
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editNameValue, setEditNameValue] = useState('');

  // Find leading group
  const highestGroupScore = Math.max(...groups.map((g) => g.score), 0);

  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#38bdf8', '#fbbf24', '#f43f5e', '#a855f7'],
    });
  };

  const handleClassPoints = (delta: number) => {
    onUpdateClassPoints(delta);
    if (delta > 0) {
      triggerCelebration();
    }
  };

  const handleGroupPoints = (groupId: string, delta: number) => {
    onUpdateGroupPoints(groupId, delta);
    if (delta > 0) {
      triggerCelebration();
    }
  };

  const startEditing = (groupId: string, currentName: string) => {
    setEditingGroupId(groupId);
    setEditNameValue(currentName);
  };

  const saveEditing = (groupId: string) => {
    if (editNameValue.trim()) {
      onRenameGroup(groupId, editNameValue.trim());
    }
    setEditingGroupId(null);
  };

  return (
    <div className="w-full rounded-3xl bg-white/80 backdrop-blur-md border border-white/70 shadow-lg p-5 sm:p-7">
      {/* SECTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-sky-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-400/20 text-amber-600 flex items-center justify-center font-bold">
            <Trophy className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-['Outfit']">
              {mode === 'class'
                ? 'Bảng Điểm Thi Đua Cả Lớp'
                : 'Bảng Thi Đua 4 Tổ Trong Lớp'}
            </h2>
            <p className="text-xs text-slate-500">
              {mode === 'class'
                ? 'Giáo viên bấm nút cộng khi lớp yên lặng (Xanh) hoặc trừ khi quá ồn (Đỏ)'
                : 'Theo dõi điểm tích lũy của từng tổ để trao cờ thi đua cuối tuần'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {mode === 'class' ? (
            <button
              onClick={onResetClassPoints}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Đặt lại điểm về 0 để bắt đầu tiết học mới"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Làm mới tiết học</span>
            </button>
          ) : (
            <button
              onClick={onResetAllGroups}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Đặt lại điểm tất cả 4 tổ"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Đặt lại điểm các tổ</span>
            </button>
          )}
        </div>
      </div>

      {/* MODE 1: WHOLE CLASS VIEW */}
      {mode === 'class' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Main Score Showcase */}
            <div className="md:col-span-2 p-6 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-md flex flex-col justify-between relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none" />

              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-semibold text-sky-100 uppercase tracking-wider">
                    Điểm Trật Tự Toàn Lớp
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-5xl sm:text-6xl font-black font-['Outfit'] tabular-nums tracking-tight">
                      {classScore.points}
                    </span>
                    <span className="text-lg font-bold text-sky-200">điểm</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/20 backdrop-blur-xs text-amber-300 font-bold text-sm">
                  <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
                  <span>{classScore.stars} Ngôi Sao</span>
                </div>
              </div>

              {/* Goal Progress bar (Every 20 pts gives a star) */}
              <div className="mt-6 pt-4 border-t border-white/20">
                <div className="flex items-center justify-between text-xs text-sky-100 font-medium mb-1.5">
                  <span>Tiến độ nhận Sao Thưởng tiếp theo</span>
                  <span className="font-bold">
                    {(classScore.points % 20 + 20) % 20}/20 điểm
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-black/20 overflow-hidden p-0.5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-300 to-amber-400 transition-all duration-300"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(5, (((classScore.points % 20 + 20) % 20) / 20) * 100)
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Quick Summary Card */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Quy Tắc Chấm Điểm
                </h4>
                <ul className="space-y-2.5 text-xs text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1 shrink-0" />
                    <span>
                      <strong className="text-emerald-700">Mức Xanh:</strong> Lớp ngoan, bấm <strong>+1, +2, +5</strong> để khen thưởng.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500 mt-1 shrink-0" />
                    <span>
                      <strong className="text-amber-700">Mức Vàng:</strong> Hơi ồn, giữ nguyên điểm, nhắc nhở nhẹ.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500 mt-1 shrink-0" />
                    <span>
                      <strong className="text-rose-700">Mức Đỏ:</strong> Quá ồn, máy sẽ nói <em>"Im lặng đi!"</em> và bấm <strong>-1, -2</strong> để phạt.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>Mốc mục tiêu cuối giờ:</span>
                <span className="text-sky-700 font-bold">50 Điểm</span>
              </div>
            </div>
          </div>

          {/* Teacher Fast Control Buttons */}
          <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Thao tác giáo viên:
              </span>
            </div>

            {/* Reward Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-emerald-800 font-semibold mr-1">Thưởng trật tự:</span>
              <button
                onClick={() => handleClassPoints(1)}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+1 Điểm</span>
              </button>
              <button
                onClick={() => handleClassPoints(2)}
                className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+2 Điểm</span>
              </button>
              <button
                onClick={() => handleClassPoints(5)}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-95 text-white text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>+5 Điểm Tuyệt Vời</span>
              </button>
            </div>

            {/* Deduct Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-rose-800 font-semibold mr-1">Phạt ồn ào:</span>
              <button
                onClick={() => handleClassPoints(-1)}
                className="px-3.5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 active:scale-95 text-white text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center gap-1 cursor-pointer"
              >
                <Minus className="w-4 h-4" />
                <span>-1 Điểm</span>
              </button>
              <button
                onClick={() => handleClassPoints(-2)}
                className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center gap-1 cursor-pointer"
              >
                <Minus className="w-4 h-4" />
                <span>-2 Điểm</span>
              </button>
              <button
                onClick={() => handleClassPoints(-5)}
                className="px-3.5 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 active:scale-95 text-white text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center gap-1 cursor-pointer"
              >
                <Flame className="w-4 h-4" />
                <span>-5 Điểm Quá Ồn</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: 4 GROUPS COMPETITION VIEW */}
      {mode === 'groups' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {groups.map((group) => {
              const isLeader = group.score > 0 && group.score === highestGroupScore;
              return (
                <div
                  key={group.id}
                  className={`relative rounded-2xl p-5 border-2 transition-all duration-300 flex flex-col justify-between ${
                    isLeader
                      ? 'bg-amber-500/10 border-amber-400 shadow-md ring-2 ring-amber-300/50'
                      : 'bg-white border-slate-200/90 hover:border-sky-300'
                  }`}
                >
                  {/* Leader Crown Badge */}
                  {isLeader && (
                    <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-amber-400 text-amber-950 text-[11px] font-black flex items-center gap-1 shadow-xs animate-bounce">
                      <Crown className="w-3.5 h-3.5" />
                      <span>Dẫn Đầu</span>
                    </div>
                  )}

                  {/* Group Header */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-2xl">{group.badge}</span>
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-100/70 px-2 py-0.5 rounded-md">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>{group.stars}</span>
                      </div>
                    </div>

                    {/* Group Name (Editable) */}
                    {editingGroupId === group.id ? (
                      <div className="flex items-center gap-1 mb-3">
                        <input
                          type="text"
                          value={editNameValue}
                          onChange={(e) => setEditNameValue(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && saveEditing(group.id)}
                          className="w-full text-sm font-bold text-slate-800 px-2 py-1 bg-white border border-sky-400 rounded-lg focus:outline-hidden"
                          autoFocus
                        />
                        <button
                          onClick={() => saveEditing(group.id)}
                          className="p-1 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-1 mb-3 group/edit">
                        <h3 className="text-base font-bold text-slate-900 font-['Outfit'] truncate">
                          {group.name}
                        </h3>
                        <button
                          onClick={() => startEditing(group.id, group.name)}
                          className="opacity-0 group-hover/edit:opacity-100 text-slate-400 hover:text-sky-600 p-1 transition-opacity cursor-pointer"
                          title="Đổi tên tổ"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {/* Score display */}
                    <div className="flex items-baseline gap-1.5 mb-4">
                      <span className="text-4xl font-black font-['Outfit'] tabular-nums text-slate-800">
                        {group.score}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">điểm</span>
                    </div>
                  </div>

                  {/* Quick Group Action Buttons */}
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleGroupPoints(group.id, 1)}
                        className="flex-1 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-0.5 cursor-pointer"
                        title="Thưởng 1 điểm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>1</span>
                      </button>
                      <button
                        onClick={() => handleGroupPoints(group.id, 2)}
                        className="flex-1 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-0.5 cursor-pointer"
                        title="Thưởng 2 điểm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>2</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleGroupPoints(group.id, -1)}
                        className="flex-1 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all flex items-center justify-center gap-0.5 cursor-pointer"
                        title="Trừ 1 điểm vì ồn ào"
                      >
                        <Minus className="w-3 h-3" />
                        <span>1</span>
                      </button>
                      <button
                        onClick={() => handleGroupPoints(group.id, -2)}
                        className="flex-1 py-1 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-300 text-xs font-bold transition-all flex items-center justify-center gap-0.5 cursor-pointer"
                        title="Trừ 2 điểm vì quá ồn"
                      >
                        <Minus className="w-3 h-3" />
                        <span>2</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick teacher all-group actions */}
          <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="font-semibold text-slate-700">
              💡 <em>Mẹo:</em> Khi cả 4 tổ cùng giữ trật tự tốt, thầy cô có thể thưởng đồng loạt +1 điểm cho tất cả.
            </span>
            <button
              onClick={() => {
                groups.forEach((g) => handleGroupPoints(g.id, 1));
              }}
              className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold flex items-center gap-1 shadow-xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Thưởng +1 cho tất cả các tổ</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
