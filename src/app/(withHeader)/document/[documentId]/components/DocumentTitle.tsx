"use client";
import CreateDocument from "@/app/(withHeader)/components/CreateDocument";
import DocumentDropDown from "@/app/(withHeader)/dashboard/components/DocumentDropDown";
import { CalculationType } from "@/app/data/Calculation.actions";
import React, { useState } from "react";

function DocumentTitle({
  calculation,
  userId,
}: {
  calculation: CalculationType;
  userId: string | undefined;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex items-center mt-8 justify-center gap-4">
      <p className="text-center font-semibold text-xl uppercase">
        {calculation.section}
      </p>
      <DocumentDropDown
        id={calculation.id}
        setIsOpenDialog={setIsOpen}
        inCalculation
      />
      <CreateDocument
        serverUserId={userId!}
        section={calculation.section!}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        chosenCalc={calculation}
      >
        {""}
      </CreateDocument>
    </div>
  );
}

export default DocumentTitle;
