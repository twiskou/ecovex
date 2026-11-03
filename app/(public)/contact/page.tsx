"use client";

import { useState } from "react";
import { Mail, MapPin, MessageSquare, Send, CheckCircle, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLang } from "@/lib/i18n";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useLang();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitted(true);
    setLoading(false);
  }

  const contactItems = [
    {
      icon: Mail,
      title: t.contact.emailSupport,
      description: t.contact.emailSupportVal,
    },
    {
      icon: MessageSquare,
      title: t.contact.supportHours,
      description: t.contact.supportHoursVal,
    },
    {
      icon: MapPin,
      title: t.contact.address,
      description: t.contact.addressVal,
    },
  ];

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            {t.contact.badge}
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {t.contact.title}
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.contact.sub}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Contact info */}
          <div className="space-y-6">
            {contactItems.map((item) => (
              <div key={item.title} className="flex gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 shrink-0">
                  <item.icon size={18} className="text-primary" />
                </div>
                <div className="text-start">
                  <p className="font-medium text-foreground text-sm">
                    {item.title}
                  </p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Contact form */}
          <div className="lg:col-span-2">
            {submitted ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16 text-center gap-4">
                  <CheckCircle size={48} className="text-primary" />
                  <h2 className="text-xl font-semibold text-foreground">
                    {t.contact.sentTitle}
                  </h2>
                  <p className="text-muted-foreground">
                    {t.contact.sentDesc}
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setSubmitted(false)}
                  >
                    {t.contact.sendAnother}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="text-start">{t.contact.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <label
                          htmlFor="name"
                          className="text-sm font-medium text-foreground block text-start"
                        >
                          {t.contact.nameLabel}
                        </label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          placeholder={t.contact.nameLabel}
                          required
                          disabled={loading}
                          className="text-start"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label
                          htmlFor="email"
                          className="text-sm font-medium text-foreground block text-start"
                        >
                          {t.contact.emailLabel}
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="votre@email.com"
                          required
                          disabled={loading}
                          className="text-start"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label
                        htmlFor="subject"
                        className="text-sm font-medium text-foreground block text-start"
                      >
                        {t.contact.subjectLabel}
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        placeholder={t.contact.subjectLabel}
                        required
                        disabled={loading}
                        className="text-start"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label
                        htmlFor="message"
                        className="text-sm font-medium text-foreground block text-start"
                      >
                        {t.contact.messageLabel}
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder={t.contact.messageLabel}
                        rows={6}
                        required
                        disabled={loading}
                        className="resize-none text-start"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full sm:w-auto gap-2"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          {t.contact.sendingBtn}
                        </>
                      ) : (
                        <>
                          <Send size={16} className="rtl:rotate-180" />
                          {t.contact.sendBtn}
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
