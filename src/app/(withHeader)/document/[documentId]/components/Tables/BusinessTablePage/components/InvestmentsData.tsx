import { TableRow, TableCell } from "@/components/ui/table";
import TableTextHeading from "./ui/TableTextheading";
import TableTextSubHeading from "./ui/TableTextSubHeading";
import DataRows from "./DataRows";
import React from "react";
import { useCostsContext } from "../data/useCostsContext";
import { UnitOfMeasurement } from "@prisma/client";
import { quarterType } from "../BusinessTablePage";

type Props = {
  thisQuarter: quarterType;
  calculationId: number;
  serverUserId: string;
  units: UnitOfMeasurement[];
  isOwner: boolean;
};

function InvestmentData({
  calculationId,
  isOwner,
  serverUserId,
  thisQuarter,
  units,
}: Props) {
  const {
    thisYearExpensesInvestmentGeneral,
    thisYearExpensesInvestmentPermanent,
    thisYearExpensesInvestmentStraight,
    thisYearExpensesInvestment,
  } = useCostsContext();
  return (
    <>
      <TableRow className="bg-black  hover:bg-black">
        <TableTextHeading>Розрахунок інвестицій</TableTextHeading>
      </TableRow>
      <TableRow>
        <TableTextSubHeading>
          Витрати <span className="lowercase">(інвестиційні)</span>
        </TableTextSubHeading>
      </TableRow>
      <TableRow>
        <TableCell>Витрати постійні</TableCell>
      </TableRow>
      <DataRows
        calculationId={calculationId}
        serverUserId={serverUserId}
        thisQuarter={thisQuarter}
        thisYearCosts={thisYearExpensesInvestmentPermanent}
        units={units}
        costSubtype="витрати постійні"
        isPlus
        isIncome={false}
        isOccurrence
        activityType="інвестиційна"
        isOwner={isOwner}
      />
      <TableRow>
        <TableCell>Витрати заг-вир</TableCell>
      </TableRow>
      <DataRows
        calculationId={calculationId}
        serverUserId={serverUserId}
        thisQuarter={thisQuarter}
        thisYearCosts={thisYearExpensesInvestmentGeneral}
        units={units}
        costSubtype="витрати заг-вир"
        isPlus
        isIncome={false}
        isOccurrence
        activityType="інвестиційна"
        isOwner={isOwner}
      />
      <TableRow>
        <TableCell>Витрати прямі</TableCell>
      </TableRow>
      <DataRows
        calculationId={calculationId}
        serverUserId={serverUserId}
        thisQuarter={thisQuarter}
        thisYearCosts={thisYearExpensesInvestmentStraight}
        units={units}
        costSubtype="витрати прямі"
        isPlus
        isIncome={false}
        isOccurrence
        activityType="інвестиційна"
        isOwner={isOwner}
      />
      <TableRow>
        <TableTextSubHeading>Інвестиції</TableTextSubHeading>
      </TableRow>
      <TableRow></TableRow>
      <TableRow>
        <TableCell>Інвестиції за період</TableCell> <TableCell></TableCell>
        {(() => {
          const arr: number[] = [0];
          for (let i = 0; i < 12; i++) {
            const sum = thisYearExpensesInvestment
              .filter(
                (cost) => i == new Date(cost.dateOfOccurrence || "").getMonth()
              )
              .reduce((p, c) => p + c.amount * c.price, 0);
            arr.push(sum);
          }
          return (
            <>
              {Array.from({ length: 3 }, (_, index) => index + 1).map((el) => {
                return (
                  <React.Fragment key={el}>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell>{arr[(thisQuarter.id - 1) * 3 + el]}</TableCell>
                  </React.Fragment>
                );
              })}
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell>{arr.reduce((p, c) => p + c, 0)}</TableCell>
            </>
          );
        })()}
      </TableRow>
      <TableRow>
        <TableCell>Інвестиції (наростаючий)</TableCell>
        <TableCell></TableCell>
        {(() => {
          let prevMonth = 0;
          const arr: number[] = [0];
          for (let i = 0; i < 12; i++) {
            const sum =
              prevMonth +
              thisYearExpensesInvestment
                .filter(
                  (cost) =>
                    i == new Date(cost.dateOfOccurrence || "").getMonth()
                )
                .reduce((p, c) => p + c.amount * c.price, 0);
            prevMonth = sum;
            arr.push(sum);
          }
          return (
            <React.Fragment>
              {Array.from({ length: 3 }, (_, index) => index + 1).map((el) => {
                return (
                  <React.Fragment key={el}>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell>{arr[(thisQuarter.id - 1) * 3 + el]}</TableCell>
                  </React.Fragment>
                );
              })}
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell>{arr[arr.length - 1]}</TableCell>
            </React.Fragment>
          );
        })()}
      </TableRow>
    </>
  );
}

export default InvestmentData;
