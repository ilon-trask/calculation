import React from "react";
import Breadcrumb from "./components/Breadcrumb";
import CalculationTable from "./components/CalculationTable/CalculationTable";
import { getCalculationWithItems } from "../../../data/Calculation.actions";

async function page({
  params,
}: {
  params: { calculationId: string };
  searchParams: {};
}) {
  const calculation = +params.calculationId
    ? await getCalculationWithItems({ calculationId: +params.calculationId })
    : null;
  if (!calculation) throw new Error("");

  return (
    <div>
      <Breadcrumb name={calculation.name} />
      <CalculationTable
        className="mt-10"
        costs={calculation.Cost}
        calculationId={calculation.id}
      />
    </div>
  );
}

export default page;
