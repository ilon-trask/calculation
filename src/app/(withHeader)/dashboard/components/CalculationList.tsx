"use client";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import React from "react";

const mockData: { id: number; name: string; description: string }[] = [
  { id: 1, name: "first", description: "slkjdf" },
  { id: 2, name: "second", description: "other" },
  { id: 3, name: "third", description: "234" },
];
function CalculationList() {
  const router = useRouter();
  return (
    <div className="mt-20 grid grid-cols-3 gap-6">
      {mockData.map((el) => (
        <Card
          className="cursor-pointer"
          onClick={() => router.push("/calculation/" + el.id)}
        >
          <CardHeader className="flex justify-between flex-row align-top">
            <div>
              <CardTitle>{el.name}</CardTitle>
              <CardDescription>{el.description}</CardDescription>
            </div>
            <DotsVerticalIcon />
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

export default CalculationList;
