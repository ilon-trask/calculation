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
import React, { useEffect, useMemo, useState } from "react";
import { UnitOfMeasurement } from "@prisma/client";
import { BusType } from "@/app/data/Cost.actions";
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
  const [thisQuarter, setThisQuarter] = useState(
    quarters.find((el) => el.name == quarter)
  );
  useEffect(() => {
    setThisQuarter(quarters.find((el) => el.name == quarter));
  }, [quarter]);
  const [value, setValue] = useState(new Date().getFullYear());
  const [thisYearCosts, setThisYearCosts] = useState(
    //@ts-ignore
    costs.filter((el) => new Date(el.dateOfCost).getFullYear() == value)
  );
  useEffect(() => {
    setThisYearCosts(
      //@ts-ignore
      costs.filter((el) => new Date(el.dateOfCost).getFullYear() == value)
    );
  }, [costs]);
  const thisYear = useMemo(() => {
    setThisYearCosts(
      //@ts-ignore
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
                    //@ts-ignore
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4", //@ts-ignore
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
            <TableCell>Продукція, послуга</TableCell>
          </TableRow>
          <DataRows
            calculationId={calculationId}
            serverUserId={serverUserId}
            thisQuarter={thisQuarter}
            thisYearCosts={thisYearCosts.filter(
              (el) =>
                el.isIncome && (el.costSubtype == null || el.costSubtype == "")
            )}
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
            <TableCell>Амортизація</TableCell>
          </TableRow>
          <DataRows
            calculationId={calculationId}
            serverUserId={serverUserId}
            thisQuarter={thisQuarter}
            thisYearCosts={thisYearCosts.filter(
              (el) => !el.isIncome && el.costSubtype == "амортизація"
            )}
            units={units}
            costSubtype="амортизація"
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
                        i == //@ts-ignore
                          new Date(cost.dateOfCost).getMonth() + 1 &&
                        cost.isIncome
                    )
                    .reduce((p, c) => {
                      //@ts-ignore
                      return p + c.amount * c.price;
                    }, 0) -
                  thisYearCosts
                    .filter(
                      (cost) =>
                        i ==
                          //@ts-ignore
                          new Date(cost.dateOfCost).getMonth() + 1 &&
                        !cost.isIncome &&
                        cost.costSubtype != "амортизація"
                    )
                    .reduce((p, c) => {
                      //@ts-ignore
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
                        {
                          //@ts-ignore
                          arr[(thisQuarter.id - 1) * 3 + el]
                        }
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
            thisYearCosts={thisYearCosts.filter(
              (el) => !el.isIncome && el.costSubtype != "амортизація"
            )}
            units={units}
            costSubtype=""
            isPlus={false}
            isIncome={false}
          />
          <TableRow>
            <TableCell>Результат за період</TableCell>
            <TableCell></TableCell>
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
                  thisYearCosts
                    .filter(
                      (cost) =>
                        i ==
                          //@ts-ignore
                          new Date(cost.dateOfCost).getMonth() + 1 &&
                        cost.isIncome
                    )
                    .reduce((p, c) => {
                      //@ts-ignore
                      return p + c.amount * c.price;
                    }, 0) -
                  thisYearCosts
                    .filter(
                      (cost) =>
                        i == //@ts-ignore
                          new Date(cost.dateOfCost).getMonth() + 1 &&
                        !cost.isIncome &&
                        cost.costSubtype != "амортизація"
                    )
                    .reduce((p, c) => {
                      //@ts-ignore
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
                        {
                          //@ts-ignore
                          arr[(thisQuarter.id - 1) * 3 + el]
                        }
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
                  //@ts-ignore
                  return p + c.amount * c.price;
                }, 0) -
                thisYearCosts
                  .filter(
                    (cost) =>
                      !cost.isIncome && cost.costSubtype != "амортизація"
                  )
                  .reduce((p, c) => {
                    //@ts-ignore
                    return p + c.amount * c.price;
                  }, 0)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="uppercase">ІНВЕСТИЦІЇ</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Власні</TableCell>
          </TableRow>
          <DataRows
            calculationId={calculationId}
            serverUserId={serverUserId}
            thisQuarter={thisQuarter}
            thisYearCosts={thisYearCosts.filter(
              (el) => el.isIncome && el.costSubtype == "власні"
            )}
            units={units}
            costSubtype="власні"
            isPlus
            isIncome
          />
          <TableRow>
            <TableCell>Залучені позики</TableCell>
          </TableRow>
          <DataRows
            calculationId={calculationId}
            serverUserId={serverUserId}
            thisQuarter={thisQuarter}
            thisYearCosts={thisYearCosts.filter(
              (el) => el.isIncome && el.costSubtype == "залучені позики"
            )}
            units={units}
            costSubtype="залучені позики"
            isPlus
            isIncome
          />
        </TableBody>
      </Table>
    </>
  );
}

export default BusinessTable;
