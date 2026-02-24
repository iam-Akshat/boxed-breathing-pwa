import { useEffect } from "react";
import { RotateCcw, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { playCompleteSound, triggerHaptic } from "@/lib/audio";

interface CompletionScreenProps {
  cycles: number;
  duration: number;
  onRestart: () => void;
}

export function CompletionScreen({
  cycles,
  duration,
  onRestart,
}: CompletionScreenProps) {
  useEffect(() => {
    playCompleteSound();
    triggerHaptic("heavy");
  }, []);

  const totalTime = cycles * duration * 4;

  return (
    <div className="flex flex-col items-center justify-center gap-8 p-4 min-h-[60vh]">
      {/* Success Icon */}
      <div className="relative">
        <div className="neo-brutalist-border neo-brutalist-shadow bg-neo-lime w-32 h-32 flex items-center justify-center animate-bounce">
          <Check className="w-16 h-16 text-black" strokeWidth={3} />
        </div>
        <div className="absolute -top-4 -right-4 w-8 h-8 bg-neo-pink neo-brutalist-border" />
        <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-neo-cyan neo-brutalist-border" />
      </div>

      {/* Title */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-black uppercase">Session Complete!</h1>
        <p className="text-muted-foreground">
          Great job! You completed your breathing exercise.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 w-full max-w-md">
        <div className="neo-brutalist-border neo-brutalist-shadow bg-background p-4 text-center">
          <div className="text-2xl font-black text-neo-cyan">{cycles}</div>
          <div className="text-xs font-bold uppercase text-muted-foreground">
            Cycles
          </div>
        </div>
        <div className="neo-brutalist-border neo-brutalist-shadow bg-background p-4 text-center">
          <div className="text-2xl font-black text-neo-pink">{duration}s</div>
          <div className="text-xs font-bold uppercase text-muted-foreground">
            Per Phase
          </div>
        </div>
        <div className="neo-brutalist-border neo-brutalist-shadow bg-background p-4 text-center">
          <div className="text-2xl font-black text-neo-yellow">{totalTime}s</div>
          <div className="text-xs font-bold uppercase text-muted-foreground">
            Total Time
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="neo-brutalist-border bg-neo-cyan/20 p-4 max-w-md">
        <h3 className="font-bold uppercase mb-2">Benefits of Boxed Breathing:</h3>
        <ul className="text-sm space-y-1 text-muted-foreground">
          <li>• Reduces stress and anxiety</li>
          <li>• Improves focus and concentration</li>
          <li>• Calms the nervous system</li>
          <li>• Enhances mental clarity</li>
        </ul>
      </div>

      {/* Restart Button */}
      <Button
        onClick={onRestart}
        size="lg"
        className="neo-brutalist-button bg-neo-cyan hover:bg-neo-cyan/90 text-black"
      >
        <RotateCcw className="w-5 h-5 mr-2" />
        Start New Session
      </Button>
    </div>
  );
}
