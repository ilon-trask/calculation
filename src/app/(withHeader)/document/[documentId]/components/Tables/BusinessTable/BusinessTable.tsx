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
import React, { useEffect, useState } from "react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CreateBusinessPlanDocPopUp from "./components/CreateBusinessPlanDocPopUp";

const quarters = [
  { id: 1, name: "1 квартал", children: ["Січень", "Лютий", "Березень"] },
  { id: 2, name: "2 квартал", children: ["Квітень", "Травень", "Червень"] },
  { id: 3, name: "3 квартал", children: ["Липень", "Серпень", "Вересень"] },
  { id: 4, name: "4 квартал", children: ["Жовтень", "Листопад", "Грудень"] },
] as const;
type quarterType = (typeof quarters)[number]["name"];

export const businessDocs = [
  {
    id: 1,
    name: "План руху грошових коштів",
    link: "business-plan-of-expenses",
  },
  {
    id: 2,
    name: "Калькуляція",
    link: "calculation",
  },
] as const;
export type businessDocType = (typeof businessDocs)[number]["name"] | "";

function BusinessTable({
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
  const [quarter, setQuarter] = useState<quarterType>("1 квартал");
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

  const [open, setOpen] = useState(false);
  const [docType, setDocType] = useState<businessDocType>("");
  const [isOpenDoc, setIsOpenDoc] = useState(false);
  if (!thisQuarter) throw new Error("thisQuarter is null");

  return (
    <>
      <div className="flex justify-between">
        <div>
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
              variant={quarter == el.name ? "default" : "outline"}
              onClick={() => {
                setQuarter(el.name);
              }}
            >
              {el.name}
            </Button>
          ))}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="h-10 px-4 py-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90">
            Розрахунокові документи
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {businessDocs.map((el) => (
              <DropdownMenuItem
                key={el.id}
                onClick={() => {
                  setIsOpenDoc(true);
                  setDocType(el.name);
                }}
                className="cursor-pointer"
              >
                {el.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <CreateBusinessPlanDocPopUp
          isOpen={isOpenDoc}
          setIsOpen={setIsOpenDoc}
          section={docType as businessDocType}
          serverUserId={serverUserId}
        />
      </div>
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
          <TableRow className="bg-black  hover:bg-black">
            <TableCell
              colSpan={120}
              className="text-center text-white uppercase hover:bg-black"
            >
              Розрахунок грошового потоку
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="uppercase font-semibold">
              Доходи <span className="lowercase">(Оплата)</span>
            </TableCell>
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
            thisYearCosts={thisYearCosts.filter(
              (el) => el.isIncome && el.costSubtype == "власні"
            )}
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
            thisYearCosts={thisYearCosts.filter(
              (el) => el.isIncome && el.costSubtype == "залучені позики"
            )}
            units={units}
            costSubtype="залучені позики"
            isPlus
            isIncome
            isOccurrence={false}
            isOwner={isOwner}
          />
          <TableRow>
            <TableCell className="uppercase font-semibold">
              Витрати <span className="lowercase">(операційні)</span>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Витрати постійні</TableCell>
          </TableRow>
          <DataRows
            calculationId={calculationId}
            serverUserId={serverUserId}
            thisQuarter={thisQuarter}
            thisYearCosts={thisYearCosts.filter(
              (el) =>
                !el.isIncome &&
                el.costSubtype == "витрати постійні" &&
                el.activityType == "операційна"
            )}
            units={units}
            costSubtype="витрати постійні"
            isPlus
            isIncome={false}
            isOccurrence={false}
            activityType="операційна"
            isOwner={isOwner}
          />
          {/* <TableRow>
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
            isOccurrence={false}
          /> */}
          <TableRow>
            <TableCell>Витрати заг-вир</TableCell>
          </TableRow>
          <DataRows
            calculationId={calculationId}
            serverUserId={serverUserId}
            thisQuarter={thisQuarter}
            thisYearCosts={thisYearCosts.filter(
              (el) =>
                !el.isIncome &&
                el.costSubtype == "витрати заг-вир" &&
                el.activityType == "операційна"
            )}
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
            thisYearCosts={thisYearCosts.filter(
              (el) =>
                !el.isIncome &&
                el.costSubtype == "витрати прямі" &&
                el.activityType == "операційна"
            )}
            units={units}
            costSubtype="витрати прямі"
            isPlus
            isIncome={false}
            isOccurrence={false}
            activityType="операційна"
            isOwner={isOwner}
          />
          <TableRow>
            <TableCell className="uppercase font-semibold">
              Витрати <span className="lowercase">(інвестиційні)</span>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Витрати постійні</TableCell>
          </TableRow>
          <DataRows
            calculationId={calculationId}
            serverUserId={serverUserId}
            thisQuarter={thisQuarter}
            thisYearCosts={thisYearCosts.filter(
              (el) =>
                !el.isIncome &&
                el.costSubtype == "витрати постійні" &&
                el.activityType == "інвестиційна"
            )}
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
            thisYearCosts={thisYearCosts.filter(
              (el) =>
                !el.isIncome &&
                el.costSubtype == "витрати заг-вир" &&
                el.activityType == "інвестиційна"
            )}
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
            thisYearCosts={thisYearCosts.filter(
              (el) =>
                !el.isIncome &&
                el.costSubtype == "витрати прямі" &&
                el.activityType == "інвестиційна"
            )}
            units={units}
            costSubtype="витрати прямі"
            isPlus
            isIncome={false}
            isOccurrence
            activityType="інвестиційна"
            isOwner={isOwner}
          />
          <TableRow>
            <TableCell className="uppercase font-semibold">
              Рух коштів
            </TableCell>
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
                        i == new Date(cost.dateOfCost || "").getMonth() + 1 &&
                        cost.isIncome
                    )
                    .reduce((p, c) => p + c.amount * c.price, 0) -
                  thisYearCosts
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
            thisYearCosts={thisYearCosts.filter(
              (el) =>
                !el.isIncome &&
                el.costSubtype != "амортизація" &&
                el.activityType == "операційна"
            )}
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
                  thisYearCosts
                    .filter(
                      (cost) =>
                        i == new Date(cost.dateOfCost || "").getMonth() + 1 &&
                        cost.isIncome
                    )
                    .reduce((p, c) => p + c.amount * c.price, 0) -
                  thisYearCosts
                    .filter(
                      (cost) =>
                        i == new Date(cost.dateOfCost || "").getMonth() + 1 &&
                        !cost.isIncome &&
                        cost.costSubtype != "амортизація"
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
                      <TableCell>
                        {arr[(thisQuarter.id - 1) * 3 + el]}
                      </TableCell>
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
                  thisYearCosts
                    .filter(
                      (cost) =>
                        i == new Date(cost.dateOfCost || "").getMonth() + 1 &&
                        cost.isIncome
                    )
                    .reduce((p, c) => p + c.amount * c.price, 0) -
                  thisYearCosts
                    .filter(
                      (cost) =>
                        i == new Date(cost.dateOfCost || "").getMonth() + 1 &&
                        !cost.isIncome &&
                        cost.costSubtype != "амортизація"
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
                .reduce((p, c) => p + c.amount * c.price, 0) -
                thisYearCosts
                  .filter(
                    (cost) =>
                      !cost.isIncome && cost.costSubtype != "амортизація"
                  )
                  .reduce((p, c) => p + c.amount * c.price, 0)}
            </TableCell>
          </TableRow>
          <TableRow className="bg-black  hover:bg-black">
            <TableCell
              colSpan={120}
              className="text-center text-white uppercase hover:bg-black"
            >
              Розрахунок прибутку
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="uppercase font-semibold">
              Доходи <span className="lowercase">(виникнення)</span>
            </TableCell>
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
            isOccurrence
            isOwner={isOwner}
          />
          <TableRow>
            <TableCell className="uppercase font-semibold">
              Витрати <span className="lowercase">(операційні)</span>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Витрати постійні</TableCell>
          </TableRow>
          <DataRows
            calculationId={calculationId}
            serverUserId={serverUserId}
            thisQuarter={thisQuarter}
            thisYearCosts={thisYearCosts.filter(
              (el) =>
                !el.isIncome &&
                el.costSubtype == "витрати постійні" &&
                el.activityType == "операційна"
            )}
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
            thisYearCosts={thisYearCosts.filter(
              (el) =>
                !el.isIncome &&
                el.costSubtype == "амортизація" &&
                el.activityType == "операційна"
            )}
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
            thisYearCosts={thisYearCosts.filter(
              (el) =>
                !el.isIncome &&
                el.costSubtype == "витрати заг-вир" &&
                el.activityType == "операційна"
            )}
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
            thisYearCosts={thisYearCosts.filter(
              (el) =>
                !el.isIncome &&
                el.costSubtype == "витрати прямі" &&
                el.activityType == "операційна"
            )}
            units={units}
            costSubtype="витрати прямі"
            isPlus
            isIncome={false}
            isOccurrence
            activityType="операційна"
            isOwner={isOwner}
          />
          <TableRow>
            <TableCell className="uppercase font-semibold">Прибуток</TableCell>
          </TableRow>
          <TableRow></TableRow>
          <TableRow>
            <TableCell>Прибуток за період</TableCell> <TableCell></TableCell>
            {(() => {
              const arr: number[] = [0];
              for (let i = 0; i < 12; i++) {
                const sum =
                  thisYearCosts
                    .filter(
                      (cost) =>
                        i == new Date(cost.dateOfOccurrence || "").getMonth() &&
                        cost.isIncome &&
                        (cost.costSubtype == null || cost.costSubtype == "")
                    )
                    .reduce((p, c) => p + c.amount * c.price, 0) -
                  thisYearCosts
                    .filter(
                      (cost) =>
                        i == new Date(cost.dateOfOccurrence || "").getMonth() &&
                        !cost.isIncome
                    )
                    .reduce((p, c) => p + c.amount * c.price, 0);
                arr.push(sum);
              }
              return (
                <>
                  {Array.from({ length: 3 }, (_, index) => index + 1).map(
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
                  )}
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
                  thisYearCosts
                    .filter(
                      (cost) =>
                        i == new Date(cost.dateOfOccurrence || "").getMonth() &&
                        cost.isIncome &&
                        (cost.costSubtype == null || cost.costSubtype == "")
                    )
                    .reduce((p, c) => p + c.amount * c.price, 0) -
                  thisYearCosts
                    .filter(
                      (cost) =>
                        i == new Date(cost.dateOfOccurrence || "").getMonth() &&
                        !cost.isIncome
                    )
                    .reduce((p, c) => p + c.amount * c.price, 0);
                prevMonth = sum;
                arr.push(sum);
              }
              return (
                <React.Fragment>
                  {Array.from({ length: 3 }, (_, index) => index + 1).map(
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
                  )}
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
          </TableRow>{" "}
        </TableBody>
        <TableRow className="bg-black  hover:bg-black">
          <TableCell
            colSpan={120}
            className="text-center text-white uppercase hover:bg-black"
          >
            Розрахунок інвестицій
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="uppercase font-semibold">
            Витрати <span className="lowercase">(інвестиційні)</span>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Витрати постійні</TableCell>
        </TableRow>
        <DataRows
          calculationId={calculationId}
          serverUserId={serverUserId}
          thisQuarter={thisQuarter}
          thisYearCosts={thisYearCosts.filter(
            (el) =>
              !el.isIncome &&
              el.costSubtype == "витрати постійні" &&
              el.activityType == "інвестиційна"
          )}
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
          thisYearCosts={thisYearCosts.filter(
            (el) =>
              !el.isIncome &&
              el.costSubtype == "витрати заг-вир" &&
              el.activityType == "інвестиційна"
          )}
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
          thisYearCosts={thisYearCosts.filter(
            (el) =>
              !el.isIncome &&
              el.costSubtype == "витрати прямі" &&
              el.activityType == "інвестиційна"
          )}
          units={units}
          costSubtype="витрати прямі"
          isPlus
          isIncome={false}
          isOccurrence
          activityType="інвестиційна"
          isOwner={isOwner}
        />

        <TableRow>
          <TableCell className="uppercase font-semibold">Інвестиції</TableCell>
        </TableRow>
        <TableRow></TableRow>
        <TableRow>
          <TableCell>Інвестиції за період</TableCell> <TableCell></TableCell>
          {(() => {
            const arr: number[] = [0];
            for (let i = 0; i < 12; i++) {
              const sum = thisYearCosts
                .filter(
                  (cost) =>
                    i == new Date(cost.dateOfOccurrence || "").getMonth() &&
                    !cost.isIncome &&
                    cost.activityType == "інвестиційна"
                )
                .reduce((p, c) => p + c.amount * c.price, 0);
              arr.push(sum);
            }
            return (
              <>
                {Array.from({ length: 3 }, (_, index) => index + 1).map(
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
                )}
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
                thisYearCosts
                  .filter(
                    (cost) =>
                      i == new Date(cost.dateOfOccurrence || "").getMonth() &&
                      !cost.isIncome &&
                      cost.activityType == "інвестиційна"
                  )
                  .reduce((p, c) => p + c.amount * c.price, 0);
              prevMonth = sum;
              arr.push(sum);
            }
            return (
              <React.Fragment>
                {Array.from({ length: 3 }, (_, index) => index + 1).map(
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
                )}
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell>{arr[arr.length - 1]}</TableCell>
              </React.Fragment>
            );
          })()}
        </TableRow>
      </Table>
    </>
  );
}

export default BusinessTable;
