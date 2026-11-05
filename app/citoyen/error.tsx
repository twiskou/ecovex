"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface CitoyenErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Error boundary for the /citoyen route segment.
 * Catches unhandled server component errors (DB timeouts, cold starts, etc.)
 * so they never surface as uncaught promise rejections in the browser.
 */
export default function CitoyenError({ error, reset }: CitoyenErrorProps) {
  useEffect(() => {
    // Log to console for debugging — not a thrown error, so won't show as red
    console.warn("[CitoyenError boundary] Caught:", error.message ?? error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
      <div className="p-4 rounded-full bg-amber-50 dark:bg-amber-950/30">
        <AlertTriangle className="w-10 h-10 text-amber-500" />
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">
          Une erreur est survenue
        </h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          Le tableau de bord n'a pas pu charger les données. Cela peut arriver
          lors d'un redémarrage du serveur.
        </p>
      </div>

      <button
        onClick={reset}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
      >
        <RefreshCw size={16} />
        Réessayer
      </button>
    </div>
  );
}

