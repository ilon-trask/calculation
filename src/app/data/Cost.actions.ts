"use server";

import prismadb from "@/lib/prismadb";
import { Cost } from "@prisma/client";
import { RowType } from "../(withHeader)/calculation/[calculationId]/components/CalculationTable/CalculationTable";

type createCostType = Omit<Cost, "id" | "createdAt" | "updatedAt">;

export async function createCost(values: createCostType) {
  const res = await prismadb.cost.create({
    data: values,
  });
  return res;
}
export async function updateCost(values: Cost) {
  const cost = await prismadb.cost.update({
    data: {
      ...values,
      amount: +values.amount,
      price: +values.price,
    },
    where: { id: values.id },
  });
  return cost;
}

export async function deleteCost(id: number) {
  const cost = await prismadb.cost.delete({ where: { id } });
  return cost;
}
