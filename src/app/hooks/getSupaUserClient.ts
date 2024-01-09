import supabaseClient from "@/lib/supabaseClient";

async function getSupaUserClient() {
  const res = await supabaseClient.auth.getSession();
  return res;
}

export default getSupaUserClient;
