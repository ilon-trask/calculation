import React from "react";
import Breadcrumb from "./components/Breadcrumb";
import CalculationTable from "./components/CalculationTable/CalculationTable";
import { getCalculationWithItems } from "../../../data/Calculation.actions";
import getUserIdCookies from "@/app/hooks/getUserIdCookies";
import prismadb from "@/lib/prismadb";

async function page({
  params,
}: {
  params: { calculationId: string };
  searchParams: {};
}) {
  const calculation = +params.calculationId
    ? await getCalculationWithItems({ calculationId: +params.calculationId })
    : null;
  if (!calculation) throw new Error("Такої калькуляції немає");
  const userId = getUserIdCookies();
  const units = await prismadb.unitOfMeasurement.findMany({
    where: { OR: [{ userId }, { userId: null }] },
  });
  console.log(units);
  const isOwner = userId == calculation.userId;
  return (
    <div>
      <Breadcrumb name={calculation.name} />
      <CalculationTable
        className="mt-10"
        costs={calculation.costs}
        calculationId={calculation.id}
        isOwner={isOwner}
        units={units}
        serverUserId={userId!}
      />
    </div>
  );
}

export default page;
