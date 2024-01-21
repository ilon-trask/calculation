"use client";
import { DocsType } from "@/app/data/Docs";
import H4 from "@/components/ui/H4";
import { useRouter } from "next/navigation";
import React from "react";

function Breadcrumb({ name }: { name: string | undefined }) {
  const router = useRouter();
  const mockData: { name: string | undefined; link: string }[] = [
    { name, link: "" },
  ];
  return (
    <div>
      <div className="flex gap-2 print:hidden">
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
    </div>
  );
}

export default Breadcrumb;
