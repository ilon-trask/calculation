import React from "react";
import {
  TableHead,
  TableHeader,
  Table,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import TableTextSubHeading from "./ui/TableTextSubHeading";
import TableTextHeading from "./ui/TableTextheading";
import DataRows from "./DataRows";
import { UnitOfMeasurement } from "@prisma/client";
import { quarterType } from "../BusinessTablePage";
import { useCostsContext } from "../data/useCostsContext";

function CashFlow({ thisQuarter }: { thisQuarter: quarterType }) {
  const { thisYearIncomes, thisYearExpensesNotAmortization } =
    useCostsContext();
  return (
    <>
      <TableRow>
        <TableTextSubHeading>Рух коштів</TableTextSubHeading>
      </TableRow>
      <TableRow>
        <TableCell>Залишок на початок</TableCell> <TableCell></TableCell>
        {(() => {
          let prevMonth = 0;
          const arr: number[] = [0];
          for (let i = 0; i < 12; i++) {
            const sum =
              prevMonth +
              thisYearIncomes
                .filter(
                  (cost) => i == new Date(cost.dateOfCost || "").getMonth() + 1
                )
                .reduce((p, c) => p + c.amount * c.price, 0) -
              thisYearExpensesNotAmortization
                .filter(
                  (cost) =>
                    i == new Date(cost.dateOfCost || "").getMonth() + 1 &&
                    !cost.isIncome &&
                    cost.costSubtype != "амортизація"
                )
                .reduce((p, c) => p + c.amount * c.price, 0);
            prevMonth = sum;
            arr.push(sum);
          }
          return Array.from({ length: 3 }, (_, index) => index + 1).map(
            (el) => {
              return (
                <React.Fragment key={el}>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell>{arr[(thisQuarter.id - 1) * 3 + el]}</TableCell>
                </React.Fragment>
              );
            }
          );
        })()}
        <TableCell></TableCell>
        <TableCell></TableCell>
        <TableCell>0</TableCell>
      </TableRow>
    </>
  );
}
type Props = {
  serverUserId: string;
  calculationId: number;
  units: UnitOfMeasurement[];
  isOwner: boolean;
  thisQuarter: quarterType;
};

function CashFlowData({
  calculationId,
  serverUserId,
  isOwner,
  units,
  thisQuarter,
}: Props) {
  const {
    thisYearExpensesInvestmentGeneral,
    thisYearExpensesInvestmentPermanent,
    thisYearExpensesInvestmentStraight,
    thisYearIncomes,
    thisYearIncomesCredits,
    thisYearIncomesOwn,
    thisYearExpensesOperationalGeneral,
    thisYearExpensesNotAmortization,
    thisYearExpensesOperationalNotAmortization,
    thisYearExpensesOperationalPermanent,
    thisYearExpensesOperationalStraight,
  } = useCostsContext();
  return (
    <>
      <TableRow className="bg-black  hover:bg-black">
        <TableTextHeading>Розрахунок грошового потоку</TableTextHeading>
      </TableRow>
      <TableRow>
        <TableTextSubHeading>
          Доходи <span className="lowercase">(Оплата)</span>
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
        isOccurrence={false}
        isOwner={isOwner}
      />
      <TableRow>
        <TableCell>Власні інвестиції</TableCell>
      </TableRow>
      <DataRows
        calculationId={calculationId}
        serverUserId={serverUserId}
        thisQuarter={thisQuarter}
        thisYearCosts={thisYearIncomesOwn}
        units={units}
        costSubtype="власні"
        isPlus
        isIncome
        isOccurrence={false}
        isOwner={isOwner}
      />
      <TableRow>
        <TableCell>Залучені позики</TableCell>
      </TableRow>
      <DataRows
        calculationId={calculationId}
        serverUserId={serverUserId}
        thisQuarter={thisQuarter}
        thisYearCosts={thisYearIncomesCredits}
        units={units}
        costSubtype="залучені позики"
        isPlus
        isIncome
        isOccurrence={false}
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
        isOccurrence={false}
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
        isOccurrence={false}
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
        isOccurrence={false}
        activityType="операційна"
        isOwner={isOwner}
      />
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
      <CashFlow thisQuarter={thisQuarter} />
      <TableRow>
        <TableCell>Залишок на початок</TableCell> <TableCell></TableCell>
        {(() => {
          let prevMonth = 0;
          const arr: number[] = [0];
          for (let i = 0; i < 12; i++) {
            const sum =
              prevMonth +
              thisYearIncomes
                .filter(
                  (cost) => i == new Date(cost.dateOfCost || "").getMonth() + 1
                )
                .reduce((p, c) => p + c.amount * c.price, 0) -
              thisYearExpensesNotAmortization
                .filter(
                  (cost) => i == new Date(cost.dateOfCost || "").getMonth() + 1
                )
                .reduce((p, c) => p + c.amount * c.price, 0);
            prevMonth = sum;
            arr.push(sum);
          }
          return Array.from({ length: 3 }, (_, index) => index + 1).map(
            (el) => {
              return (
                <React.Fragment key={el}>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell>{arr[(thisQuarter.id - 1) * 3 + el]}</TableCell>
                </React.Fragment>
              );
            }
          );
        })()}
        <TableCell></TableCell>
        <TableCell></TableCell>
        <TableCell>0</TableCell>
      </TableRow>

      <TableRow>
        <TableCell>Притік Надходження</TableCell>
      </TableRow>
      <DataRows
        calculationId={calculationId}
        serverUserId={serverUserId}
        thisQuarter={thisQuarter}
        thisYearCosts={thisYearIncomes}
        units={units}
        costSubtype=""
        isPlus={false}
        isIncome
        isOccurrence={false}
        isOwner={isOwner}
      />
      <TableRow>
        <TableCell>Відтік Виплати</TableCell>
      </TableRow>
      <DataRows
        calculationId={calculationId}
        serverUserId={serverUserId}
        thisQuarter={thisQuarter}
        thisYearCosts={thisYearExpensesOperationalNotAmortization}
        units={units}
        costSubtype=""
        isPlus={false}
        isIncome={false}
        isOccurrence={false}
        activityType="операційна"
        isOwner={isOwner}
      />

      <TableRow>
        <TableCell>Результат за період</TableCell>
        <TableCell></TableCell>
        {(() => {
          const arr: number[] = [];
          for (let i = 0; i < 12; i++) {
            const sum =
              thisYearIncomes
                .filter(
                  (cost) => i == new Date(cost.dateOfCost || "").getMonth() + 1
                )
                .reduce((p, c) => p + c.amount * c.price, 0) -
              thisYearExpensesNotAmortization
                .filter(
                  (cost) => i == new Date(cost.dateOfCost || "").getMonth() + 1
                )
                .reduce((p, c) => p + c.amount * c.price, 0);

            arr[i] = sum;
          }
          return Array.from({ length: 3 }, (_, index) => index + 1).map(
            (el) => {
              return (
                <React.Fragment key={el}>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell>{arr[(thisQuarter.id - 1) * 3 + el]}</TableCell>
                </React.Fragment>
              );
            }
          );
        })()}
      </TableRow>
      <TableRow>
        <TableCell>Залишок на кінець</TableCell>
        <TableCell></TableCell>
        {(() => {
          let prevMonth = 0;
          const arr: number[] = [];
          for (let i = 0; i < 12; i++) {
            const sum =
              prevMonth +
              thisYearIncomes
                .filter(
                  (cost) => i == new Date(cost.dateOfCost || "").getMonth() + 1
                )
                .reduce((p, c) => p + c.amount * c.price, 0) -
              thisYearExpensesNotAmortization
                .filter(
                  (cost) => i == new Date(cost.dateOfCost || "").getMonth() + 1
                )
                .reduce((p, c) => p + c.amount * c.price, 0);
            prevMonth = sum;
            arr[i] = sum;
          }
          return Array.from({ length: 3 }, (_, index) => index + 1).map(
            (el) => {
              return (
                <React.Fragment key={el}>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell>{arr[(thisQuarter.id - 1) * 3 + el]}</TableCell>
                </React.Fragment>
              );
            }
          );
        })()}
        <TableCell></TableCell>
        <TableCell></TableCell>
        <TableCell>
          {thisYearIncomes.reduce((p, c) => p + c.amount * c.price, 0) -
            thisYearExpensesNotAmortization.reduce(
              (p, c) => p + c.amount * c.price,
              0
            )}
        </TableCell>
      </TableRow>
    </>
  );
}

export default CashFlowData;
