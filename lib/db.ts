import { createClient } from "@supabase/supabase-js";

// Server-side Supabase client
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// Example query function
export async function getUserById(id: string) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// Add more query functions as needed
