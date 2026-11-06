"use client";

import { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  RotateCcw,
  Minimize2,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useLang } from "@/lib/i18n";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function EcovexChatbot() {
  const { lang } = useLang();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial welcome message based on language
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content:
            lang === "ar"
              ? "مرحباً بك في منصة **إيكوفيكس**! 🌱\nأنا مساعدك الذكي للإجابة عن كل استفساراتك حول فرز النفايات، كسب النقاط، ومراكز التجميع الـ 27 في الجزائر. كيف يمكنني مساعدتك؟"
              : "Bonjour et bienvenue sur **ECOVEX** ! 🌱\nJe suis votre assistant écologique propulsé par l'IA. Comment puis-je vous aider aujourd'hui concernant le tri, les points de collecte ou vos récompenses ?",
          timestamp: new Date(),
        },
      ]);
    }
  }, [lang, messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-5).map((m) => ({
            role: m.role,
            content: m.content,
          })),
          lang,
        }),
      });

      const data = await response.json();
      const botReply =
        data.reply ||
        (lang === "ar"
          ? "شكراً لتواصلك مع إيكوفيكس. يرجى مراجعة صفحة نقاط التجميع للمزيد من المعلومات."
          : "Merci pour votre message. N'hésitez pas à consulter nos points de collecte.");

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: botReply,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            lang === "ar"
              ? "عذراً، حدث خطأ مؤقت في الاتصال. يمكنك إعادة المحاولة أو تصفح أقسام المنصة."
              : "Désolé, une petite erreur de connexion est survenue. Veuillez réessayer.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const resetChat = () => {
    setMessages([
      {
        id: "welcome-reset",
        role: "assistant",
        content:
          lang === "ar"
            ? "تم بدء محادثة جديدة. كيف يمكنني مساعدتك اليوم في منصة إيكوفيكس؟"
            : "Nouvelle conversation démarrée ! En quoi puis-je vous renseigner sur ECOVEX ?",
        timestamp: new Date(),
      },
    ]);
  };

  const quickSuggestions =
    lang === "ar"
      ? [
          "كيف أكسب النقاط؟",
          "أين توجد مراكز التجميع؟",
          "ما هي النفايات المقبولة؟",
          "كيف يعمل التحليل بالذكاء الاصطناعي؟",
        ]
      : [
          "Comment gagner des points ?",
          "Où sont les points de collecte ?",
          "Quels déchets sont acceptés ?",
          "Comment fonctionne l'IA ?",
        ];

  return (
    <div className="fixed bottom-6 end-6 z-50 flex flex-col items-end">
      {/* ── Chat Window ── */}
      {isOpen && (
        <div
          dir={lang === "ar" ? "rtl" : "ltr"}
          className="mb-3 w-[92vw] sm:w-[400px] h-[540px] max-h-[80vh] rounded-3xl bg-background/95 backdrop-blur-xl border border-border shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300"
        >
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-primary via-[#535f37] to-[#263326] text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                <Bot size={22} />
                <span className="absolute -bottom-0.5 -end-0.5 w-3 h-3 bg-eco-orange border-2 border-background rounded-full" />
              </div>
              <div className="text-start">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm tracking-tight leading-tight">
                    {lang === "ar" ? "المساعد الذكي إيكوفيكس" : "Assistant ECOVEX"}
                  </h3>
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-eco-orange/50 text-white bg-eco-orange/25">
                    <Sparkles size={9} className="me-1 inline text-eco-orange" />
                    Gemini AI
                  </Badge>
                </div>
                <p className="text-[11px] text-[#F2EBDD]/90 flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-eco-orange animate-pulse" />
                  {lang === "ar" ? "متصل الآن لخدمتك" : "En ligne • Prêt à vous aider"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={resetChat}
                title={lang === "ar" ? "إعادة ضبط المحادثة" : "Réinitialiser la discussion"}
                className="p-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 transition-colors"
              >
                <RotateCcw size={16} />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title={lang === "ar" ? "إغلاق" : "Fermer"}
                className="p-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs text-start">
            {messages.map((msg) => {
              const isBot = msg.role === "assistant";
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${isBot ? "justify-start" : "justify-end"}`}
                >
                  {isBot && (
                    <div className="w-7 h-7 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot size={15} />
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-wrap break-words ${
                      isBot
                        ? "bg-muted/60 text-foreground border border-border/70 rounded-tl-sm shadow-xs"
                        : "bg-emerald-600 text-white rounded-tr-sm shadow-sm"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <Bot size={15} />
                </div>
                <div className="rounded-2xl px-4 py-3 bg-muted/60 border border-border/70 rounded-tl-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
                  <span
                    className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Chips */}
          {messages.length <= 2 && (
            <div className="px-3 pb-2 pt-1 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              {quickSuggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(suggestion)}
                  disabled={loading}
                  className="px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40 border border-emerald-200 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors shadow-2xs"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {/* Input Bar */}
          <div className="p-3 bg-muted/30 border-t border-border/80">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  lang === "ar"
                    ? "اكتب سؤالك هنا عن الفرز وإيكوفيكس..."
                    : "Posez votre question sur le tri..."
                }
                disabled={loading}
                className="text-xs h-10 rounded-xl bg-background border-border"
              />
              <Button
                type="submit"
                disabled={loading || !input.trim()}
                size="sm"
                className="h-10 w-10 p-0 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shrink-0 shadow-sm"
              >
                <Send size={16} className={lang === "ar" ? "rotate-180" : ""} />
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* ── Floating Launcher Trigger ── */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={lang === "ar" ? "المساعد الذكي" : "Assistant virtuel"}
        className="group relative flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary via-[#535f37] to-[#263326] text-white shadow-xl hover:shadow-primary/30 hover:scale-105 active:scale-95 transition-all duration-300 border border-primary/30"
      >
        {isOpen ? (
          <ChevronDown size={24} className="transition-transform group-hover:translate-y-0.5" />
        ) : (
          <>
            <MessageSquare size={24} />
            <span className="absolute -top-1 -end-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-eco-orange opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-eco-orange border-2 border-background" />
            </span>
          </>
        )}
      </button>
    </div>
  );
}

