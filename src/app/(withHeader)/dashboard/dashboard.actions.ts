"use server";

import prismadb from "@/lib/prismadb";

export async function createCalculation(values: {
  name: string;
  description?: string;
  userId: string;
  isUserRegistered: boolean;
}) {
  const user = await prismadb.user.findUnique({ where: { id: values.userId } });
  if (!user) {
    await prismadb.user.create({
      data: {
        id: values.userId,
        name: "",
        role: "unRegistered",
      },
    });
  }
  const data = await prismadb.calculation.create({ data: values });
  return data;
}

export async function getCalculations({ userId }: { userId: string }) {
  const calculations = await prismadb.calculation.findMany({
    where: { userId },
  });
  return calculations;
}
