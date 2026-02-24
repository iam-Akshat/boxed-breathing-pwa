import { createFileRoute } from "@tanstack/react-router";
import { BoxedBreathing } from "@/components/breathing/boxed-breathing";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <div className="min-h-full flex items-center justify-center p-4">
      <BoxedBreathing />
    </div>
  );
}
