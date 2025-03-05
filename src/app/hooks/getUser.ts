import prismadb from "@/lib/prismadb";
import { cookies } from "next/headers";
import supabaseServer from "@/lib/supabaseServer";
import { v4 } from "uuid";

export async function getUser() {
  "use server";
  const cookieStore = cookies();

  // Get cookie
  const userId = cookieStore.get('userId')?.value;

  const { data, error } = await supabaseServer.auth.getSession();
  if (error) throw new Error(error.message);

  if (data.session) {
    const user = await prismadb.user.findFirst({
      where: { sub: data.session?.user.id },
    });
    if (user) return user;

    if (!userId) {
      const newUser = await prismadb.user.create({
        data: {
          id: v4(),
          role: "registered",
          name: "",
          sub: data.session?.user.id,
        },
      });
      return newUser;
    }

    //   // Set cookie to null
    cookieStore.set('userId', 'null', { path: '/' });

    const newUser = await prismadb.user.update({
      data: { sub: data.session?.user.id, role: "registered" },
      where: { id: userId },
    });
    return newUser;
  } else {
    if (!userId) return null;
    const user = await prismadb.user.findFirst({ where: { id: userId } });
    if (user) return user;
    const newUser = await prismadb.user.create({
      data: { id: userId, name: "", role: "unRegistered" },
    });
    return newUser;
  }
}