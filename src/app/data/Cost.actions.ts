"use server";

import prismadb from "@/lib/prismadb";
import { Cost, UnitOfMeasurement } from "@prisma/client";
import { DocsType } from "./Docs";
import {
  busTableType,
  busTableValueType,
} from "../(withHeader)/document/[documentId]/components/Tables/BusinessTable/components/DataRows";

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

type UpdateBusinessPlanRowData = Omit<busTableValueType, "price" | "amount"> & {
  price: number;
  amount: number;
};
export type UpdateBusTableType = Omit<busTableType, "values"> & {
  values: UpdateBusinessPlanRowData[];
};

export async function updateBusinessPlanRow(data: UpdateBusTableType) {
  console.log(data.values[0].dateOfCost);
  const res = await prismadb.cost.updateMany({
    data: { name: data.name, unitOfMeasurementId: data.unitOfMeasurementId },
    where: {
      AND: [
        { name: data.name },
        { unitOfMeasurementId: data.unitOfMeasurementId },
        { calculationId: data.calculationId },
      ],
    },
  });
  data.values.forEach(async (value) => {
    await prismadb.cost.update({
      data: {
        amount: value.amount,
        price: value.price,
        dateOfCost: new Date(value.dateOfCost),
        dateOfOccurrence: new Date(value.dateOfOccurrence),
      },
      where: {
        id: value.id,
      },
    });
  });

  return res;
}
