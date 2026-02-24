import { useState, useEffect, useCallback, useRef } from "react";
import type { BreathingPhase } from "@/lib/breathing";
import { getNextPhase, PHASES } from "@/lib/breathing";

export type BreathingState = "idle" | "running" | "paused" | "completed";

export interface BreathingTimer {
  state: BreathingState;
  currentPhase: BreathingPhase;
  phaseTimeRemaining: number;
  currentCycle: number;
  totalCycles: number;
  progress: number;
  start: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  reset: () => void;
}

export function useBreathingTimer(
  duration: number,
  cycles: number,
  onPhaseChange?: (phase: BreathingPhase) => void,
  onComplete?: () => void
): BreathingTimer {
  const [state, setState] = useState<BreathingState>("idle");
  const [currentPhase, setCurrentPhase] = useState<BreathingPhase>("inhale");
  const [phaseTimeRemaining, setPhaseTimeRemaining] = useState(duration);
  const [currentCycle, setCurrentCycle] = useState(1);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastTickRef = useRef<number>(0);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const moveToNextPhase = useCallback(() => {
    setCurrentPhase((prev) => {
      const next = getNextPhase(prev);
      
      // Check if we completed a full cycle
      if (next === "inhale" && prev === "hold-empty") {
        setCurrentCycle((cycle) => {
          const nextCycle = cycle + 1;
          if (nextCycle > cycles) {
            // All cycles completed
            clearTimer();
            setState("completed");
            onComplete?.();
            return cycle;
          }
          return nextCycle;
        });
      }
      
      onPhaseChange?.(next);
      return next;
    });
    setPhaseTimeRemaining(duration);
  }, [duration, cycles, onPhaseChange, onComplete, clearTimer]);

  const tick = useCallback(() => {
    const now = Date.now();
    const delta = now - lastTickRef.current;
    
    if (delta >= 100) {
      lastTickRef.current = now;
      
      setPhaseTimeRemaining((prev) => {
        const next = prev - 0.1;
        if (next <= 0) {
          moveToNextPhase();
          return duration;
        }
        return next;
      });
    }
  }, [duration, moveToNextPhase]);

  const start = useCallback(() => {
    if (state === "running") return;
    
    setState("running");
    setCurrentPhase("inhale");
    setPhaseTimeRemaining(duration);
    setCurrentCycle(1);
    lastTickRef.current = Date.now();
    
    onPhaseChange?.("inhale");
    
    intervalRef.current = setInterval(tick, 100);
  }, [state, duration, tick, onPhaseChange]);

  const pause = useCallback(() => {
    if (state !== "running") return;
    
    clearTimer();
    setState("paused");
  }, [state, clearTimer]);

  const resume = useCallback(() => {
    if (state !== "paused") return;
    
    setState("running");
    lastTickRef.current = Date.now();
    intervalRef.current = setInterval(tick, 100);
  }, [state, tick]);

  const stop = useCallback(() => {
    clearTimer();
    setState("idle");
    setCurrentPhase("inhale");
    setPhaseTimeRemaining(duration);
    setCurrentCycle(1);
  }, [clearTimer, duration]);

  const reset = useCallback(() => {
    clearTimer();
    setState("idle");
    setCurrentPhase("inhale");
    setPhaseTimeRemaining(duration);
    setCurrentCycle(1);
  }, [clearTimer, duration]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, [clearTimer]);

  // Calculate progress percentage
  const phaseIndex = PHASES.findIndex((p) => p.phase === currentPhase);
  const phaseProgress = ((duration - phaseTimeRemaining) / duration) * 100;
  const progress = (phaseIndex * 25) + phaseProgress / 4;

  return {
    state,
    currentPhase,
    phaseTimeRemaining,
    currentCycle,
    totalCycles: cycles,
    progress,
    start,
    pause,
    resume,
    stop,
    reset,
  };
}
