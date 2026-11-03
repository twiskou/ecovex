"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, Loader2, UserPlus, CheckCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { registerAction } from "@/app/actions/auth";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useLang } from "@/lib/i18n";

const registerSchema = z
  .object({
    firstName: z.string().min(2, "Prénom trop court (min 2 caractères)").max(50),
    lastName: z.string().min(2, "Nom trop court (min 2 caractères)").max(50),
    email: z.string().email("Email invalide"),
    password: z
      .string()
      .min(8, "Au moins 8 caractères")
      .regex(/[A-Z]/, "Au moins une majuscule")
      .regex(/[0-9]/, "Au moins un chiffre"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function InscriptionPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const { t } = useLang();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const passwordValue = watch("password", "");

  const passwordRules = [
    { label: t.auth.rule8chars, test: (v: string) => v.length >= 8 },
    { label: t.auth.ruleUppercase, test: (v: string) => /[A-Z]/.test(v) },
    { label: t.auth.ruleDigit, test: (v: string) => /[0-9]/.test(v) },
  ];

  async function onSubmit(data: RegisterForm) {
    setServerError(null);
    const formData = new FormData();
    formData.set("email", data.email);
    formData.set("password", data.password);
    formData.set("firstName", data.firstName);
    formData.set("lastName", data.lastName);

    const result = await registerAction(formData);

    if (result.success) {
      toast.success(t.auth.registerTitle + " OK");
      router.push(result.data.redirectTo);
    } else {
      setServerError(result.error);
    }
  }

  return (
    <Card className="w-full max-w-lg shadow-xl shadow-primary/5 border-border/80 bg-card/95 backdrop-blur-xs">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <Logo size="lg" />
        </div>
        <CardTitle className="text-xl mt-2">{t.auth.registerTitle}</CardTitle>
        <CardDescription>
          {t.auth.registerSub}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          {/* Server error */}
          {serverError && (
            <div
              role="alert"
              className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            >
              {serverError}
            </div>
          )}

          {/* Name row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label
                htmlFor="firstName"
                className="text-sm font-medium text-foreground block text-start"
              >
                {t.auth.firstName}
              </label>
              <Input
                id="firstName"
                type="text"
                autoComplete="given-name"
                placeholder={t.auth.firstName}
                aria-invalid={!!errors.firstName}
                disabled={isSubmitting}
                className="text-start"
                {...register("firstName")}
              />
              {errors.firstName && (
                <p className="text-xs text-destructive text-start" role="alert">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor="lastName"
                className="text-sm font-medium text-foreground block text-start"
              >
                {t.auth.lastName}
              </label>
              <Input
                id="lastName"
                type="text"
                autoComplete="family-name"
                placeholder={t.auth.lastName}
                aria-invalid={!!errors.lastName}
                disabled={isSubmitting}
                className="text-start"
                {...register("lastName")}
              />
              {errors.lastName && (
                <p className="text-xs text-destructive text-start" role="alert">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="text-sm font-medium text-foreground block text-start"
            >
              {t.auth.email}
            </label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder={t.auth.emailPlaceholder}
              aria-invalid={!!errors.email}
              disabled={isSubmitting}
              className="text-start"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-destructive text-start" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="text-sm font-medium text-foreground block text-start"
            >
              {t.auth.password}
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder={t.auth.passwordPlaceholder}
                aria-invalid={!!errors.password}
                disabled={isSubmitting}
                className="pe-10 text-start"
                {...register("password")}
              />
              <button
                type="button"
                className="absolute inset-y-0 end-0 flex items-center justify-center w-10 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? t.auth.hidePwd : t.auth.showPwd}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Password strength indicators */}
            {passwordValue.length > 0 && (
              <ul className="mt-2 space-y-1">
                {passwordRules.map((rule) => {
                  const ok = rule.test(passwordValue);
                  return (
                    <li
                      key={rule.label}
                      className={`flex items-center gap-1.5 text-xs ${
                        ok ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      <CheckCircle size={12} className={ok ? "text-primary" : "text-muted-foreground/40"} />
                      <span>{rule.label}</span>
                    </li>
                  );
                })}
              </ul>
            )}

            {errors.password && (
              <p className="text-xs text-destructive text-start" role="alert">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm password */}
          <div className="space-y-1.5">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-foreground block text-start"
            >
              {t.auth.confirmPassword}
            </label>
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder={t.auth.confirmPassword}
              aria-invalid={!!errors.confirmPassword}
              disabled={isSubmitting}
              className="text-start"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-destructive text-start" role="alert">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full gap-2 font-medium"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                {t.auth.registering}
              </>
            ) : (
              <>
                <UserPlus size={16} className="rtl-mirror" />
                {t.auth.registerBtn}
              </>
            )}
          </Button>
        </form>

        {/* Terms notice */}
        <p className="mt-4 text-xs text-center text-muted-foreground">
          {t.auth.termsNotice}{" "}
          <Link
            href="/conditions-utilisation"
            className="text-primary hover:underline"
          >
            {t.auth.termsLink}
          </Link>{" "}
          {t.auth.and}{" "}
          <Link
            href="/confidentialite"
            className="text-primary hover:underline"
          >
            {t.auth.privacyLink}
          </Link>
          .
        </p>

        {/* Login link */}
        <p className="mt-4 text-center text-sm text-muted-foreground">
          {t.auth.alreadyAccount}{" "}
          <Link
            href="/connexion"
            className="font-medium text-primary hover:underline"
          >
            {t.auth.signIn}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
