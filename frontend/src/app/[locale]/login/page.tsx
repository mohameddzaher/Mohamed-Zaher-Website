"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Lock, Mail, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/lib/auth";

const Schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
type Values = z.infer<typeof Schema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(Schema) });

  async function onSubmit(values: Values) {
    setSubmitting(true);
    try {
      const user = await login(values.email, values.password);
      toast.success(`Welcome back, ${user.name.split(" ")[0]}`);
      router.push(user.role === "admin" ? "/admin" : "/client");
    } catch (e) {
      const msg = (e as { message?: string })?.message ?? "Login failed";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md glass-strong rounded-3xl p-8 md:p-10">
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--color-brand-400)] to-[var(--color-violet-500)] mb-4">
            <Lock className="h-5 w-5 text-[#050507]" />
          </div>
          <h1 className="font-display text-3xl font-bold">Sign in</h1>
          <p className="text-sm text-[var(--fg-muted)] mt-2">
            Admins → /admin · Clients → /client
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit) as (e: FormEvent) => void} className="space-y-4">
          <Input
            type="email"
            label="Email"
            placeholder="you@example.com"
            {...register("email")}
            error={errors.email?.message}
          />
          <Input
            type="password"
            label="Password"
            placeholder="••••••••"
            {...register("password")}
            error={errors.password?.message}
          />
          <Button
            type="submit"
            fullWidth
            size="lg"
            loading={submitting}
            rightIcon={<ArrowRight className="h-4 w-4" />}
          >
            Continue
          </Button>
        </form>

        <p className="text-xs text-center text-[var(--fg-muted)] mt-6 font-mono">
          <Mail className="inline h-3 w-3 mr-1" /> Forgot? contact mohamedzaher.dev@gmail.com
        </p>
      </div>
    </div>
  );
}
