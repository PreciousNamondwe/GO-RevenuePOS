// app/(auth)/login/LoginForm.tsx
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const identifier = formData.get("identifier") as string;
    const password = formData.get("password") as string;

    if (!identifier || !password) {
      setError("Please fill in all security fields.");
      setLoading(false);
      return;
    }

    let targetEmail = identifier.trim().toLowerCase();

    try {
      // 1. If it's a phone number, look up the linked email address from public.users table
      if (!targetEmail.includes("@")) {
        const { data: userProfile, error: dbError } = await supabase
          .from("users")
          .select("email")
          .eq("phone_number", identifier.trim())
          .maybeSingle(); // Prevents crashing if 0 items return

        if (dbError || !userProfile?.email) {
          setError("No account found matching this phone number.");
          setLoading(false);
          return;
        }

        targetEmail = userProfile.email;
      }

      // 2. Log in through standard Supabase Authentication
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: targetEmail,
        password: password,
      });

      if (authError) {
        setError("Invalid credentials. Please verify your password.");
        setLoading(false);
        return;
      }

      // 3. Handshake complete, reroute directly to your dashboard landing layout
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError("A connection error occurred during authentication.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm w-full mx-auto md:mx-0">
      {error && (
        <div className="mb-4 p-3 text-xs font-semibold text-rose-200 bg-rose-500/20 border border-rose-500/30 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="identifier" className="block text-xs font-medium text-slate-300 mb-1.5">
            Email or Phone Number
          </label>
          <input
            id="identifier"
            name="identifier"
            type="text"
            required
            placeholder="e.g., admin@domain.com or +265888000000"
            className="w-full px-4 py-2.5 rounded-md bg-white text-slate-900 placeholder-slate-400 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#5684ff] transition-all"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-xs font-medium text-slate-300 mb-1.5">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            placeholder="Enter your password"
            className="w-full px-4 py-2.5 rounded-md bg-white text-slate-900 placeholder-slate-400 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#5684ff] transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#5684ff] hover:bg-[#4673ec] text-white font-bold text-xs uppercase tracking-wider py-3 rounded-md transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex justify-center items-center mt-2"
        >
          {loading ? "Authenticating..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}