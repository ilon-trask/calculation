import {
  SupabaseClient,
  createServerComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

declare global {
  var supabase: SupabaseClient<any, "public", any> | undefined;
}

const supabaseServer =
  globalThis.supabase ||
  createServerComponentClient(
    { cookies },
    {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    }
  );

export default supabaseServer;
