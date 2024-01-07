"use client";
import H2 from "@/components/ui/H2";
import React, { useState } from "react";
import CreateCalculation from "./CreateCalculation";
import CalculationList from "./CalculationList";
import { Calculation } from "@prisma/client";

function DashboardContent({
  userId,
  calculations,
}: {
  userId: string | undefined;
  calculations: Calculation[];
}) {
  const [chosenCalcId, setChosenCalcId] = useState(0);
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  return (
    <>
      <div className="flex justify-between">
        <H2>Мої калькуляції</H2>
        <CreateCalculation
          serverUserId={userId}
          isOpen={isOpenDialog}
          setIsOpen={setIsOpenDialog}
          chosenCalcId={chosenCalcId}
        />
      </div>
      <CalculationList calculations={calculations} />
    </>
  );
}

export default DashboardContent;
