// app/(auth)/login/actions.ts
"use server";

import { supabase } from "@/lib/supabaseClient";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const identifier = formData.get("identifier") as string; // Email or Phone number
  const password = formData.get("password") as string;

  if (!identifier || !password) {
    return { error: "Please fill in all security fields." };
  }

  let targetEmail = identifier.trim().toLowerCase();

  // If the identifier doesn't look like an email, treat it as a phone number lookup
  if (!targetEmail.includes("@")) {
    const { data: userProfile, error: dbError } = await supabase
      .from("users")
      .select("email")
      .eq("phone_number", identifier.trim())
      .single();

    if (dbError || !userProfile?.email) {
      return { error: "No account found matching this phone number." };
    }

    targetEmail = userProfile.email;
  }

  // Execute standard authentication using the resolved email
  const { error } = await supabase.auth.signInWithPassword({
    email: targetEmail,
    password: password,
  });

  if (error) {
    return { error: "Invalid credentials. Please verify your password." };
  }

  redirect("/dashboard");
}