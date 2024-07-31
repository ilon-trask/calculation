import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import TableTextHeading from "./ui/TableTextheading";
import TableTextSubHeading from "./ui/TableTextSubHeading";
import DataRows from "./DataRows";
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

function IncomeCalculationData({
  calculationId,
  isOwner,
  serverUserId,
  thisQuarter,
  units,
}: Props) {
  const {
    thisYearExpensesOperationalAmortization,
    thisYearExpensesOperationalGeneral,
    thisYearExpensesOperationalStraight,
    thisYearIncomes,
    thisYearExpenses,
    thisYearExpensesOperationalPermanent,
  } = useCostsContext();
  return (
    <>
      <TableRow className="bg-black  hover:bg-black">
        <TableTextHeading>Розрахунок прибутку</TableTextHeading>
      </TableRow>
      <TableRow>
        <TableTextSubHeading>
          Доходи <span className="lowercase">(виникнення)</span>
        </TableTextSubHeading>
      </TableRow>
      <TableRow>
        <TableCell>Продукція, послуга</TableCell>
      </TableRow>
      <DataRows
        calculationId={calculationId}
        serverUserId={serverUserId}
        thisQuarter={thisQuarter}
        thisYearCosts={thisYearIncomes.filter(
          (el) => el.costSubtype == null || el.costSubtype == ""
        )}
        units={units}
        costSubtype=""
        isPlus
        isIncome
        isOccurrence
        isOwner={isOwner}
      />
      <TableRow>
        <TableTextSubHeading>
          Витрати <span className="lowercase">(операційні)</span>
        </TableTextSubHeading>
      </TableRow>
      <TableRow>
        <TableCell>Витрати постійні</TableCell>
      </TableRow>
      <DataRows
        calculationId={calculationId}
        serverUserId={serverUserId}
        thisQuarter={thisQuarter}
        thisYearCosts={thisYearExpensesOperationalPermanent}
        units={units}
        costSubtype="витрати постійні"
        isPlus
        isIncome={false}
        isOccurrence
        activityType="операційна"
        isOwner={isOwner}
      />
      <TableRow>
        <TableCell>Амортизація</TableCell>
      </TableRow>
      <DataRows
        calculationId={calculationId}
        serverUserId={serverUserId}
        thisQuarter={thisQuarter}
        thisYearCosts={thisYearExpensesOperationalAmortization}
        units={units}
        costSubtype="амортизація"
        isPlus
        isIncome={false}
        isOccurrence
        activityType="операційна"
        isOwner={isOwner}
      />
      <TableRow>
        <TableCell>Витрати заг-вир</TableCell>
      </TableRow>
      <DataRows
        calculationId={calculationId}
        serverUserId={serverUserId}
        thisQuarter={thisQuarter}
        thisYearCosts={thisYearExpensesOperationalGeneral}
        units={units}
        costSubtype="витрати заг-вир"
        isPlus
        isIncome={false}
        isOccurrence
        activityType="операційна"
        isOwner={isOwner}
      />
      <TableRow>
        <TableCell>Витрати прямі</TableCell>
      </TableRow>
      <DataRows
        calculationId={calculationId}
        serverUserId={serverUserId}
        thisQuarter={thisQuarter}
        thisYearCosts={thisYearExpensesOperationalStraight}
        units={units}
        costSubtype="витрати прямі"
        isPlus
        isIncome={false}
        isOccurrence
        activityType="операційна"
        isOwner={isOwner}
      />
      <TableRow>
        <TableTextSubHeading>Прибуток</TableTextSubHeading>
      </TableRow>
      <TableRow></TableRow>
      <TableRow>
        <TableCell>Прибуток за період</TableCell> <TableCell></TableCell>
        {(() => {
          const arr: number[] = [0];
          for (let i = 0; i < 12; i++) {
            const sum =
              thisYearIncomes
                .filter(
                  (cost) =>
                    i == new Date(cost.dateOfOccurrence || "").getMonth() &&
                    (cost.costSubtype == null || cost.costSubtype == "")
                )
                .reduce((p, c) => p + c.amount * c.price, 0) -
              thisYearExpenses
                .filter(
                  (cost) =>
                    i == new Date(cost.dateOfOccurrence || "").getMonth()
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
        <TableCell>Прибуток (наростаючий)</TableCell>
        <TableCell></TableCell>
        {(() => {
          let prevMonth = 0;
          const arr: number[] = [0];
          for (let i = 0; i < 12; i++) {
            const sum =
              prevMonth +
              thisYearIncomes
                .filter(
                  (cost) =>
                    i == new Date(cost.dateOfOccurrence || "").getMonth() &&
                    (cost.costSubtype == null || cost.costSubtype == "")
                )
                .reduce((p, c) => p + c.amount * c.price, 0) -
              thisYearExpenses
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
      <TableRow>
        <TableCell> </TableCell>
      </TableRow>
      <TableRow>
        <TableCell> </TableCell>
      </TableRow>
      <TableRow>
        <TableCell> </TableCell>
      </TableRow>
    </>
  );
}

export default IncomeCalculationData;
