"use server";

import prismadb from "@/lib/prismadb";
import { Calculation, Cost, UnitOfMeasurement } from "@prisma/client";

export async function createCalculation(values: {
  name: string;
  description?: string | null;
  userId: string;
  isUserRegistered: boolean;
}) {
  const user = await prismadb.user.findUnique({ where: { id: values.userId } });
  if (!user) {
    await prismadb.user.create({
      data: { id: values.userId, name: "", role: "unRegistered" },
    });
  }
  const data = await prismadb.calculation.create({ data: values });
  return data;
}

export async function updateCalculation(values: {
  id: number;
  name: string;
  description?: string | null;
  userId: string;
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

export interface CostWithUnit extends Cost {
  unitOfMeasurement?: UnitOfMeasurement;
}

export interface CalculationWithItemsType extends Calculation {
  costs: CostWithUnit[];
}

export async function getCalculationWithItems({
  calculationId,
}: {
  calculationId: number;
}): Promise<CalculationWithItemsType | null> {
  const calculation = await prismadb.calculation.findUnique({
    where: { id: calculationId },
    include: {
      costs: {
        orderBy: { createdAt: "asc" },
        include: { unitOfMeasurement: true },
      },
    },
  });
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
