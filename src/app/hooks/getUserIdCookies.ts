import { cookies } from "next/headers";

export default function getUserIdCookies() {
  const userId = cookies().get("userId")?.value;
  return userId;
}
