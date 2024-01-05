import Container from "@/components/ui/Container";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "123",
  description: "Generated by create next app",
};

function layout({ children }: { children: React.ReactNode }) {
  return (
    <Container>
      <div className=" h-20 w-screen">asdfsa</div>
      {children}
    </Container>
  );
}

export default layout;
