import { Suspense } from "react";
import AdminLoginPage from "./LoginForm";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#0b1220] text-slate-400">
          Loading…
        </div>
      }
    >
      <AdminLoginPage />
    </Suspense>
  );
}
