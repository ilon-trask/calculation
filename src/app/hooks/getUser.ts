"use server";
import prismadb from "@/lib/prismadb";
import getUserIdCookies from "./getUserIdCookies";
import supabaseServer from "@/lib/supabaseServer";
import { v4 } from "uuid";

async function getUser() {
  const { data, error } = await supabaseServer.auth.getSession();
  if (error) throw new Error(error.message);
  const userId = getUserIdCookies();
  if (data.session) {
    const user = await prismadb.user.findFirst({
      where: { sub: data.session?.user.id },
    });
    if (user) return user;

    if (!userId) {
      return prismadb.user.create({
        data: {
          id: v4(),
          role: "registered",
          name: "",
          sub: data.session?.user.id,
        },
      });
    }

    document.cookie = `userId=null; path=/`;
    return await prismadb.user.update({
      data: { sub: data.session?.user.id, role: "registered" },
      where: { id: userId },
    });
  } else {
    if (!userId) return null;
    const user = await prismadb.user.findFirst({ where: { id: userId } });
    if (user) return user;
    return await prismadb.user.create({
      data: { id: userId, name: "", role: "unRegistered" },
    });
  }
}

export default getUser;
