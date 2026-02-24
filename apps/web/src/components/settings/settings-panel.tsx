import { X, RotateCcw, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { BreathingSettings } from "@/hooks/use-breathing-settings";

interface SettingsPanelProps {
  settings: BreathingSettings;
  onClose: () => void;
}

export function SettingsPanel({ settings, onClose }: SettingsPanelProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="neo-brutalist-border neo-brutalist-shadow bg-background w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b-4 border-black">
          <h2 className="text-xl font-black uppercase">Settings</h2>
          <Button
            onClick={onClose}
            size="icon"
            variant="outline"
            className="neo-brutalist-button"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Duration Setting */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold uppercase">
                Phase Duration
              </label>
              <span className="neo-brutalist-border px-3 py-1 font-mono font-bold">
                {settings.duration}s
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => settings.updateDuration(settings.duration - 1)}
                disabled={settings.duration <= 1}
                size="icon"
                variant="outline"
                className="neo-brutalist-button"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <div className="flex-1 h-4 bg-black/10 relative">
                <div
                  className="absolute top-0 left-0 h-full bg-neo-cyan transition-all duration-200"
                  style={{ width: `${(settings.duration / 20) * 100}%` }}
                />
              </div>
              <Button
                onClick={() => settings.updateDuration(settings.duration + 1)}
                disabled={settings.duration >= 20}
                size="icon"
                variant="outline"
                className="neo-brutalist-button"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Time spent on each phase (1-20 seconds)
            </p>
          </div>

          {/* Cycles Setting */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold uppercase">
                Number of Cycles
              </label>
              <span className="neo-brutalist-border px-3 py-1 font-mono font-bold">
                {settings.cycles}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => settings.updateCycles(settings.cycles - 1)}
                disabled={settings.cycles <= 1}
                size="icon"
                variant="outline"
                className="neo-brutalist-button"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <div className="flex-1 h-4 bg-black/10 relative">
                <div
                  className="absolute top-0 left-0 h-full bg-neo-pink transition-all duration-200"
                  style={{ width: `${(settings.cycles / 10) * 100}%` }}
                />
              </div>
              <Button
                onClick={() => settings.updateCycles(settings.cycles + 1)}
                disabled={settings.cycles >= 10}
                size="icon"
                variant="outline"
                className="neo-brutalist-button"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Total breathing cycles to complete (1-10)
            </p>
          </div>

          {/* Reset Button */}
          <Button
            onClick={settings.reset}
            variant="outline"
            className="w-full neo-brutalist-button"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset to Defaults
          </Button>

          {/* Info */}
          <div className="neo-brutalist-border bg-neo-yellow/20 p-4">
            <p className="text-xs font-medium">
              <strong>Boxed Breathing:</strong> Inhale → Hold → Exhale → Hold.
              Each phase takes {settings.duration} seconds. Total session time: {" "}
              {settings.duration * 4 * settings.cycles} seconds.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
