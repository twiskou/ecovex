"use client";

import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";
import { useLang } from "@/lib/i18n";

export function PrivacyView() {
  const { lang, t } = useLang();

  if (lang === "ar") {
    return (
      <div className="py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-eco-orange/30 text-eco-orange">قانوني</Badge>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl flex items-center justify-center gap-3">
              <Shield size={32} className="text-eco-orange" />
              سياسة الخصوصية وحماية البيانات
            </h1>
            <p className="mt-4 text-muted-foreground">آخر تحديث: أكتوبر 2026</p>
          </div>

          <div className="prose prose-sm max-w-none space-y-8 text-muted-foreground text-start">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">1. مقدمة</h2>
              <p>
                تلتزم منصة إيكوفيكس بحماية خصوصية مستخدميها وبياناتهم الشخصية بأعلى معايير الأمان. توضح هذه الوثيقة ماهية البيانات التي نجمعها، كيفية معالجتها، وحقوقك القانونية الكاملة تجاهها.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">2. البيانات المجمعة</h2>
              <p>نقوم بجمع البيانات التالية بالحد الأدنى الضروري لتقديم الخدمة:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>البريد الإلكتروني وكلمة المرور (مشفرة بأحدث خوارزميات التشفير وغير قابلة للقراءة)</li>
                <li>بيانات الملف الشخصي: الاسم الأول، اسم العائلة، رقم الهاتف، والمدينة (اختياري)</li>
                <li>صور النفايات المقدمة كإثبات أثناء التصريح بعمليات التجميع</li>
                <li>سجل العمليات، المصادقات، وحركات النقاط البيئية</li>
                <li>بيانات الجلسة الآمنة (ملفات تعريف ارتباط محمية ومعزولة)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">3. أوجه استخدام البيانات</h2>
              <p>تُستخدم بياناتك للأغراض التالية فقط:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>إدارة حسابك وتأمين تسجيل دخولك للمنصة</li>
                <li>معالجة وفحص تصاريح التجميع التي تقدمها</li>
                <li>احتساب وإيداع النقاط البيئية في رصيدك بعد المصادقة</li>
                <li>إرسال إشعارات بحالة طلباتك وقرارات المحققين</li>
                <li>تحسين جودة الخدمة ودقة التحليل الذكي للنفايات</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">4. مدة حفظ البيانات</h2>
              <p>
                نحتفظ ببياناتك طوال فترة نشاط حسابك. في حال طلب حذف الحساب، يتم مسح بياناتك الشخصية بالكامل خلال 30 يوماً، باستثناء السجلات اللازمة للامتثال الرقابي والقانوني.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">5. حقوقك كمستخدم</h2>
              <p>يضمن لك القانون الحقوق التالية:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>حق الاطلاع والوصول إلى بياناتك الشخصية</li>
                <li>حق تصحيح أو تعديل أي بيانات غير دقيقة</li>
                <li>حق طلب محو البيانات (الحق في النسيان)</li>
                <li>حق تصدير ونقل بياناتك</li>
                <li>حق الاعتراض على معالجة البيانات</li>
              </ul>
              <p className="mt-3">
                لممارسة أي من هذه الحقوق، تواصل معنا مباشرة عبر{" "}
                <a href="mailto:contact@ecovex.app" className="text-primary hover:underline">
                  contact@ecovex.app
                </a>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-eco-orange mb-3">6. الأمان والحماية</h2>
              <p>
                نطبق بروتوكولات حماية متقدمة تشمل التشفير الكامل، وملفات تعريف الارتباط المحمية ضد الاختراق، وتقييد الصلاحيات حسب الدور، وسجلات تتبع أمنية غير قابلة للتلاعب.
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
          <Badge variant="outline" className="mb-4 border-eco-orange/30 text-eco-orange">Légal</Badge>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl flex items-center justify-center gap-3">
            <Shield size={32} className="text-eco-orange" />
            Politique de confidentialité
          </h1>
          <p className="mt-4 text-muted-foreground">Dernière mise à jour : octobre 2026</p>
        </div>

        <div className="prose prose-sm max-w-none space-y-8 text-muted-foreground text-start">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Introduction</h2>
            <p>
              ECOVEX s&apos;engage à protéger la vie privée de ses utilisateurs. Cette politique de
              confidentialité explique quelles données nous collectons, comment nous les utilisons
              et quels sont vos droits.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Données collectées</h2>
            <p>Nous collectons les données suivantes :</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Adresse email et mot de passe (haché, jamais en clair)</li>
              <li>Informations de profil : prénom, nom, téléphone, ville (optionnels)</li>
              <li>Photos des déchets soumises lors des déclarations de collecte</li>
              <li>Historique des opérations et transactions de points</li>
              <li>Données de session (cookies sécurisés)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Utilisation des données</h2>
            <p>Vos données sont utilisées pour :</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Gérer votre compte et authentifier votre accès</li>
              <li>Traiter vos déclarations de collecte</li>
              <li>Calculer et attribuer vos points écologiques</li>
              <li>Vous envoyer des notifications liées à vos opérations</li>
              <li>Améliorer la plateforme et ses fonctionnalités</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Conservation des données</h2>
            <p>
              Vos données sont conservées pendant la durée d&apos;utilisation de votre compte.
              En cas de suppression de compte, vos données personnelles sont effacées dans un
              délai de 30 jours, à l&apos;exception des données nécessaires à la conformité légale.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Vos droits</h2>
            <p>Vous disposez des droits suivants :</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Droit d&apos;accès à vos données personnelles</li>
              <li>Droit de rectification de vos données</li>
              <li>Droit à l&apos;effacement (droit à l&apos;oubli)</li>
              <li>Droit à la portabilité de vos données</li>
              <li>Droit d&apos;opposition au traitement</li>
            </ul>
            <p className="mt-3">
              Pour exercer ces droits, contactez-nous à{" "}
              <a href="mailto:contact@ecovex.app" className="text-primary hover:underline">
                contact@ecovex.app
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-eco-orange mb-3">6. Sécurité</h2>
            <p>
              Nous mettons en œuvre des mesures de sécurité appropriées : hachage des mots de
              passe, cookies HttpOnly et Secure, contrôle d&apos;accès par rôle, journalisation
              des actions sensibles et validation stricte des données côté serveur.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Contact</h2>
            <p>
              Pour toute question relative à cette politique, contactez-nous à{" "}
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

