import supabaseServer from "@/lib/supabaseServer";
import CheckIsUser from "./components/CheckIsUser";

async function Header() {
  const { data } = await supabaseServer.auth.getSession();

  return (
    <div className="flex justify-between h-16 items-center mb-3 print:hidden">
      <p className="font-semibold text-2xl">Logo</p>
      <CheckIsUser user={data.session?.user} />
    </div>
  );
}

export default Header;
