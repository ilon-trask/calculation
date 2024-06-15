"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";

function HeaderWrap({ children }: { children?: JSX.Element }) {
  const router = useRouter();
  return (
    <div className="flex justify-between h-16 items-center mb-3 print:hidden">
      <p
        className="font-semibold text-2xl cursor-pointer"
        onClick={() => router.push("/")}
      >
        Template
      </p>
      {children || (
        <Button variant={"outline"} onClick={() => router.push("/sign-in")}>
          Увійти
        </Button>
      )}
    </div>
  );
}

export default HeaderWrap;
