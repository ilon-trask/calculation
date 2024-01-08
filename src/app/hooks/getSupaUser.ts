import supabaseServer from "@/lib/supabaseServer";

async function getSupaUser() {
  const res = await supabaseServer.auth.getSession();
  return res;
}

export default getSupaUser;
