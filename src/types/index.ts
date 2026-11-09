export type NoiseLevel = 'green' | 'yellow' | 'red';

export type CompetitionMode = 'class' | 'groups';

export interface GroupTeam {
  id: string;
  name: string;
  score: number;
  color: string;
  badge: string;
  stars: number;
}

export interface AudioSettings {
  sensitivity: number; // 0.5 to 3.0 (default 1.0)
  yellowThreshold: number; // default 35
  redThreshold: number; // default 65
  voiceAlertEnabled: boolean;
  chimeEnabled: boolean;
  spokenPhrase: string;
  alertCooldownSeconds: number;
}

export interface ClassScoreState {
  points: number;
  stars: number;
  quietStreakSeconds: number;
  violationsCount: number;
}
