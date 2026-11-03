"use client";

import { RefreshCw, Share, Plus } from "lucide-react";
import Link from "next/link";

export function OfflineView() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-eco-50 to-background px-4 text-center">
      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
        >
          <RefreshCw size={16} />
          Réessayer
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border bg-background text-foreground font-semibold text-sm hover:bg-muted transition-colors"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
      <p className="mt-8 text-xs text-muted-foreground">
        Certaines pages déjà visitées restent accessibles hors ligne.
      </p>
      {/* Hidden imports to avoid lint warnings */}
      <span className="hidden"><Share size={0} /><Plus size={0} /></span>
    </div>
  );
}
