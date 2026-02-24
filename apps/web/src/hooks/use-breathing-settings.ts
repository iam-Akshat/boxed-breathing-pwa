import { useState, useEffect, useCallback } from "react";
import type { BreathingConfig } from "@/lib/breathing";
import { DEFAULT_CONFIG } from "@/lib/breathing";

const STORAGE_KEY_DURATION = "boxed-breathing-duration";
const STORAGE_KEY_CYCLES = "boxed-breathing-cycles";

export interface BreathingSettings extends BreathingConfig {
  updateDuration: (duration: number) => void;
  updateCycles: (cycles: number) => void;
  reset: () => void;
}

export function useBreathingSettings(): BreathingSettings {
  const [duration, setDuration] = useState<number>(DEFAULT_CONFIG.duration);
  const [cycles, setCycles] = useState<number>(DEFAULT_CONFIG.cycles);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    try {
      const savedDuration = localStorage.getItem(STORAGE_KEY_DURATION);
      const savedCycles = localStorage.getItem(STORAGE_KEY_CYCLES);

      if (savedDuration) {
        const parsed = parseInt(savedDuration, 10);
        if (!isNaN(parsed) && parsed >= 1 && parsed <= 60) {
          setDuration(parsed);
        }
      }

      if (savedCycles) {
        const parsed = parseInt(savedCycles, 10);
        if (!isNaN(parsed) && parsed >= 1 && parsed <= 20) {
          setCycles(parsed);
        }
      }
    } catch (error) {
      console.error("Failed to load breathing settings:", error);
    }
    
    setIsLoaded(true);
  }, []);

  // Save to localStorage when values change
  useEffect(() => {
    if (!isLoaded || typeof window === "undefined") return;
    
    try {
      localStorage.setItem(STORAGE_KEY_DURATION, duration.toString());
    } catch (error) {
      console.error("Failed to save duration:", error);
    }
  }, [duration, isLoaded]);

  useEffect(() => {
    if (!isLoaded || typeof window === "undefined") return;
    
    try {
      localStorage.setItem(STORAGE_KEY_CYCLES, cycles.toString());
    } catch (error) {
      console.error("Failed to save cycles:", error);
    }
  }, [cycles, isLoaded]);

  const updateDuration = useCallback((newDuration: number) => {
    const clamped = Math.max(1, Math.min(60, newDuration));
    setDuration(clamped);
  }, []);

  const updateCycles = useCallback((newCycles: number) => {
    const clamped = Math.max(1, Math.min(20, newCycles));
    setCycles(clamped);
  }, []);

  const reset = useCallback(() => {
    setDuration(DEFAULT_CONFIG.duration);
    setCycles(DEFAULT_CONFIG.cycles);
  }, []);

  return {
    duration,
    cycles,
    updateDuration,
    updateCycles,
    reset,
  };
}
