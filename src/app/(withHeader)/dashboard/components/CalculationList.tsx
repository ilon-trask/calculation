"use client";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calculation } from "@prisma/client";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import React from "react";

function CalculationList({ calculations }: { calculations: Calculation[] }) {
  const router = useRouter();
  return (
    <div className="mt-20 grid grid-cols-3 gap-6">
      {calculations.map((el) => (
        <Card
          key={el.id}
          className="cursor-pointer"
          onClick={() => router.push("/calculation/" + el.id)}
        >
          <CardHeader className="flex justify-between flex-row align-top">
            <div>
              <CardTitle>{el.name}</CardTitle>
              <CardDescription>{el.description} &nbsp;</CardDescription>
            </div>
            <DotsVerticalIcon />
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

export default CalculationList;
