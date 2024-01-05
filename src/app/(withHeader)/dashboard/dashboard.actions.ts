"use server";

import prismadb from "@/lib/prismadb";

export async function createCalculation() {
  const data = prismadb.calculation.create({
    data: {},
  });
}
