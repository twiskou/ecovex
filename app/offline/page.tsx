import { WifiOff, Leaf } from "lucide-react";
import { OfflineView } from "@/components/public/offline-view";

export const metadata = { title: "Hors ligne | ECOVEX" };

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-eco-50 to-background px-4 text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-6">
        <WifiOff size={40} className="text-primary" />
      </div>
      <div className="inline-flex items-center gap-2 mb-4">
        <Leaf size={16} className="text-primary" />
        <span className="text-sm font-semibold text-primary">ECOVEX</span>
      </div>
      <h1 className="text-3xl font-bold text-foreground mb-3">Vous êtes hors ligne</h1>
      <p className="text-muted-foreground max-w-md mb-8 text-base leading-relaxed">
        Aucune connexion internet disponible. Vérifiez votre connexion réseau et réessayez.
      </p>
      <OfflineView />
    </div>
  );
}
