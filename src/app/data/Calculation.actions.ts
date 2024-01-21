"use server";

import prismadb from "@/lib/prismadb";
import { Calculation, Cost, UnitOfMeasurement } from "@prisma/client";
import { DocsType } from "./Docs";
import { CostType, CostWithUnit } from "./Cost.actions";

export async function createCalculation(values: {
  name: string;
  description?: string | null;
  userId: string;
  section: DocsType;
  isUserRegistered: boolean;
}) {
  const data = await prismadb.calculation.create({ data: values });
  return data;
}

export async function updateCalculation(values: {
  id: number;
  name: string;
  description?: string | null;
  userId: string;
  section: DocsType;
  isUserRegistered: boolean;
}) {
  const data = await prismadb.calculation.update({
    data: values,
    where: { id: values.id },
  });
  return data;
}

export async function getCalculations({ userId }: { userId: string }) {
  const calculations = await prismadb.calculation.findMany({
    where: { userId },
  });
  return calculations;
}

export async function getCalculation({
  calculationId,
}: {
  calculationId: number;
}) {
  const calculation = await prismadb.calculation.findUnique({
    where: { id: calculationId },
  });
  return calculation;
}

export interface CalculationType extends Omit<Calculation, "section"> {
  costs: CostType[];
  section: DocsType;
}

export async function getCalculationWithItems({
  calculationId,
}: {
  calculationId: number;
}): Promise<CalculationType | null> {
  const calculation = await prismadb.calculation.findUnique({
    where: { id: calculationId },
    include: {
      costs: {
        orderBy: { createdAt: "asc" },
        include: { unitOfMeasurement: true },
      },
    },
  });
  //@ts-ignore
  return calculation;
}

export async function deleteCalculation({
  calculationId,
}: {
  calculationId: number;
}) {
  const res = await prismadb.calculation.delete({
    where: { id: calculationId },
  });
  return res;
}
