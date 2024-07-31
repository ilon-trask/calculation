"use client";
import { Table, TableBody } from "@/components/ui/table";
import React, { useEffect, useState } from "react";
import { UnitOfMeasurement } from "@prisma/client";
import { BusType } from "@/app/data/Cost.actions";
import BusinessPlanSettings from "./components/BusinessPlanSettings";
import BusinessTableHeader from "./components/BusinessTableHeader";
import { CostsContext } from "./data/useCostsContext";
import getSeparatedCosts from "./data/getSeparatedCosts";
import CashFlowData from "./components/CashFlowData";
import IncomeCalculationData from "./components/IncomeCalculationData";
import InvestmentData from "./components/InvestmentsData";

const quarters = [
  { id: 1, name: "1 квартал", children: ["Січень", "Лютий", "Березень"] },
  { id: 2, name: "2 квартал", children: ["Квітень", "Травень", "Червень"] },
  { id: 3, name: "3 квартал", children: ["Липень", "Серпень", "Вересень"] },
  { id: 4, name: "4 квартал", children: ["Жовтень", "Листопад", "Грудень"] },
] as const;

export type quartersType = typeof quarters;
export type quarterType = (typeof quarters)[number];
export type quarterNamesType = (typeof quarters)[number]["name"];

function BusinessTablePage({
  units,
  serverUserId,
  calculationId,
  costs,
  isOwner,
}: {
  units: UnitOfMeasurement[];
  serverUserId: string;
  calculationId: number;
  costs: BusType[];
  isOwner: boolean;
}) {
  const [quarter, setQuarter] = useState<quarterNamesType>("1 квартал");
  const [thisQuarter, setThisQuarter] = useState(
    quarters.find((el) => el.name == quarter)
  );
  useEffect(
    () => setThisQuarter(quarters.find((el) => el.name == quarter)),
    [quarter]
  );
  const [value, setValue] = useState<string>(new Date().getFullYear() + "");
  const [thisYearCosts, setThisYearCosts] = useState(
    costs.filter(
      (el) => new Date(el.dateOfCost || "").getFullYear().toString() == value
    )
  );
  useEffect(() => {
    setThisYearCosts(
      costs.filter(
        (el) => new Date(el.dateOfCost || "").getFullYear().toString() == value
      )
    );
  }, [costs]);
  if (!thisQuarter) throw new Error("thisQuarter is null");

  return (
    <CostsContext.Provider value={getSeparatedCosts(thisYearCosts)}>
      <BusinessPlanSettings
        quarters={quarters}
        quarter={quarter}
        setQuarter={setQuarter}
        value={quarter}
        setValue={setValue}
        serverUserId={serverUserId}
      />
      <Table>
        <BusinessTableHeader thisQuarter={thisQuarter} />
        <TableBody>
          <CashFlowData
            calculationId={calculationId}
            isOwner={isOwner}
            serverUserId={serverUserId}
            thisQuarter={thisQuarter}
            units={units}
          />
          <IncomeCalculationData
            calculationId={calculationId}
            isOwner={isOwner}
            serverUserId={serverUserId}
            thisQuarter={thisQuarter}
            units={units}
          />
          <InvestmentData
            calculationId={calculationId}
            isOwner={isOwner}
            serverUserId={serverUserId}
            thisQuarter={thisQuarter}
            units={units}
          />
        </TableBody>
      </Table>
    </CostsContext.Provider>
  );
}

export default BusinessTablePage;
