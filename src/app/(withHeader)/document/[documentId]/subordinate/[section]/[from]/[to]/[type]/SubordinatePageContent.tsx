"use client";
import { businessDocs } from "@/app/(withHeader)/document/[documentId]/components/Tables/BusinessTablePage/components/BusinessPlanSettings";
import { BusType, CostType } from "@/app/data/Cost.actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";
import { SubordinatePageProps } from "./page";

type Props = { costs: BusType[] } & SubordinatePageProps;

function getAmountOfMonths(from: string, to: string) {
  const fromMonth = new Date(from).getMonth();
  const toMonth = new Date(to).getMonth();
  const fromYear = new Date(from).getFullYear();
  const toYear = new Date(to).getFullYear();
  let amountOfMonths = 0;
  if (fromYear == toYear) amountOfMonths = toMonth - fromMonth;
  else {
    amountOfMonths = 12 - fromMonth;
    for (let i = 0; i < toYear - 1 - fromYear; i++) {
      amountOfMonths += 12;
    }
    amountOfMonths += toMonth;
  }
  return amountOfMonths;
}

function getCurrentDate(from: string, i: number) {
  const [year, month] = from.split("-");
  let date: Date | null = null;
  const newMonth = +month + i;
  if (newMonth < 12) date = new Date(year + "-" + newMonth);
  else {
    const plusYears = Math.floor(newMonth / 12);
    const plusMonths = (newMonth % 12) + 1;
    date = new Date(+year + plusYears + "-" + plusMonths);
  }
  return date;
}

function SubordinatePageContent({ params, costs }: Props) {
  if (params.type == "Incomes") {
    costs = costs.filter((el) => el.isIncome);
  } else if (params.type == "Expenses") {
    costs = costs.filter((el) => !el.isIncome);
    console.log("db");
  }
  console.log(params.type);
  return (
    <div>
      <p className="text-center font-semibold text-xl uppercase">
        {businessDocs.find((el) => el.link == params.section)?.name}
      </p>
      <p className="text-center">
        за період {params.from} по {params.to}
      </p>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Показник</TableHead>
            <TableHead>Виплати</TableHead>
            <TableHead>Надходженні</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            (() => {
              const res = [];
              let incomeAkk = 0,
                expenseAkk = 0;
              const amountOfMonths = getAmountOfMonths(params.from, params.to);
              for (let i = 0; i < amountOfMonths; i++) {
                const date = getCurrentDate(params.from, i);
                const thisMonthCosts = costs.filter((el) => {
                  const dateOfCost = new Date(el.dateOfCost || "");
                  return (
                    dateOfCost.getMonth() == date.getMonth() &&
                    dateOfCost.getFullYear() == date.getFullYear()
                  );
                });
                res.push(
                  <React.Fragment key={i}>
                    <TableRow>
                      <TableCell>
                        Залишок на початок :{" "}
                        {date.getFullYear() + "-" + (+date.getMonth() + 1)}
                      </TableCell>
                      <TableCell></TableCell>
                      <TableCell>{incomeAkk}</TableCell>
                    </TableRow>
                    {thisMonthCosts.map((el) => {
                      const cost = el.amount * el.price;
                      el.isIncome ? (incomeAkk += cost) : (expenseAkk += cost);
                      return (
                        <TableRow key={el.id}>
                          <TableCell>{el.name}</TableCell>
                          <TableCell>{el.isIncome ? null : cost}</TableCell>
                          <TableCell>{el.isIncome ? cost : null}</TableCell>
                        </TableRow>
                      );
                    })}
                    <TableRow className="font-bold">
                      <TableCell>Оборот за місяць</TableCell>
                      <TableCell>
                        {thisMonthCosts
                          .filter((el) => !el.isIncome)
                          .reduce((p, c) => p + c.amount * c.price, 0)}
                      </TableCell>
                      <TableCell>
                        {thisMonthCosts
                          .filter((el) => el.isIncome)
                          .reduce((p, c) => p + c.amount * c.price, 0)}
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                );
                incomeAkk = incomeAkk - expenseAkk;
                expenseAkk = 0;
                console.log(thisMonthCosts);
                console.log(date.getMonth());
              }
              return res;
            })()
            // costs.map((el) => (
            //   <TableRow key={el.id}>
            //     <TableCell>{el.name}</TableCell>
            //     <TableCell></TableCell>
            //     <TableCell>0</TableCell>
            //   </TableRow>
            // ))
          }
        </TableBody>
      </Table>
    </div>
  );
}

export default SubordinatePageContent;
