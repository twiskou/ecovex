"use client";

import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";
import { useLang } from "@/lib/i18n";

export function TermsView() {
  const { lang, t } = useLang();

  if (lang === "ar") {
    return (
      <div className="py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">قانوني</Badge>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl flex items-center justify-center gap-3">
              <FileText size={32} className="text-primary" />
              شروط الاستخدام والأحكام العامة
            </h1>
            <p className="mt-4 text-muted-foreground">آخر تحديث: أكتوبر 2026</p>
          </div>

          <div className="prose prose-sm max-w-none space-y-8 text-muted-foreground text-start">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">1. الموافقة على الشروط</h2>
              <p>
                باستخدامك لمنصة إيكوفيكس، فإنك تقر وتوافق صراحة على الالتزام بشروط الاستخدام هذه. إذا كنت لا توافق على أي بند منها، فيجب عليك الامتناع عن استخدام المنصة فوراً.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">2. طبيعة الخدمة</h2>
              <p>
                إيكوفيكس منصة رقمية لإدارة وتثمين النفايات تتيح للمواطنين التصريح عن عمليات تسليم النفايات القابلة لإعادة التدوير، وكسب نقاط بيئية تحفيزية بعد المصادقة عليها، والاطلاع على مواقع نقاط التجميع.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">3. حساب المستخدم والمسؤولية</h2>
              <ul className="list-disc list-inside space-y-1">
                <li>يجب تقديم معلومات شخصية دقيقة وصحيحة عند التسجيل.</li>
                <li>أنت المسؤول الوحيد عن الحفاظ على سرية كلمة المرور وبيانات دخولك.</li>
                <li>يُسمح بإنشاء حساب واحد فقط لكل شخص طبيعي.</li>
                <li>أي تلاعب أو احتيال يؤدي إلى تعليق الحساب نهائياً وإلغاء الرصيد.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">4. تصاريح التجميع والأدلة</h2>
              <ul className="list-disc list-inside space-y-1">
                <li>يجب أن تعكس التصاريح عمليات تسليم نفايات حقيقية وفعلية.</li>
                <li>أي إقرار كاذب أو صورة غير مطابقة يؤدي إلى رفض العملية وتجميد الحساب.</li>
                <li>لا يتم منح النقاط إلا بعد فحص الأدلة والمصادقة الرسمية من قبل محقق معتمد.</li>
                <li>النقاط البيئية مكافآت تحفيزية ولا تشكل عملة نقدية مضمونة القيمة القانونية.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">5. نظام النقاط والمكافآت</h2>
              <p>
                تُمنح النقاط البيئية كأداة تحفيزية لتشجيع السلوكيات الصديقة للبيئة، وتحتفظ إدارة المنصة بحق تعديل معايير احتسابها وقواعد توزيعها عند الحاجة.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">6. حدود المسؤولية</h2>
              <p>
                يتم تقديم المنصة بصيغة نموذج أولي (MVP) كما هي، دون ضمانات بتشغيل متواصل خالٍ من الانقطاعات المؤقتة المخصصة للصيانة والتحديث.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">7. التواصل والاستفسار</h2>
              <p>
                لأي أسئلة أو توضيحات حول الشروط، يرجى التواصل معنا عبر{" "}
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
            <FileText size={32} className="text-primary" />
            Conditions d&apos;utilisation
          </h1>
          <p className="mt-4 text-muted-foreground">Dernière mise à jour : octobre 2026</p>
        </div>

        <div className="prose prose-sm max-w-none space-y-8 text-muted-foreground text-start">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Acceptation des conditions</h2>
            <p>
              En utilisant ECOVEX, vous acceptez les présentes conditions d&apos;utilisation.
              Si vous n&apos;acceptez pas ces conditions, vous ne devez pas utiliser la plateforme.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Description du service</h2>
            <p>
              ECOVEX est une plateforme de gestion et de valorisation des déchets permettant
              aux citoyens de déclarer des opérations de collecte, d&apos;obtenir des points
              écologiques après validation, et de consulter les points de collecte disponibles.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Compte utilisateur</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Vous devez fournir des informations exactes lors de l&apos;inscription.</li>
              <li>Vous êtes responsable de la confidentialité de votre mot de passe.</li>
              <li>Un seul compte par personne est autorisé.</li>
              <li>Tout abus entraînera la suspension ou suppression du compte.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Déclarations de collecte</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Les déclarations doivent correspondre à des opérations réelles.</li>
              <li>Toute fausse déclaration entraîne l&apos;annulation des points et la suspension du compte.</li>
              <li>Les points ne sont attribués qu&apos;après vérification et approbation par un vérificateur.</li>
              <li>Les points n&apos;ont pas de valeur monétaire garantie.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Système de points</h2>
            <p>
              Les points écologiques sont attribués à titre indicatif pour récompenser les
              comportements écologiques. Ils ne constituent pas une monnaie et n&apos;ont pas
              de valeur légale. ECOVEX se réserve le droit de modifier les règles d&apos;attribution
              des points.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Contenu soumis</h2>
            <p>
              En soumettant des photos et informations, vous confirmez que ces contenus sont
              licites et ne portent pas atteinte aux droits de tiers. Vous accordez à ECOVEX
              une licence d&apos;utilisation de ces contenus dans le cadre du service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Limitation de responsabilité</h2>
            <p>
              ECOVEX est fourni &quot;tel quel&quot; en phase MVP. Nous ne garantissons pas la
              disponibilité continue du service et ne saurions être tenus responsables de
              pertes liées à son utilisation.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">8. Contact</h2>
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

