"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { loginAction } from "@/app/actions/auth";
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

const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function ConnexionPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const { t } = useLang();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginForm) {
    setServerError(null);
    const formData = new FormData();
    formData.set("email", data.email);
    formData.set("password", data.password);

    const result = await loginAction(formData);

    if (result.success) {
      toast.success(t.auth.loginTitle + " OK");
      router.push(result.data.redirectTo);
    } else {
      setServerError(result.error);
    }
  }

  return (
    <Card className="w-full max-w-md shadow-xl shadow-primary/5 border-border/80 bg-card/95 backdrop-blur-xs">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <Logo size="lg" />
        </div>
        <CardTitle className="text-xl mt-2 font-bold">
          {t.auth.loginTitle} <span className="text-eco-orange">ECOVEX</span>
        </CardTitle>
        <CardDescription>
          {t.auth.loginSub}
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
                autoComplete="current-password"
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
                aria-label={
                  showPassword
                    ? t.auth.hidePwd
                    : t.auth.showPwd
                }
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-destructive text-start" role="alert">
                {errors.password.message}
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
                {t.auth.loggingIn}
              </>
            ) : (
              <>
                <LogIn size={16} className="rtl-mirror" />
                {t.auth.loginBtn}
              </>
            )}
          </Button>
        </form>

        {/* Register link */}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          {t.auth.noAccount}{" "}
          <Link
            href="/inscription"
            className="font-semibold text-eco-orange hover:underline"
          >
            {t.auth.createAccount}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
