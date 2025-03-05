import supabaseServer from "@/lib/supabaseServer";
import { getUser } from "../hooks/getUser";
import PageContent from "./PageContent";

export default async function Home() {
  const user = await getUser();
  const { data } = await supabaseServer.auth.getSession();
  return <PageContent userId={user?.id!} supaUser={data.session?.user} />;
}
