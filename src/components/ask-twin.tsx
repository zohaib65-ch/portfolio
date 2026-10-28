import { Sparkles } from "lucide-react";
import { DATA } from "@/data/resume";

/**
 * Floating shortcut to the AI digital twin. On small screens it sits above the
 * bottom nav dock; from md up there's room beside it.
 */
export function AskTwin() {
  return (
    <a
      href={DATA.twinUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Ask my digital twin (opens in a new tab)"
      className="group fixed bottom-20 right-4 z-30 flex items-center gap-2 rounded-full border bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/10 transition-all hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:bottom-6 md:right-6"
    >
      <Sparkles
        className="size-4 transition-transform group-hover:rotate-12"
        aria-hidden
      />
      Ask my Twin
    </a>
  );
}
