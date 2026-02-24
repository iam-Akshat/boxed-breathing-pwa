import { useCallback, useState } from "react";
import { Play, Pause, Square, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useBreathingTimer } from "@/hooks/use-breathing-timer";
import { useBreathingSettings } from "@/hooks/use-breathing-settings";
import { getPhaseInfo, PHASES } from "@/lib/breathing";
import type { BreathingPhase } from "@/lib/breathing";
import { playPhaseSound, playStartSound, triggerHaptic } from "@/lib/audio";
import { SettingsPanel } from "@/components/settings/settings-panel";
import { CompletionScreen } from "./completion-screen";

interface BoxedBreathingProps {
  onComplete?: () => void;
}

export function BoxedBreathing({ onComplete }: BoxedBreathingProps) {
  const settings = useBreathingSettings();
  const [showSettings, setShowSettings] = useState(false);

  const handlePhaseChange = useCallback((phase: BreathingPhase) => {
    playPhaseSound(phase);
    triggerHaptic("light");
  }, []);

  const handleComplete = useCallback(() => {
    triggerHaptic("heavy");
    onComplete?.();
  }, [onComplete]);

  const timer = useBreathingTimer(
    settings.duration,
    settings.cycles,
    handlePhaseChange,
    handleComplete
  );

  const handleStart = () => {
    playStartSound();
    triggerHaptic("medium");
    timer.start();
  };

  const handlePause = () => {
    timer.pause();
  };

  const handleResume = () => {
    playStartSound();
    timer.resume();
  };

  const handleStop = () => {
    timer.stop();
  };

  const handleReset = () => {
    timer.reset();
  };

  if (timer.state === "completed") {
    return (
      <CompletionScreen
        cycles={settings.cycles}
        duration={settings.duration}
        onRestart={handleReset}
      />
    );
  }

  const currentPhaseInfo = getPhaseInfo(timer.currentPhase);
  const isRunning = timer.state === "running";
  const isPaused = timer.state === "paused";

  return (
    <div className="flex flex-col items-center justify-center gap-8 p-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-black uppercase tracking-tight">
          Boxed Breathing
        </h1>
        <div className="neo-brutalist-border bg-neo-yellow px-4 py-1 inline-block">
          <p className="text-sm font-bold text-black">
            Cycle {timer.currentCycle} of {timer.totalCycles}
          </p>
        </div>
      </div>

      {/* Main Square Visualization */}
      <div className="relative">
        {/* Phase indicators around the square */}
        {PHASES.map((phaseInfo) => (
          <div
            key={phaseInfo.phase}
            className={cn(
              "absolute flex items-center justify-center transition-all duration-500",
              phaseInfo.side === "top" &&
                "-top-12 left-1/2 -translate-x-1/2",
              phaseInfo.side === "right" &&
                "-right-20 top-1/2 -translate-y-1/2",
              phaseInfo.side === "bottom" &&
                "-bottom-12 left-1/2 -translate-x-1/2",
              phaseInfo.side === "left" &&
                "-left-20 top-1/2 -translate-y-1/2"
            )}
          >
            <div
              className={cn(
                "neo-brutalist-border px-3 py-1.5 text-xs font-bold uppercase whitespace-nowrap transition-all duration-300",
                timer.currentPhase === phaseInfo.phase
                  ? "bg-neo-yellow scale-110"
                  : "bg-background opacity-40 scale-100"
              )}
            >
              {phaseInfo.label}
            </div>
          </div>
        ))}

        {/* The Square */}
        <div className="relative w-64 h-64 sm:w-80 sm:h-80">
          {/* Background square */}
          <div className="absolute inset-0 neo-brutalist-border bg-background" />

          {/* Animated fill based on phase */}
          <div
            className={cn(
              "absolute transition-all duration-300 ease-linear",
              timer.currentPhase === "inhale" &&
                "bottom-0 left-0 right-0 bg-neo-cyan",
              timer.currentPhase === "hold" &&
                "top-0 bottom-0 right-0 bg-neo-pink",
              timer.currentPhase === "exhale" &&
                "top-0 left-0 right-0 bg-neo-yellow",
              timer.currentPhase === "hold-empty" &&
                "top-0 bottom-0 left-0 bg-neo-lime"
            )}
            style={{
              height:
                timer.currentPhase === "inhale"
                  ? `${((settings.duration - timer.phaseTimeRemaining) / settings.duration) * 100}%`
                  : timer.currentPhase === "exhale"
                    ? `${100 - ((settings.duration - timer.phaseTimeRemaining) / settings.duration) * 100}%`
                    : "100%",
              width:
                timer.currentPhase === "hold" ||
                timer.currentPhase === "hold-empty"
                  ? `${((settings.duration - timer.phaseTimeRemaining) / settings.duration) * 100}%`
                  : "100%",
              opacity: 0.7,
            }}
          />

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
            <div
              className={cn(
                "neo-brutalist-border neo-brutalist-shadow bg-background px-6 py-4 text-center transition-all duration-300",
                isRunning && "scale-105"
              )}
            >
              <div className="text-3xl sm:text-4xl font-black tabular-nums">
                {Math.ceil(timer.phaseTimeRemaining)}
              </div>
              <div className="text-xs font-bold uppercase tracking-wider mt-1 text-muted-foreground">
                seconds
              </div>
            </div>
          </div>

          {/* Progress dots */}
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex gap-2">
            {PHASES.map((phase, index) => {
              const phaseIndex = PHASES.findIndex(
                (p) => p.phase === timer.currentPhase
              );
              const isCompleted = index < phaseIndex;
              const isCurrent = index === phaseIndex;

              return (
                <div
                  key={phase.phase}
                  className={cn(
                    "w-3 h-3 neo-brutalist-border transition-all duration-300",
                    isCompleted && "bg-neo-lime",
                    isCurrent && "bg-neo-yellow scale-125",
                    !isCompleted && !isCurrent && "bg-background"
                  )}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Current phase instruction */}
      <div
        className={cn(
          "text-center transition-all duration-300",
          isRunning ? "opacity-100" : "opacity-50"
        )}
      >
        <p className="text-lg font-bold uppercase">
          {currentPhaseInfo.instruction}
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        {!isRunning && !isPaused && (
          <Button
            onClick={handleStart}
            size="lg"
            className="neo-brutalist-button bg-neo-cyan hover:bg-neo-cyan/90 text-black"
          >
            <Play className="w-5 h-5 mr-2" />
            START
          </Button>
        )}

        {isRunning && (
          <>
            <Button
              onClick={handlePause}
              size="lg"
              variant="outline"
              className="neo-brutalist-button"
            >
              <Pause className="w-5 h-5 mr-2" />
              PAUSE
            </Button>
            <Button
              onClick={handleStop}
              size="lg"
              variant="destructive"
              className="neo-brutalist-button"
            >
              <Square className="w-5 h-5 mr-2" />
              STOP
            </Button>
          </>
        )}

        {isPaused && (
          <>
            <Button
              onClick={handleResume}
              size="lg"
              className="neo-brutalist-button bg-neo-cyan hover:bg-neo-cyan/90 text-black"
            >
              <Play className="w-5 h-5 mr-2" />
              RESUME
            </Button>
            <Button
              onClick={handleStop}
              size="lg"
              variant="destructive"
              className="neo-brutalist-button"
            >
              <Square className="w-5 h-5 mr-2" />
              STOP
            </Button>
          </>
        )}

        <Button
          onClick={() => setShowSettings(true)}
          size="lg"
          variant="outline"
          className="neo-brutalist-button"
        >
          <Settings className="w-5 h-5 mr-2" />
          SETTINGS
        </Button>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <SettingsPanel
          settings={settings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
