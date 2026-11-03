import { NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

const ECOVEX_SYSTEM_PROMPT = `Tu es l'assistant virtuel intelligent officiel d'ECOVEX (المساعد الذكي لمنصة إيكوفيكس).
ECOVEX est la plateforme pionnière de tri sélectif, de recyclage et de valorisation des déchets en Algérie.

Informations clés sur ECOVEX à maîtriser :
1. Mission : Encourager l'éco-citoyenneté en Algérie. Les citoyens trient leurs déchets, les déposent dans des points de collecte homologués et gagnent des points écologiques valorisables.
2. Inscription : 100% gratuite et rapide sur la plateforme (nom, prénom, email, mot de passe).
3. Points de collecte : 27 centres et stations écologiques modernes répartis sur toute l'Algérie :
   - Nord et Littoral : Alger (Didouche Mourad, Bab Ezzouar, Sidi Abdellah), Oran (Akid Lotfi, Es-Sénia), Constantine (Ali Mendjeli, Sidi Mabrouk), Annaba (Cours de la Révolution), Sétif (8 Mai 1945), Tlemcen (Imama), Blida (Bab Essebt), Béjaïa (Port), Batna (Tazoult).
   - Régions sahariennes et Grand Sud : Biskra (Zibans), Ghardaïa (Vallée du M'zab), Ouargla (Sidi Khouiled), Béchar (Saoura), Adrar (Pôle Vert du Touat), Tamanrasset (Hoggar), El Oued (Éco-Dunes), Timimoun (Oasis Rouge), Djanet (Tassili n'Ajjer), Illizi, Tindouf.
4. Filières et barème de points indicatif :
   - Plastique : 10 points / kg
   - Papier et Carton : 8 points / kg
   - Verre : 12 points / kg
   - Métal (canettes, conserves) : 15 points / kg
   - Électronique (DEEE) : 25 points / kg
   - Textile : 10 points / kg
   - Organique : 6 points / kg
5. Fonctionnalité d'Analyse IA : Dans l'espace citoyen, un outil de vision par IA (propulsé par Google Gemini) permet de scanner ou photographier un déchet pour détecter automatiquement sa filière et obtenir des conseils de tri.
6. Validation humaine : Chaque dépôt est contrôlé par un vérificateur avant crédit définitif des points pour garantir la transparence.

Règles de communication :
- Sois très chaleureux, concis, clair, poli et encourageant.
- Réponds toujours dans la langue utilisée par l'utilisateur (français ou arabe fluide et soigné).
- Utilise des listes à puces pour que ce soit facile et agréable à lire.
- Si la question est hors sujet, réponds brièvement et recentre aimablement sur l'environnement, le tri et ECOVEX.`;

/**
 * Intelligent fallback responses when Gemini API is unreachable (offline or sandbox)
 */
function getFallbackResponse(query: string, lang: "fr" | "ar"): string {
  const q = query.toLowerCase();

  if (lang === "ar") {
    if (q.includes("نقط") || q.includes("كسب") || q.includes("نقاط") || q.includes("كيف")) {
      return `مرحباً بك! كسب النقاط في **إيكوفيكس** سهل جداً في 3 خطوات:
1. **قم بفرز نفاياتك** في المنزل (بلاستيك، ورق، زجاج، معادن، إلكترونيات).
2. **أودع النفايات** في أقرب مركز تجميع إليك (لدينا 27 مركزاً عبر مختلف ولايات الجزائر).
3. **احصل على نقاطك فوراً** بعد تأكيد المحقق في رصيدك الشخصي!

🔹 **مثال على النقاط:**
- البلاستيك: 10 نقاط / كغ
- الزجاج: 12 نقطة / كغ
- المعادن: 15 نقطة / كغ
- الأجهزة الإلكترونية: 25 نقطة / كغ`;
    }

    if (q.includes("مركز") || q.includes("ولاية") || q.includes("صحراء") || q.includes("أين") || q.includes("تجميع")) {
      return `تغطي منصة **إيكوفيكس** شبكة وطنية واسعة تضم **27 نقطة ومركز تجميع** في الجزائر:
- **الشمال:** الجزائر العاصمة، وهران، قسنطينة، عنابة، سطيف، تلمسان، البليدة، بجاية، باتنة.
- **المناطق الصحراوية والجنوب الكبير:** غرداية، ورقلة، بشار، أدرار، تمنراست، الوادي، تيميمون، جانت، إيليزي، تندوف، وبسكرة.

يمكنك زيارة صفحة **«نقاط التجميع»** لاستعراض الخريطة التفاعلية الحقيقية وتحديد أقرب نقطة لك!`;
    }

    if (q.includes("تسجيل") || q.includes("حساب") || q.includes("بدء")) {
      return `التسجيل في منصة **إيكوفيكس** مجاني 100% ومتاح لجميع المواطنين!
انقر على زر **«ابدأ الآن»** في أعلى الصفحة وأدخل اسمك وبريدك الإلكتروني لتنشيط حسابك والبدء في ربح النقاط فوراً.`;
    }

    return `أهلاً بك في منصة **إيكوفيكس (ECOVEX)**! 🌱
أنا مساعدك الذكي لمرافقتك في فرز وتدوير النفايات في الجزائر.
يمكنني مساعدتك في:
- معرفة كيفية كسب واستبدال النقاط البيئية.
- العثور على أقرب نقطة تجميع في ولايتك (27 مركزاً عبر الوطن).
- شرح فئات النفايات المقبولة وطريقة التحليل بالذكاء الاصطناعي.

كيف يمكنني مساعدتك اليوم؟`;
  }

  // French Fallback
  if (q.includes("point") || q.includes("gagner") || q.includes("comment") || q.includes("bareme")) {
    return `Bienvenue chez **ECOVEX** ! Pour gagner des points écologiques, rien de plus simple :
1. **Triez vos déchets** chez vous (bouteilles, cartons, canettes, verre, etc.).
2. **Déposez-les** dans l'un de nos 27 points de collecte en Algérie.
3. **Recevez vos points** sur votre compte dès validation par notre agent !

🌿 **Barème des points :**
- **Métal :** 15 pts / kg
- **Verre :** 12 pts / kg
- **Plastique :** 10 pts / kg
- **Électronique :** 25 pts / kg
- **Papier / Carton :** 8 pts / kg`;
  }

  if (q.includes("collecte") || q.includes("ou") || q.includes("centre") || q.includes("wilaya") || q.includes("sahara")) {
    return `ECOVEX dispose de **27 points de collecte écologiques** opérationnels à travers l'Algérie :
- **Régions Nord :** Alger (Centre, Bab Ezzouar, Sidi Abdellah), Oran, Constantine, Annaba, Sétif, Tlemcen, Blida, Béjaïa, Batna.
- **Régions Sahariennes & Sud :** Ghardaïa, Ouargla, Béchar, Adrar, Tamanrasset, El Oued, Timimoun, Djanet, Illizi, Tindouf et Biskra.

Consultez notre page **« Points de collecte »** pour explorer la carte interactive et trouver la station la plus proche de chez vous !`;
  }

  if (q.includes("ia") || q.includes("scan") || q.includes("analyse") || q.includes("photo")) {
    return `Dans votre **Espace Citoyen**, vous avez accès au module **Scanner par IA** propulsé par Google Gemini Vision !
Prenez simplement une photo de votre déchet : l'intelligence artificielle identifie la matière, vous donne des conseils de tri et pré-remplit votre déclaration de collecte.`;
  }

  if (q.includes("inscri") || q.includes("compte") || q.includes("gratuit")) {
    return `L'inscription à **ECOVEX** est totalement gratuite et prend moins d'une minute !
Cliquez sur le bouton **« Commencer »** en haut à droite pour créer votre compte citoyen et commencer à valoriser vos gestes écologiques dès aujourd'hui.`;
  }

  return `Bonjour et bienvenue sur **ECOVEX** ! 🌱
Je suis votre assistant virtuel dédié à l'écologie et au recyclage citoyen en Algérie.
Je peux vous renseigner sur :
- Le fonctionnement des points écologiques et les récompenses.
- L'emplacement des 27 centres de collecte à travers le pays.
- L'analyse automatique de vos déchets par intelligence artificielle.

Que souhaitez-vous savoir ?`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, history = [], lang = "fr" } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message requis." },
        { status: 400 }
      );
    }

    const conversationContents: any[] = [];

    // Add previous history
    for (const msg of history.slice(-6)) {
      conversationContents.push({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      });
    }

    // Add current user message
    conversationContents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const payload = {
      system_instruction: {
        parts: [{ text: ECOVEX_SYSTEM_PROMPT }],
      },
      contents: conversationContents,
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 600,
      },
    };

    // Try Gemini API
    const models = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-1.5-pro"];

    for (const model of models) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(12000),
        });

        if (res.ok) {
          const data = await res.json();
          const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) {
            return NextResponse.json({
              reply,
              source: "gemini-ai",
              model,
            });
          }
        }
      } catch (err: any) {
        console.warn(`Gemini chat attempt failed for ${model}:`, err?.message || err);
      }
    }

    // Fallback to intelligent local knowledge engine
    const fallbackReply = getFallbackResponse(message, lang);
    return NextResponse.json({
      reply: fallbackReply,
      source: "ecovex-knowledge-base",
    });
  } catch (err: any) {
    console.error("Chatbot API error:", err);
    return NextResponse.json(
      {
        reply:
          "Une erreur temporaire est survenue. N'hésitez pas à consulter notre FAQ ou nos points de collecte.",
        source: "fallback",
      },
      { status: 200 }
    );
  }
}

