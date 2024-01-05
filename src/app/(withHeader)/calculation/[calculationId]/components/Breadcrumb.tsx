"use client";
import H4 from "@/components/ui/H4";
import { useRouter } from "next/navigation";
import React from "react";
const mockData: { name: string; link: string }[] = [
  { name: "first", link: "" },
];

function Breadcrumb() {
  const router = useRouter();
  return (
    <div className="flex gap-2">
      <H4
        className="cursor-pointer font-normal"
        onClick={() => router.push("/dashboard")}
      >
        Кабінет{" "}
      </H4>
      {mockData.map((el) => (
        <React.Fragment key={el.name}>
          <p>/</p>
          <H4 className="cursor-pointer">{el.name}</H4>
        </React.Fragment>
      ))}
    </div>
  );
}

export default Breadcrumb;
