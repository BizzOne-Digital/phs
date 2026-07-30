"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Zap, Lock, Mail, Loader2 } from "lucide-react";
import { toast, Toaster } from "sonner";
import { FieldLabel, TextInput } from "@/components/admin/AdminForm";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (res?.error) {
        toast.error(res.error === "CredentialsSignin" ? "Invalid email or password" : res.error);
        return;
      }
      toast.success("Welcome back");
      const callback = searchParams.get("callbackUrl") || "/admin";
      router.replace(callback.startsWith("/admin") ? callback : "/admin");
      router.refresh();
    } catch {
      toast.error("Unable to sign in");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#0b1220] px-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,_rgba(34,211,238,0.18),_transparent_45%),radial-gradient(ellipse_at_80%_80%,_rgba(59,130,246,0.15),_transparent_40%)]" />
      <div className="pointer-events-none absolute inset-0 circuit-pattern opacity-40" />
      <Toaster theme="dark" position="top-center" richColors />

      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-[0_0_40px_rgba(34,211,238,0.4)]">
            <Zap className="h-7 w-7 text-slate-950" />
          </div>
          <h1 className="font-display text-3xl font-bold text-white">VNEC Admin</h1>
          <p className="mt-2 text-sm text-slate-400">Sign in to manage your service portal</p>
        </div>

        <form
          onSubmit={onSubmit}
          className="glass-strong electric-border rounded-3xl p-6 shadow-2xl md:p-8"
        >
          <div className="space-y-4">
            <div>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <TextInput
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  placeholder="admin@vnec.ca"
                />
              </div>
            </div>
            <div>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <TextInput
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary mt-6 w-full disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
