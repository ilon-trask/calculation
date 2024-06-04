"use client";
import { Button } from "@/components/ui/button";
import {
  TableHead,
  TableHeader,
  Table,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { PlusSquare } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import BusinessPopUp from "../../BusinessPopUp";
import { UnitOfMeasurement } from "@prisma/client";
import { BusType, CostType } from "@/app/data/Cost.actions";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import DataRows from "./components/DataRows";

const quarters = [
  { id: 1, name: "1 квартал", children: ["Січень", "Лютий", "Березень"] },
  { id: 2, name: "2 квартал", children: ["Квітень", "Травень", "Червень"] },
  { id: 3, name: "3 квартал", children: ["Липень", "Серпень", "Вересень"] },
  { id: 4, name: "4 квартал", children: ["Жовтень", "Листопад", "Грудень"] },
] as const;
type quarterType = (typeof quarters)[number]["name"];

function BusinessTable({
  units,
  serverUserId,
  calculationId,
  costs,
}: {
  units: UnitOfMeasurement[];
  serverUserId: string;
  calculationId: number;
  costs: BusType[];
}) {
  const [quarter, setQuarter] = useState<quarterType>("1 квартал");
  const thisQuarter = useMemo(
    () => quarters.find((el) => el.name == quarter),
    [quarter]
  );
  const [value, setValue] = useState(new Date().getFullYear());
  const [thisYearCosts, setThisYearCosts] = useState(
    costs.filter((el) => new Date(el.dateOfCost).getFullYear() == value)
  );
  const thisYear = useMemo(() => {
    setThisYearCosts(
      costs.filter((el) => new Date(el.dateOfCost).getFullYear() == value)
    );
  }, [value]);

  const [open, setOpen] = useState(false);

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild onClick={() => setOpen(true)}>
          <Button>{value}</Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandGroup>
              {[
                2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029,
                2030,
              ].map((year: number) => (
                <CommandItem
                  key={year}
                  value={year + ""}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value == year + "" ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {year}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      {quarters.map((el) => (
        <Button
          key={el.name}
          variant={"outline"}
          onClick={() => {
            setQuarter(el.name);
          }}
        >
          {el.name}
        </Button>
      ))}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead rowSpan={2}>Показники</TableHead>
            <TableHead rowSpan={2}>Одиниці виміру</TableHead>
            {thisQuarter?.children.map((el) => (
              <TableHead colSpan={3} key={el}>
                {el}
              </TableHead>
            ))}

            <TableHead colSpan={3}>Рік</TableHead>
          </TableRow>
          <TableRow>
            {Array.from({ length: 4 }, (_, index) => index + 1).map((el) => {
              return (
                <React.Fragment key={el}>
                  <TableCell>Кількість</TableCell>
                  <TableCell>Ціна</TableCell>
                  <TableCell>Сума</TableCell>
                </React.Fragment>
              );
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="uppercase">Маркетинг</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Номенклатура</TableCell>
          </TableRow>
          <DataRows
            calculationId={calculationId}
            serverUserId={serverUserId}
            thisQuarter={thisQuarter}
            thisYearCosts={thisYearCosts.filter((el) => el.isIncome)}
            units={units}
            costSubtype=""
            isPlus
            isIncome
          />
          <TableRow>
            <TableCell className="uppercase">Витрати</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Витрати постійні</TableCell>
          </TableRow>
          <DataRows
            calculationId={calculationId}
            serverUserId={serverUserId}
            thisQuarter={thisQuarter}
            thisYearCosts={thisYearCosts.filter(
              (el) => !el.isIncome && el.costSubtype == "витрати постійні"
            )}
            units={units}
            costSubtype="витрати постійні"
            isPlus
            isIncome={false}
          />
          <TableRow>
            <TableCell>Витрати заг-вир</TableCell>
          </TableRow>
          <DataRows
            calculationId={calculationId}
            serverUserId={serverUserId}
            thisQuarter={thisQuarter}
            thisYearCosts={thisYearCosts.filter(
              (el) => !el.isIncome && el.costSubtype == "витрати заг-вир"
            )}
            units={units}
            costSubtype="витрати заг-вир"
            isPlus
            isIncome={false}
          />
          <TableRow>
            <TableCell>Витрати прямі</TableCell>
          </TableRow>
          <DataRows
            calculationId={calculationId}
            serverUserId={serverUserId}
            thisQuarter={thisQuarter}
            thisYearCosts={thisYearCosts.filter(
              (el) => !el.isIncome && el.costSubtype == "витрати прямі"
            )}
            units={units}
            costSubtype="витрати прямі"
            isPlus
            isIncome={false}
          />
          <TableRow>
            <TableCell className="uppercase">Рух грошовиї коштів</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Залишок на початок</TableCell> <TableCell></TableCell>
            {(() => {
              let prevMonth = 0;
              const arr: number[] = [0];
              for (let i = 0; i < 12; i++) {
                const sum =
                  prevMonth +
                  thisYearCosts
                    .filter(
                      (cost) =>
                        i == new Date(cost.dateOfCost).getMonth() + 1 &&
                        cost.isIncome
                    )
                    .reduce((p, c) => {
                      return p + c.amount * c.price;
                    }, 0) -
                  thisYearCosts
                    .filter(
                      (cost) =>
                        i == new Date(cost.dateOfCost).getMonth() + 1 &&
                        !cost.isIncome
                    )
                    .reduce((p, c) => {
                      return p + c.amount * c.price;
                    }, 0);
                prevMonth = sum;
                arr.push(sum);
              }
              return Array.from({ length: 3 }, (_, index) => index + 1).map(
                (el) => {
                  return (
                    <React.Fragment key={el}>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell>
                        {arr[(thisQuarter.id - 1) * 3 + el]}
                      </TableCell>
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
            thisYearCosts={thisYearCosts.filter((el) => el.isIncome)}
            units={units}
            costSubtype=""
            isPlus={false}
            isIncome
          />
          <TableRow>
            <TableCell>Відтік Виплати</TableCell>
          </TableRow>
          <DataRows
            calculationId={calculationId}
            serverUserId={serverUserId}
            thisQuarter={thisQuarter}
            thisYearCosts={thisYearCosts.filter((el) => !el.isIncome)}
            units={units}
            costSubtype=""
            isPlus={false}
            isIncome={false}
          />
          <TableRow>
            <TableCell>Залишок на кінець</TableCell>
            <TableCell></TableCell>
            {(() => {
              let prevMonth = 0;
              const arr: number[] = [];
              for (let i = 0; i < 12; i++) {
                const sum =
                  prevMonth +
                  thisYearCosts
                    .filter(
                      (cost) =>
                        i == new Date(cost.dateOfCost).getMonth() + 1 &&
                        cost.isIncome
                    )
                    .reduce((p, c) => {
                      return p + c.amount * c.price;
                    }, 0) -
                  thisYearCosts
                    .filter(
                      (cost) =>
                        i == new Date(cost.dateOfCost).getMonth() + 1 &&
                        !cost.isIncome
                    )
                    .reduce((p, c) => {
                      return p + c.amount * c.price;
                    }, 0);
                prevMonth = sum;
                arr[i] = sum;
              }
              return Array.from({ length: 3 }, (_, index) => index + 1).map(
                (el) => {
                  return (
                    <React.Fragment key={el}>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell>
                        {arr[(thisQuarter.id - 1) * 3 + el]}
                      </TableCell>
                    </React.Fragment>
                  );
                }
              );
            })()}
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell>
              {thisYearCosts
                .filter((cost) => cost.isIncome)
                .reduce((p, c) => {
                  return p + c.amount * c.price;
                }, 0) -
                thisYearCosts
                  .filter((cost) => !cost.isIncome)
                  .reduce((p, c) => {
                    return p + c.amount * c.price;
                  }, 0)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
}

export default BusinessTable;
