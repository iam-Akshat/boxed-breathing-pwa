import type { BreathingPhase } from "@/lib/breathing";

// Audio context for generating sounds
let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  
  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    } catch {
      console.warn("Web Audio API not supported");
      return null;
    }
  }
  
  return audioContext;
}

function playTone(frequency: number, duration: number, type: OscillatorType = "sine"): void {
  const ctx = getAudioContext();
  if (!ctx) return;
  
  // Resume context if suspended (browser autoplay policy)
  if (ctx.state === "suspended") {
    ctx.resume();
  }
  
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  oscillator.frequency.value = frequency;
  oscillator.type = type;
  
  // Smooth fade in/out
  const now = ctx.currentTime;
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(0.3, now + 0.05);
  gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);
  
  oscillator.start(now);
  oscillator.stop(now + duration);
}

export function playPhaseSound(phase: BreathingPhase): void {
  const frequencies: Record<BreathingPhase, number> = {
    inhale: 440,    // A4 - calm ascending
    hold: 523.25,   // C5 - steady
    exhale: 349.23, // F4 - descending
    "hold-empty": 293.66, // D4 - lower steady
  };
  
  playTone(frequencies[phase], 0.3, "sine");
}

export function playStartSound(): void {
  // Gentle ascending chime
  const ctx = getAudioContext();
  if (!ctx) return;
  
  if (ctx.state === "suspended") {
    ctx.resume();
  }
  
  const now = ctx.currentTime;
  [440, 554.37, 659.25].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.frequency.value = freq;
    osc.type = "sine";
    
    gain.gain.setValueAtTime(0, now + i * 0.1);
    gain.gain.linearRampToValueAtTime(0.2, now + i * 0.1 + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.4);
    
    osc.start(now + i * 0.1);
    osc.stop(now + i * 0.1 + 0.4);
  });
}

export function playCompleteSound(): void {
  // Completion chime
  const ctx = getAudioContext();
  if (!ctx) return;
  
  if (ctx.state === "suspended") {
    ctx.resume();
  }
  
  const now = ctx.currentTime;
  [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.frequency.value = freq;
    osc.type = "sine";
    
    gain.gain.setValueAtTime(0, now + i * 0.08);
    gain.gain.linearRampToValueAtTime(0.25, now + i * 0.08 + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.08 + 0.5);
    
    osc.start(now + i * 0.08);
    osc.stop(now + i * 0.08 + 0.5);
  });
}

// Mock haptic feedback
export function triggerHaptic(type: "light" | "medium" | "heavy" = "light"): void {
  if (typeof navigator === "undefined") return;
  
  // Check if vibration API is available
  if ("vibrate" in navigator) {
    const patterns: Record<string, number | number[]> = {
      light: 10,
      medium: 20,
      heavy: 30,
    };
    
    try {
      navigator.vibrate(patterns[type]);
    } catch {
      // Ignore vibration errors
    }
  }
  
  // Log for development
  if (process.env.NODE_ENV === "development") {
    console.log(`[Haptic ${type}]`);
  }
}
