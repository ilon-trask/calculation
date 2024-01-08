"use server";

import prismadb from "@/lib/prismadb";

export async function createUnit(values: { name: string }, userId: string) {
  const unit = await prismadb.unitOfMeasurement.create({
    data: {
      name: values.name,
      userId,
    },
  });
  return unit;
}
