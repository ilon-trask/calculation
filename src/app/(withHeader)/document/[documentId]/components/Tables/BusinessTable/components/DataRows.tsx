import { BusType } from "@/app/data/Cost.actions";
import { TableCell, TableRow } from "@/components/ui/table";
import React, { useEffect, useState } from "react";
import CreateBusinessRowPopUp from "../../../CreateBusinessRowPopUp";
import { PlusSquare, HelpCircle, PenSquare } from "lucide-react";
import { UnitOfMeasurement } from "@prisma/client";
import BusinessPlanHelpAlert from "../../../BusinessPlanHelpAlert";
import UpdateBusinessRowPopUp from "../../../UpdateBusinessRowPopUp";

export type busTableValueType = {
  id: number;
  dateOfCost: Date;
  price: number | "";
  amount: number | "";
  dateOfOccurrence: Date;
};

export type busTableType = Omit<BusType, "amount" | "price" | "dateOfCost"> & {
  values: busTableValueType[];
};

function choseDate(isOccurrence: boolean, cost: busTableType) {
  if (isOccurrence) {
    return cost.dateOfOccurrence;
  }
  //@ts-ignore
  return cost.dateOfCost;
}

function DataRows({
  thisYearCosts,
  thisQuarter,
  calculationId,
  serverUserId,
  units,
  isPlus,
  isIncome,
  costSubtype,
  isOccurrence,
}: {
  thisYearCosts: BusType[];
  thisQuarter: any;
  units: UnitOfMeasurement[];
  serverUserId: string;
  calculationId: number;
  isPlus: boolean;
  isIncome: boolean;
  costSubtype: string;
  isOccurrence: boolean;
}) {
  const [preparedCosts, setPreparedCosts] = useState<busTableType[]>([]);

  useEffect(() => {
    const costsArr: BusType[] = JSON.parse(JSON.stringify(thisYearCosts));
    console.log(costsArr);
    const res: busTableType[] = [];

    for (let i = 0; i < costsArr.length; i++) {
      let el = costsArr[i];
      let insideRes = {
        ...el,
        values: [
          {
            id: el.id,
            dateOfCost: el.dateOfCost!,
            amount: el.amount,
            price: el.price!,
            dateOfOccurrence: el.dateOfOccurrence!,
          },
        ],
      };

      for (let j = i + 1; j < costsArr.length; j++) {
        let insideEl = costsArr[j];
        if (
          el.name === insideEl.name &&
          el.unitOfMeasurementId === insideEl.unitOfMeasurementId
        ) {
          insideRes.values.push({
            id: insideEl.id,
            amount: insideEl.amount,
            dateOfCost: insideEl.dateOfCost!,
            price: insideEl.price!,
            dateOfOccurrence: insideEl.dateOfOccurrence!,
          });
          costsArr.splice(j, 1);
          j--;
        }
      }
      res.push(insideRes);
    }

    setPreparedCosts(res);
  }, [JSON.stringify(thisYearCosts)]);
  console.log(preparedCosts);
  return (
    <>
      {preparedCosts.map((cost) => (
        <TableRow key={cost.id}>
          <TableCell>
            <div className="flex items-center">
              <UpdateBusinessRowPopUp
                data={cost}
                serverUserId={serverUserId}
                units={units}
              >
                <PenSquare className="cursor-pointer" />
              </UpdateBusinessRowPopUp>
              {cost.name}
            </div>
          </TableCell>
          <TableCell>
            {
              //@ts-ignore
              cost.unitOfMeasurement.name
            }
          </TableCell>
          {Array.from({ length: 4 }, (_, index) => index + 1).map((el) => {
            console.log(
              (thisQuarter.id - 1) * 3 + el ==
                new Date(choseDate(isOccurrence, cost)).getMonth() + 1
            );
            if (el == 4) {
              const yearSum = cost.values.reduce(
                (p, c) => p + +c.amount * +c.price,
                0
              );
              const yearAmount = cost.values.reduce((p, c) => p + +c.amount, 0);
              return (
                <React.Fragment key={el}>
                  <TableCell>{yearAmount}</TableCell>
                  <TableCell>
                    {Math.round((yearSum / yearAmount) * 100) / 100}
                  </TableCell>
                  <TableCell className="bg-slate-100">{yearSum}</TableCell>
                </React.Fragment>
              );
            }
            const costData = cost.values.find(
              (value) =>
                //@ts-ignore
                new Date(choseDate(isOccurrence, value)).getMonth() + 1 ==
                (thisQuarter.id - 1) * 3 + el
            );
            if (costData) {
              return (
                <React.Fragment key={el}>
                  <TableCell>{costData.amount}</TableCell>
                  <TableCell>{costData.price}</TableCell>
                  <TableCell className="bg-slate-100">
                    {+costData.amount * +costData.price!}
                  </TableCell>
                </React.Fragment>
              );
            } else {
              return (
                <React.Fragment key={el}>
                  <TableCell>0</TableCell>
                  <TableCell>0</TableCell>
                  <TableCell>0</TableCell>
                </React.Fragment>
              );
            }
          })}
        </TableRow>
      ))}

      <TableRow>
        <TableCell>
          <div className="flex items-center justify-between">
            {isPlus ? (
              <CreateBusinessRowPopUp
                units={units}
                serverUserId={serverUserId}
                calculationId={calculationId}
                isIncome={isIncome}
                costSubtype={costSubtype}
                costs={preparedCosts}
              >
                <PlusSquare className="cursor-pointer" />
              </CreateBusinessRowPopUp>
            ) : null}
            <BusinessPlanHelpAlert>
              <HelpCircle className="cursor-pointer" />
            </BusinessPlanHelpAlert>
          </div>
        </TableCell>
        <TableCell className="text-right">Всього</TableCell>
        {Array.from({ length: 3 }, (_, index) => index + 1).map((el) => {
          const sum = thisYearCosts
            .filter(
              (cost) =>
                (thisQuarter.id - 1) * 3 + el == //@ts-ignore
                new Date(choseDate(isOccurrence, cost)).getMonth() + 1
            )
            .reduce((p, c) => {
              //@ts-ignore
              return p + c.amount * c.price;
            }, 0);

          return (
            <React.Fragment key={el}>
              <TableCell className="bg-slate-100"></TableCell>
              <TableCell className="bg-slate-100"></TableCell>
              <TableCell className="bg-slate-100">{sum}</TableCell>
            </React.Fragment>
          );
        })}
        <React.Fragment>
          <TableCell className="bg-slate-100"></TableCell>
          <TableCell className="bg-slate-100"></TableCell>
          <TableCell className="bg-slate-100">
            {thisYearCosts.reduce((p, c) => {
              //@ts-ignore
              return p + c.amount * c.price;
            }, 0)}
          </TableCell>
        </React.Fragment>
      </TableRow>
    </>
  );
}

export default DataRows;
