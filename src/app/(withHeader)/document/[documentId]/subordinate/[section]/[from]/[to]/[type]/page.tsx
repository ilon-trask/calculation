import { getCalculationWithItems } from "@/app/data/Calculation.actions";
import getUser from "@/app/hooks/getUser";
import React from "react";
import SubordinatePageContent from "./SubordinatePageContent";

export type SubordinatePageProps = {
  params: {
    documentId: string;
    section: string;
    from: string;
    to: string;
    type: "All" | "Incomes" | "Expenses";
  };
};

async function page({ params }: SubordinatePageProps) {
  const calculation = +params.documentId
    ? await getCalculationWithItems({ calculationId: +params.documentId })
    : null;
  if (!calculation) throw new Error("Такої калькуляції немає");
  const user = await getUser();
  return (
    <div>
      {calculation.name}
      <SubordinatePageContent
        params={params}
        //@ts-ignore
        costs={calculation.costs.filter((el) => {
          const date = new Date(el.dateOfCost || "");
          return (
            date >= new Date(params.from) && date <= new Date(params.to + "-01")
          );
        })}
      />
    </div>
  );
}

export default page;
