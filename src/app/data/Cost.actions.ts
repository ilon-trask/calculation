"use server";

import prismadb from "@/lib/prismadb";
import { Cost, UnitOfMeasurement } from "@prisma/client";
import { DocsType } from "./Docs";

type createCostType = Omit<Cost, "id" | "createdAt" | "updatedAt">;

export interface CostWithUnit extends Cost {
  unitOfMeasurement?: UnitOfMeasurement;
  section: DocsType;
}

type WorkSetType = Omit<CostWithUnit, "price" | "type"> & {
  section: "Набір робіт, матеріалів та послуг";
};
type DefectiveActType = Omit<WorkSetType, "section"> & {
  section: "Дефектний акт (скорочений)";
};
type CalculationType = Omit<CostWithUnit, "note"> & {
  section: "Калькуляція (скорочена)";
};
export type BusType = Omit<CostWithUnit, "note" | "type" | "section"> & {
  section: "Розрахунок бізнес-плану";
};

export type CostType = Omit<CostWithUnit, "note" | "price"> &
  (
    | WorkSetType
    | CalculationType
    | DefectiveActType
    | BusType
    | {
        section: "Рахунок фактура";
      }
  );

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
      //@ts-ignore
      amount: +values.amount,
      //@ts-ignore
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
