import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Калькуляція",
  description: "",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ua">
      <body>{children}</body>
    </html>
  );
}
