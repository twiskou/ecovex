"use client";

import { Badge } from "@/components/ui/badge";
import { Cookie } from "lucide-react";
import { useLang } from "@/lib/i18n";

export function CookiesView() {
  const { lang, t } = useLang();

  if (lang === "ar") {
    return (
      <div className="py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">قانوني</Badge>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl flex items-center justify-center gap-3">
              <Cookie size={32} className="text-primary" />
              سياسة ملفات تعريف الارتباط (الكوكيز)
            </h1>
            <p className="mt-4 text-muted-foreground">آخر تحديث: أكتوبر 2026</p>
          </div>

          <div className="prose prose-sm max-w-none space-y-8 text-muted-foreground text-start">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">1. ما هي ملفات تعريف الارتباط؟</h2>
              <p>
                ملفات تعريف الارتباط هي ملفات نصية صغيرة وآمنة تُخزن على جهازك عند زيارة موقع ويب لتمكين الموقع من تذكر جلسة تسجيل دخولك وتأمين تصفحك بين الصفحات.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">2. الملفات المستخدمة في إيكوفيكس</h2>
              <div className="rounded-xl border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-start px-4 py-3 font-medium text-foreground">الاسم</th>
                      <th className="text-start px-4 py-3 font-medium text-foreground">النوع</th>
                      <th className="text-start px-4 py-3 font-medium text-foreground">الصلاحية</th>
                      <th className="text-start px-4 py-3 font-medium text-foreground">الغرض</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/50">
                      <td className="px-4 py-3 font-mono text-xs">ecovex_session</td>
                      <td className="px-4 py-3">أساسي وإلزامي</td>
                      <td className="px-4 py-3">7 أيام</td>
                      <td className="px-4 py-3">تأمين جلسة تسجيل الدخول المشفرة</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">3. الكوكيز الأساسية</h2>
              <p>
                تستخدم المنصة فقط ملف تعريف ارتباط واحد مشفر لتأمين الدخول، وهو محمي بخاصية <strong className="text-foreground">HttpOnly</strong> و <strong className="text-foreground">SameSite=Lax</strong> لحمايتك التامة من هجمات الاختراق وانتحال الشخصية.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">4. لا توجد ملفات تتبع إعلانية</h2>
              <p>
                لا تستخدم إيكوفيكس أي ملفات تتبع تجارية أو إعلانية أو كوكيز تابعة لجهات خارجية تهدف لجمع بيانات التصفح.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">5. التواصل والاستفسار</h2>
              <p>
                لأي أسئلة إضافية، يرجى التواصل عبر{" "}
                <a href="mailto:contact@ecovex.app" className="text-primary hover:underline">
                  contact@ecovex.app
                </a>.
              </p>
            </section>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">Légal</Badge>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl flex items-center justify-center gap-3">
            <Cookie size={32} className="text-primary" />
            Politique des cookies
          </h1>
          <p className="mt-4 text-muted-foreground">Dernière mise à jour : octobre 2026</p>
        </div>

        <div className="prose prose-sm max-w-none space-y-8 text-muted-foreground text-start">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Qu&apos;est-ce qu&apos;un cookie ?</h2>
            <p>
              Un cookie est un petit fichier texte stocké sur votre appareil lors de la visite
              d&apos;un site web. Il permet au site de mémoriser certaines informations entre les pages.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Cookies utilisés par ECOVEX</h2>
            <div className="rounded-xl border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-start px-4 py-3 font-medium text-foreground">Nom</th>
                    <th className="text-start px-4 py-3 font-medium text-foreground">Type</th>
                    <th className="text-start px-4 py-3 font-medium text-foreground">Durée</th>
                    <th className="text-start px-4 py-3 font-medium text-foreground">Objectif</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50">
                    <td className="px-4 py-3 font-mono text-xs">ecovex_session</td>
                    <td className="px-4 py-3">Essentiel</td>
                    <td className="px-4 py-3">7 jours</td>
                    <td className="px-4 py-3">Session d&apos;authentification sécurisée</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Cookies essentiels</h2>
            <p>
              ECOVEX utilise uniquement un cookie de session essentiel pour votre
              authentification. Ce cookie est{" "}
              <strong className="text-foreground">HttpOnly</strong> (inaccessible depuis
              JavaScript),{" "}
              <strong className="text-foreground">Secure</strong> (transmis uniquement via
              HTTPS en production) et{" "}
              <strong className="text-foreground">SameSite=Lax</strong> (protection contre les
              attaques CSRF). Il ne peut pas être désactivé sans perdre l&apos;accès à votre compte.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Cookies tiers</h2>
            <p>
              ECOVEX n&apos;utilise actuellement aucun cookie tiers, aucun cookie de tracking
              et aucun cookie publicitaire.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Gestion des cookies</h2>
            <p>
              Vous pouvez supprimer les cookies via les paramètres de votre navigateur.
              La suppression du cookie de session entraînera votre déconnexion.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Contact</h2>
            <p>
              Pour toute question, contactez-nous à{" "}
              <a href="mailto:contact@ecovex.app" className="text-primary hover:underline">
                contact@ecovex.app
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

