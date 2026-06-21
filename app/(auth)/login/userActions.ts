// app/(auth)/login/userActions.ts
"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const privilegedSupabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export async function createSystemUser(formData: FormData) {
  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const phoneNumber = formData.get("phoneNumber") as string;
  const role = formData.get("role") as string;
  const password = formData.get("password") as string;

  if (!fullName || !email || !role || !password) {
    return { error: "Please fill in all required operational profile fields." };
  }

  // Step 1: Provision the authenticating core identity entry inside auth.users
  const { data: authUser, error: authError } = await privilegedSupabase.auth.admin.createUser({
    email: email.trim().toLowerCase(),
    password: password,
    email_confirm: true,
  });

  if (authError) {
    return { error: `Authentication engine failure: ${authError.message}` };
  }

  const newUserId = authUser.user?.id;

  // Step 2: Bind user metadata details to your public.users table
  const { error: profileError } = await privilegedSupabase
    .from("users")
    .insert([
      {
        id: newUserId,
        full_name: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone_number: phoneNumber ? phoneNumber.trim() : null,
        role: role,
        is_active: true,
      },
    ]);

  if (profileError) {
    await privilegedSupabase.auth.admin.deleteUser(newUserId!);
    return { error: `Database write failure: ${profileError.message}` };
  }

  revalidatePath("/");
  return { success: true };
}