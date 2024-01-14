"use server";
import prismadb from "@/lib/prismadb";
import getUserIdCookies from "./getUserIdCookies";
import supabaseServer from "@/lib/supabaseServer";
import { v4 } from "uuid";
import { useRouter } from "next/router";

async function getUser() {
  // const router = useRouter();
  const { data, error } = await supabaseServer.auth.getSession();
  if (error) throw new Error(error.message);
  const userId = getUserIdCookies();
  if (data.session) {
    const user = await prismadb.user.findFirst({
      where: { sub: data.session?.user.id },
    });
    if (user) return user;

    if (!userId) {
      const newUser = prismadb.user.create({
        data: {
          id: v4(),
          role: "registered",
          name: "",
          sub: data.session?.user.id,
        },
      });
      // router.refresh();
      return newUser;
    }

    document.cookie = `userId=null; path=/`;
    const newUser = await prismadb.user.update({
      data: { sub: data.session?.user.id, role: "registered" },
      where: { id: userId },
    });
    // router.refresh();
    return newUser;
  } else {
    if (!userId) return null;
    const user = await prismadb.user.findFirst({ where: { id: userId } });
    if (user) return user;
    const newUser = await prismadb.user.create({
      data: { id: userId, name: "", role: "unRegistered" },
    });
    // router.refresh();
    return newUser;
  }
}

export default getUser;
