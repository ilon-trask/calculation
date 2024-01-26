import type { Metadata } from "next";
import "./globals.css";
import getUser from "./hooks/getUser";
import CreateUserUuid from "./(withHeader)/components/CreateUserUuid";

export const metadata: Metadata = {
  title: "Template",
  description: "",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  return (
    <html lang="ua">
      <CreateUserUuid userId={user?.id} />
      <body>{children}</body>
    </html>
  );
}
