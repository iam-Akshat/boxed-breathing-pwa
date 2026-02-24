import { cn } from "@/lib/utils";
import type { BreathingPhase } from "@/lib/breathing";
import { getPhaseInfo } from "@/lib/breathing";

interface BreathingPhaseProps {
  phase: BreathingPhase;
  isActive: boolean;
  duration: number;
  timeRemaining: number;
}

export function BreathingPhaseIndicator({
  phase,
  isActive,
  duration,
  timeRemaining,
}: BreathingPhaseProps) {
  const phaseInfo = getPhaseInfo(phase);
  const progress = isActive
    ? ((duration - timeRemaining) / duration) * 100
    : 0;

  return (
    <div
      className={cn(
        "relative flex flex-col items-center gap-2 transition-all duration-300",
        isActive ? "opacity-100 scale-105" : "opacity-40 scale-100"
      )}
    >
      <div
        className={cn(
          "neo-brutalist-border neo-brutalist-shadow px-4 py-2 font-bold text-sm uppercase tracking-wider transition-colors duration-300",
          isActive && "bg-neo-yellow"
        )}
      >
        {phaseInfo.label}
      </div>
      
      {isActive && (
        <div className="text-2xl font-mono font-bold tabular-nums">
          {Math.ceil(timeRemaining)}
        </div>
      )}
      
      {/* Progress bar */}
      {isActive && (
        <div className="w-full h-2 bg-black/10 overflow-hidden">
          <div
            className="h-full bg-neo-pink transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}

interface PhaseSideIndicatorProps {
  phase: BreathingPhase;
  isActive: boolean;
  side: "top" | "right" | "bottom" | "left";
}

export function PhaseSideIndicator({
  phase,
  isActive,
  side,
}: PhaseSideIndicatorProps) {
  const phaseInfo = getPhaseInfo(phase);
  
  const sideClasses = {
    top: "top-0 left-1/2 -translate-x-1/2 -translate-y-full pb-2",
    right: "right-0 top-1/2 translate-x-full -translate-y-1/2 pl-2",
    bottom: "bottom-0 left-1/2 -translate-x-1/2 translate-y-full pt-2",
    left: "left-0 top-1/2 -translate-x-full -translate-y-1/2 pr-2",
  };

  return (
    <div
      className={cn(
        "absolute flex items-center gap-2 transition-all duration-300",
        sideClasses[side],
        isActive ? "opacity-100" : "opacity-30"
      )}
    >
      <div
        className={cn(
          "neo-brutalist-border px-3 py-1 text-xs font-bold uppercase whitespace-nowrap",
          isActive ? "bg-neo-cyan" : "bg-background"
        )}
      >
        {phaseInfo.label}
      </div>
    </div>
  );
}
