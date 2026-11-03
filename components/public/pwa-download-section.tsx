"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import Image from "next/image";
import {
  Download,
  Smartphone,
  Wifi,
  Zap,
  Bell,
  CheckCircle2,
  Monitor,
  Tablet,
  ShieldCheck,
  ChevronRight,
  Laptop,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";

/* ─── Types ────────────────────────────────────────────────────── */
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

type DeviceCategory = "desktop" | "mobile" | "tablet";

/* ─── Client / Standalone detection via useSyncExternalStore ───── */
const emptySubscribe = () => () => { };

function getIsStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

function subscribeStandalone(callback: () => void) {
  if (typeof window === "undefined") return () => { };
  const mediaQuery = window.matchMedia("(display-mode: standalone)");
  mediaQuery.addEventListener("change", callback);
  window.addEventListener("appinstalled", callback);
  return () => {
    mediaQuery.removeEventListener("change", callback);
    window.removeEventListener("appinstalled", callback);
  };
}

function detectUserDevice(): DeviceCategory {
  if (typeof window === "undefined") return "desktop";
  const ua = navigator.userAgent.toLowerCase();
  if (/ipad|tablet|(android(?!.*mobile))/.test(ua)) return "tablet";
  if (/iphone|ipod|mobile|android/.test(ua)) return "mobile";
  return "desktop";
}

function AddressBarInstallIcon() {
  return (
    <span
      title="Icône d'installation"
      className="inline-flex items-center justify-center w-5 h-5 rounded border border-border bg-muted/90 text-foreground align-middle mx-1 shadow-2xs"
    >
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
      </svg>
    </span>
  );
}

/* ─── Component ────────────────────────────────────────────────── */
export function PWADownloadSection() {
  const { lang } = useLang();
  const isAr = lang === "ar";

  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const isStandalone = useSyncExternalStore(subscribeStandalone, getIsStandalone, () => false);
  const userDevice = useSyncExternalStore<DeviceCategory>(emptySubscribe, detectUserDevice, () => "desktop");

  const [userSelectedTab, setUserSelectedTab] = useState<DeviceCategory | null>(null);
  const activeTab: DeviceCategory = userSelectedTab ?? userDevice;

  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [justInstalled, setJustInstalled] = useState<boolean>(false);
  const [installing, setInstalling] = useState<boolean>(false);
  const [showGuide, setShowGuide] = useState<boolean>(false);

  // Listen for beforeinstallprompt event
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const isAlreadyInstalled = isStandalone || justInstalled;

  const handleInstallClick = async () => {
    // If native prompt is available (Chrome/Edge on Desktop, Android)
    if (deferredPrompt) {
      setInstalling(true);
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === "accepted") {
          setJustInstalled(true);
          setShowGuide(false);
        }
      } catch (err) {
        console.error("Install prompt error:", err);
      } finally {
        setInstalling(false);
        setDeferredPrompt(null);
      }
      return;
    }

    // Toggle guide for manual installation (iOS, Safari, or address bar icon)
    setShowGuide((prev) => !prev);
  };

  /* ── Translations ── */
  const t = {
    badge: isAr ? "تجربة متكاملة على جميع الشاشات" : "Expérience Multi-Écrans • PWA",
    title1: isAr ? "استخدم تطبيق" : "Une application unique sur",
    titleHighlight: "ECOVEX",
    title2: isAr ? "على الحاسوب، الهاتف واللوحة" : "PC, Tablette et Mobile",
    description: isAr
      ? "لا داعي للبحث في متاجر التطبيقات. ثبّت ECOVEX مباشرة من متصفحك واستمتع بتجربة تطبيق أصلي فائق السرعة، متزامن بالكامل ويعمل بدون إنترنت."
      : "Aucun téléchargement lourd depuis les stores. Installez ECOVEX directement depuis votre navigateur et profitez d'une application native, ultra-rapide, synchronisée et accessible hors ligne.",
    installBtn: isAr ? "تثبيت التطبيق الآن" : "Installer l'application",
    installingBtn: isAr ? "جارٍ التثبيت..." : "Installation en cours...",
    installedBadge: isAr ? "✓ التطبيق مثبّت على جهازك" : "✓ Application déjà installée",
    howToBtn: isAr ? "دليل التثبيت حسب الجهاز" : "Instructions par appareil",
    tabs: {
      desktop: isAr ? "حاسوب (PC / Mac)" : "Ordinateur (PC / Mac)",
      tablet: isAr ? "لوحة إلكترونية (Tablette)" : "Tablette (iPad / Android)",
      mobile: isAr ? "هاتف (Android / iOS)" : "Smartphone (Mobile)",
    },
    features: [
      {
        icon: Zap,
        title: isAr ? "سرعة وتشغيل فوري" : "Démarrage instantané",
        desc: isAr ? "أقل من 2 ميغابايت، يفتح بلمسة واحدة بدون انتظار" : "Moins de 2 Mo, se lance immédiatement depuis l'écran d'accueil",
      },
      {
        icon: Wifi,
        title: isAr ? "يعمل بدون إنترنت" : "Mode hors-ligne certifié",
        desc: isAr ? "تصفح رصيدك ونقاط الجمع حتى في حال انقطاع الشبكة" : "Consultez vos points et la carte des dépôts sans connexion réseau",
      },
      {
        icon: Bell,
        title: isAr ? "مزامنة لحظية" : "Synchronisation instantanée",
        desc: isAr ? "تحديث تلقائي لجميع عملياتك ومكافآتك البيئية" : "Vos déclarations et gains de points sont synchronisés en direct",
      },
      {
        icon: ShieldCheck,
        title: isAr ? "تحديثات مستمرة وتلقائية" : "100% Gratuit & Auto-mis à jour",
        desc: isAr ? "تحديثات أمان فورية مجانية دون الحاجة لإعادة التنزيل" : "Mises à jour transparentes sans passer par Google Play ou App Store",
      },
    ],
    devicePills: {
      pc: isAr ? "حاسوب محمول ومكتبي" : "PC & Mac Desktop",
      tablet: isAr ? "شاشة لمسية مريحة" : "Tablette iPad & Android",
      phone: isAr ? "تطبيق هاتف خفيف" : "Mobile fluide & réactif",
      offline: isAr ? "دعم وضع عدم الاتصال" : "Cache PWA actif",
    },
    guides: {
      desktop: {
        title: isAr ? "طريقة التثبيت على الكمبيوتر (Windows / Mac / Linux) :" : "Installation sur Ordinateur (Chrome, Edge, Brave) :",
        steps: [
          isAr ? (
            <span>
              انقر على أيقونة التثبيت <AddressBarInstallIcon /> في شريط العنوان (URL) أعلى المتصفح.
            </span>
          ) : (
            <span>
              Cliquez sur l&apos;icône d&apos;installation <AddressBarInstallIcon /> située tout à droite de la barre d&apos;adresse (URL).
            </span>
          ),
          isAr ? "أو افتح قائمة المتصفح (⋮) في الزاوية العلوية واضغط على «تثبيت ECOVEX»." : "Ou cliquez sur le menu (⋮) en haut à droite, puis sélectionnez « Installer ECOVEX ».",
          isAr ? "سيظهر التطبيق كبرنامج مستقل على سطح المكتب وقائمة البداية." : "L'application s'ouvrira dans sa propre fenêtre native et créera un raccourci sur votre bureau.",
        ],
      },
      tablet: {
        title: isAr ? "طريقة التثبيت على الأجهزة اللوحية (iPad / Android Tablet) :" : "Installation sur Tablette (iPadOS / Android) :",
        steps: [
          isAr ? "على iPad: اضغط على زر المشاركة في Safari ثم اختر «إضافة إلى الشاشة الرئيسية»." : "Sur iPad (Safari) : touchez l'icône Partager ⎋ puis sélectionnez « Sur l'écran d'accueil ».",
          isAr ? "على Android: اضغط على قائمة المتصفح ثم اختر «تثبيت التطبيق»." : "Sur tablette Android (Chrome) : touchez le menu (⋮) puis « Installer l'application ».",
          isAr ? "استمتع بمساحة عرض واسعة ومثالية لمتابعة الخريطة وعمليات الفرز." : "Profitez d'un grand écran idéal pour la cartographie des points de collecte et vos statistiques.",
        ],
      },
      mobile: {
        title: isAr ? "طريقة التثبيت على الهواتف الذكية (Android / iPhone) :" : "Installation sur Smartphone (Android & iOS) :",
        steps: [
          isAr ? "Android : انقر على الزر أعلاه ثم أكد التثبيت في النافذة التلقائية." : "Sur Android (Chrome) : appuyez sur le bouton vert ci-dessus pour déclencher l'installation directe.",
          isAr ? "iPhone : اضغط على أيقونة المشاركة (Share) في أسفل Safari ثم «إضافة إلى الشاشة الرئيسية»." : "Sur iPhone (Safari) : appuyez sur Partager ⎋ puis touchez « Sur l'écran d'accueil » ⊞.",
          isAr ? "سيتم إنشاء أيقونة ECOVEX الرسمية على شاشتك الرئيسية للوصول اليومي السريع." : "Une icône native ECOVEX apparaît sur votre écran d'accueil avec accès instantané.",
        ],
      },
    },
  };

  if (!mounted) return null;

  return (
    <section className="relative overflow-hidden py-20 sm:py-28 bg-gradient-to-b from-background via-eco-50/30 to-background border-t border-border/60">
      {/* Background ambient decorative glow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 ltr:left-1/2 rtl:right-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-primary/6 blur-[120px]" />
        <div className="absolute top-10 ltr:right-10 rtl:left-10 w-[400px] h-[400px] rounded-full bg-emerald-400/5 blur-[90px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ─── Top Header: Title, Description & Main Action ─── */}
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-5 shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            <Laptop size={14} />
            <span>{t.badge}</span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground leading-[1.15]">
            {t.title1} <span className="text-primary">{t.titleHighlight}</span> {t.title2}
          </h2>

          {/* Subtitle */}
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            {t.description}
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            {isAlreadyInstalled ? (
              <div className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-primary/15 border border-primary/30 text-primary font-bold text-sm shadow-sm">
                <CheckCircle2 size={18} />
                <span>{t.installedBadge}</span>
              </div>
            ) : (
              <Button
                size="lg"
                onClick={handleInstallClick}
                disabled={installing}
                className="gap-2.5 px-8 h-12 rounded-xl text-sm font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 transition-all cursor-pointer group"
              >
                <Download size={18} className="transition-transform group-hover:-translate-y-0.5" />
                <span>{installing ? t.installingBtn : t.installBtn}</span>
              </Button>
            )}

            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowGuide((prev) => !prev)}
              className="gap-2 h-12 px-6 rounded-xl border-border bg-card/80 hover:bg-muted font-semibold text-xs text-foreground cursor-pointer shadow-xs"
            >
              <span>{t.howToBtn}</span>
              <ChevronRight size={14} className={`transition-transform duration-200 ${showGuide ? "rotate-90 rtl:-rotate-90" : "rtl:rotate-180"}`} />
            </Button>
          </div>

          {/* Device Tabs Selector */}
          <div className="mt-8 inline-flex p-1.5 rounded-2xl bg-muted/60 border border-border/80 backdrop-blur-sm gap-1 max-w-full overflow-x-auto">
            <button
              onClick={() => setUserSelectedTab("desktop")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${activeTab === "desktop"
                  ? "bg-card text-foreground shadow-sm border border-border/60"
                  : "text-muted-foreground hover:text-foreground hover:bg-card/40"
                }`}
            >
              <Monitor size={15} className={activeTab === "desktop" ? "text-primary" : ""} />
              <span>{t.tabs.desktop}</span>
            </button>

            <button
              onClick={() => setUserSelectedTab("tablet")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${activeTab === "tablet"
                  ? "bg-card text-foreground shadow-sm border border-border/60"
                  : "text-muted-foreground hover:text-foreground hover:bg-card/40"
                }`}
            >
              <Tablet size={15} className={activeTab === "tablet" ? "text-primary" : ""} />
              <span>{t.tabs.tablet}</span>
            </button>

            <button
              onClick={() => setUserSelectedTab("mobile")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${activeTab === "mobile"
                  ? "bg-card text-foreground shadow-sm border border-border/60"
                  : "text-muted-foreground hover:text-foreground hover:bg-card/40"
                }`}
            >
              <Smartphone size={15} className={activeTab === "mobile" ? "text-primary" : ""} />
              <span>{t.tabs.mobile}</span>
            </button>
          </div>

          {/* Conditional Step-by-Step Instruction Card */}
          {showGuide && (() => {
            const guide = t.guides[activeTab];
            return (
              <div className="mt-5 mx-auto max-w-2xl text-start rounded-2xl border border-primary/25 bg-card/95 backdrop-blur-md p-5 sm:p-6 shadow-xl animate-in fade-in slide-in-from-top-3 duration-200">
                <div className="flex items-center gap-2.5 mb-3.5">
                  {activeTab === "desktop" && <Monitor size={18} className="text-primary" />}
                  {activeTab === "tablet" && <Tablet size={18} className="text-primary" />}
                  {activeTab === "mobile" && <Smartphone size={18} className="text-primary" />}
                  <h4 className="font-bold text-foreground text-sm">
                    {guide.title}
                  </h4>
                </div>
                <ol className="space-y-2.5">
                  {guide.steps.map((step: React.ReactNode, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-muted-foreground">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/15 text-primary font-bold text-xs shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            );
          })()}
        </div>

        {/* ─── Heroic Multi-Device Visual Stage (PC + Tablet + Phone) ─── */}
        <div className="mt-14 sm:mt-16 relative">
          {/* Ambient Glow behind the device group */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-4 sm:-inset-8 -z-10 rounded-[3rem] bg-gradient-to-b from-primary/15 via-emerald-400/10 to-transparent blur-3xl opacity-70"
          />

          <div className="relative mx-auto max-w-5xl rounded-3xl border border-border/70 bg-card/50 backdrop-blur-md p-3 sm:p-6 shadow-2xl overflow-hidden group">
            {/* Top Device Bar Simulation */}
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-border/50 text-xs text-muted-foreground px-2">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                </div>
                <span className="text-[11px] font-mono font-medium ps-2 text-foreground/70 hidden sm:inline">
                  https://ecovex.app/pwa
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                  <Wifi size={10} />
                  <span>{t.devicePills.offline}</span>
                </span>
                <span className="hidden md:inline-flex text-[11px] font-semibold text-muted-foreground">
                  ECOVEX Desktop & Mobile Suite
                </span>
              </div>
            </div>

            {/* Generated Multi-Device Visual (PC, Tablette, Téléphone) */}
            <div className="relative mt-3 sm:mt-4 rounded-2xl overflow-hidden aspect-[16/9] w-full bg-zinc-950/5 flex items-center justify-center">
              <Image
                src="/pwa-multi-devices.jpg"
                alt={isAr ? "تطبيق ECOVEX على الحاسوب واللوحة والهاتف" : "Application ECOVEX sur PC portable, Tablette et Smartphone"}
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1100px"
                className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.015]"
              />

              {/* Floating Pro Badge 1 - Left / Top: PC */}
              <div className="hidden sm:flex absolute top-4 ltr:left-4 rtl:right-4 items-center gap-2.5 bg-background/90 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-primary/20 shadow-xl text-xs font-semibold text-foreground">
                <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Laptop size={16} />
                </div>
                <div className="text-start">
                  <p className="font-bold text-foreground text-[11px] leading-tight">
                    {t.devicePills.pc}
                  </p>
                  <p className="text-[9px] text-muted-foreground font-normal">
                    {isAr ? "وضع النوافذ والشاشات الكبيرة" : "Grand écran & Dashboard complet"}
                  </p>
                </div>
              </div>

              {/* Floating Pro Badge 2 - Right / Top: Tablette */}
              <div className="hidden sm:flex absolute top-4 ltr:right-4 rtl:left-4 items-center gap-2.5 bg-background/90 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-primary/20 shadow-xl text-xs font-semibold text-foreground">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                  <Tablet size={16} />
                </div>
                <div className="text-start">
                  <p className="font-bold text-foreground text-[11px] leading-tight">
                    {t.devicePills.tablet}
                  </p>
                  <p className="text-[9px] text-muted-foreground font-normal">
                    {isAr ? "تحكم لمسي سريع وسلس" : "Interface tactile intuitive"}
                  </p>
                </div>
              </div>

              {/* Floating Pro Badge 3 - Bottom / Center: Mobile */}
              <div className="absolute bottom-3 sm:bottom-4 ltr:left-4 sm:ltr:left-6 rtl:right-4 sm:rtl:right-6 flex items-center gap-2.5 bg-background/95 backdrop-blur-md px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl border border-primary/20 shadow-2xl text-xs font-semibold text-foreground">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                  <Smartphone size={16} />
                </div>
                <div className="text-start">
                  <p className="font-bold text-foreground text-[10px] sm:text-[11px] leading-tight">
                    {t.devicePills.phone}
                  </p>
                  <p className="text-[8px] sm:text-[9px] text-muted-foreground font-normal">
                    {isAr ? "تثبيت فوري بدون متجر" : "Installation 1-clic native"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── 4 Feature Highlights Grid ─── */}
        <div className="mt-14 sm:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {t.features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="group relative p-5 rounded-2xl bg-card border border-border/70 hover:border-primary/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-primary/10 text-primary mb-3.5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-bold text-foreground text-sm leading-snug">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
