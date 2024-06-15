import supabaseServer from "@/lib/supabaseServer";
import CheckIsUser from "./components/CheckIsUser";
import HeaderWrap from "./HeaderWrap";

async function Header() {
  const { data } = await supabaseServer.auth.getSession();

  return (
    <HeaderWrap>
      <CheckIsUser user={data.session?.user} />
    </HeaderWrap>
  );
}

export default Header;
