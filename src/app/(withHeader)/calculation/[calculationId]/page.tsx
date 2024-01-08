import React from "react";
import Breadcrumb from "./components/Breadcrumb";
import CalculationTable from "./components/CalculationTable/CalculationTable";
import { getCalculationWithItems } from "../../../data/Calculation.actions";
import getUserIdCookies from "@/app/hooks/getUserIdCookies";

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
  const isOwner = userId == calculation.userId;
  return (
    <div>
      <Breadcrumb name={calculation.name} />
      <CalculationTable
        className="mt-10"
        costs={calculation.Cost}
        calculationId={calculation.id}
        isOwner={isOwner}
      />
    </div>
  );
}

export default page;
