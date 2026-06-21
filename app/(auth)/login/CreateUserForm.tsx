// app/(auth)/login/CreateUserForm.tsx
"use client";

import { useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";

export function CreateUserForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const phoneNumber = formData.get("phoneNumber") as string;
    const role = formData.get("role") as string;
    const password = formData.get("password") as string;

    try {
      // Step 1: Register user inside core Supabase Authentication system
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password: password,
      });

      if (authError) {
        setError(`Authentication Error: ${authError.message}`);
        setLoading(false);
        return;
      }

      const authUserId = authData.user?.id;

      if (!authUserId) {
        setError("Failed to generate a valid system Auth ID.");
        setLoading(false);
        return;
      }

      // Step 2: Insert information into your custom public.users table (WITHOUT password)
      const { error: dbError } = await supabase
        .from("users")
        .insert([
          {
            id: authUserId, // Tie it directly to the Supabase Auth UUID
            full_name: fullName.trim(),
            email: email.trim().toLowerCase(),
            phone_number: phoneNumber.trim() || null,
            role: role,
            is_active: true,
            // Password is completely omitted here since Supabase Auth handles it!
          }
        ]);

      if (dbError) {
        setError(`Database Table Insert Error: ${dbError.message}`);
      } else {
        setSuccess(true);
        formRef.current?.reset();
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during user registration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm max-w-lg w-full text-slate-900 mx-auto">
      <div className="mb-5">
        <h3 className="text-lg font-bold">Register System User</h3>
        <p className="text-xs text-slate-500">Creates an Auth identity and links standard metadata profile rows.</p>
      </div>

      {error && (
        <div className="mb-4 p-3 text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg">
          🎉 Account successfully registered to Supabase Auth and public profile synchronized!
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Full Name *</label>
          <input name="fullName" type="text" required placeholder="John Banda" className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-sm focus:outline-none focus:border-slate-400" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Email Address *</label>
            <input name="email" type="email" required placeholder="jbanda@domain.com" className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-sm focus:outline-none focus:border-slate-400" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Phone Number</label>
            <input name="phoneNumber" type="text" placeholder="+265888000000" className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-sm focus:outline-none focus:border-slate-400" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">System Role *</label>
          <select name="role" required className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-sm focus:outline-none focus:border-slate-400">
            <option value="ADMIN">ADMIN</option>
            <option value="SUPERVISOR">SUPERVISOR</option>
            <option value="FINANCE">FINANCE</option>
            <option value="AUDITOR">AUDITOR</option>
            <option value="SUPER_ADMIN">SUPER_ADMIN</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Account Password *</label>
          <input name="password" type="password" required placeholder="••••••••" className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-sm focus:outline-none focus:border-slate-400" />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-slate-950 text-white font-medium text-sm py-2.5 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 mt-2"
        >
          {loading ? "Registering Credentials..." : "Register User"}
        </button>
      </form>
    </div>
  );
}