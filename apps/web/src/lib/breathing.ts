export type BreathingPhase = "inhale" | "hold" | "exhale" | "hold-empty";

export interface BreathingConfig {
  duration: number;
  cycles: number;
}

export interface PhaseInfo {
  phase: BreathingPhase;
  label: string;
  instruction: string;
  side: "top" | "right" | "bottom" | "left";
}

export const PHASES: PhaseInfo[] = [
  {
    phase: "inhale",
    label: "INHALE",
    instruction: "Breathe in through your nose",
    side: "top",
  },
  {
    phase: "hold",
    label: "HOLD",
    instruction: "Hold your breath",
    side: "right",
  },
  {
    phase: "exhale",
    label: "EXHALE",
    instruction: "Breathe out through your mouth",
    side: "bottom",
  },
  {
    phase: "hold-empty",
    label: "HOLD",
    instruction: "Hold with empty lungs",
    side: "left",
  },
];

export const DEFAULT_CONFIG: BreathingConfig = {
  duration: 4,
  cycles: 4,
};

export function getPhaseIndex(phase: BreathingPhase): number {
  return PHASES.findIndex((p) => p.phase === phase);
}

export function getNextPhase(currentPhase: BreathingPhase): BreathingPhase {
  const currentIndex = getPhaseIndex(currentPhase);
  const nextIndex = (currentIndex + 1) % PHASES.length;
  return PHASES[nextIndex].phase;
}

export function getPhaseInfo(phase: BreathingPhase): PhaseInfo {
  return PHASES.find((p) => p.phase === phase) || PHASES[0];
}

export function calculateProgress(
  currentPhase: BreathingPhase,
  phaseTimeRemaining: number,
  totalDuration: number
): number {
  const phaseProgress =
    ((totalDuration - phaseTimeRemaining) / totalDuration) * 100;
  const phaseIndex = getPhaseIndex(currentPhase);
  return (phaseIndex * 25) + phaseProgress / 4;
}
