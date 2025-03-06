import { cookies } from "next/headers";

export default async function getUserIdCookies() {
  const userId = (await cookies()).get("userId")?.value;
  return userId;
}
