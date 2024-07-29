import { getCalculationWithItems } from "@/app/data/Calculation.actions";
import getUser from "@/app/hooks/getUser";
import React from "react";
import SubordinatePageContent from "./SubordinatePageContent";

type Props = {
  params: {
    documentId: string;
    section: string;
    from: string;
    to: string;
    type: string;
  };
};

async function page({ params }: Props) {
  const calculation = +params.documentId
    ? await getCalculationWithItems({ calculationId: +params.documentId })
    : null;
  if (!calculation) throw new Error("Такої калькуляції немає");
  const user = await getUser();
  return (
    <div>
      {calculation.name}
      <SubordinatePageContent params={params} />
    </div>
  );
}

export default page;
