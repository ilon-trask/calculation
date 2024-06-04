import { BusType } from "@/app/data/Cost.actions";
import { TableCell, TableRow } from "@/components/ui/table";
import React, { useEffect, useState } from "react";
import BusinessPopUp from "../../../BusinessPopUp";
import { PlusSquare } from "lucide-react";
import { UnitOfMeasurement } from "@prisma/client";
type ValueType = { dateOfCost: Date; price: number; amount: number };

type busTableType = Omit<BusType, "amount" | "price" | "dateOfCost"> & {
  values: ValueType[];
};
function DataRows({
  thisYearCosts,
  thisQuarter,
  calculationId,
  serverUserId,
  units,
  isPlus,
  isIncome,
  costSubtype,
}: {
  thisYearCosts: BusType[];
  thisQuarter: any;
  units: UnitOfMeasurement[];
  serverUserId: string;
  calculationId: number;
  isPlus: boolean;
  isIncome: boolean;
  costSubtype: string;
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
          { dateOfCost: el.dateOfCost!, amount: el.amount, price: el.price! },
        ],
      };

      for (let j = i + 1; j < costsArr.length; j++) {
        let insideEl = costsArr[j];
        if (
          el.name === insideEl.name &&
          el.unitOfMeasurementId === insideEl.unitOfMeasurementId
        ) {
          insideRes.values.push({
            amount: insideEl.amount,
            dateOfCost: insideEl.dateOfCost!,
            price: insideEl.price!,
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
          <TableCell>{cost.name}</TableCell>
          <TableCell>
            {
              //@ts-ignore
              cost.unitOfMeasurement.name
            }
          </TableCell>
          {Array.from({ length: 4 }, (_, index) => index + 1).map((el) => {
            console.log(
              (thisQuarter.id - 1) * 3 + el == //@ts-ignore
                new Date(cost.dateOfCost).getMonth() + 1
            );
            if (el == 4) {
              const yearSum = cost.values.reduce(
                (p, c) => p + c.amount * c.price,
                0
              );
              const yearAmount = cost.values.reduce((p, c) => p + c.amount, 0);
              return (
                <React.Fragment key={el}>
                  <TableCell>{yearAmount}</TableCell>
                  <TableCell>
                    {Math.round((yearSum / yearAmount) * 100) / 100}
                  </TableCell>
                  <TableCell>{yearSum}</TableCell>
                </React.Fragment>
              );
            }
            const costData = cost.values.find(
              (value) =>
                new Date(value.dateOfCost).getMonth() + 1 ==
                (thisQuarter.id - 1) * 3 + el
            );
            if (costData) {
              return (
                <React.Fragment key={el}>
                  <TableCell>{costData.amount}</TableCell>
                  <TableCell>{costData.price}</TableCell>
                  <TableCell>{costData.amount * costData.price!}</TableCell>
                </React.Fragment>
              );
            } else {
              return (
                <React.Fragment key={el}>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </React.Fragment>
              );
            }
          })}
        </TableRow>
      ))}
      {isPlus ? (
        <TableRow>
          <TableCell className="cursor-pointer">
            <BusinessPopUp
              units={units}
              serverUserId={serverUserId}
              calculationId={calculationId}
              isIncome={isIncome}
              costSubtype={costSubtype}
            >
              <PlusSquare />
            </BusinessPopUp>
          </TableCell>
        </TableRow>
      ) : null}
      <TableRow>
        <TableCell className="text-right">Всього</TableCell>
        <TableCell className="text-right"></TableCell>
        {Array.from({ length: 3 }, (_, index) => index + 1).map((el) => {
          const sum = thisYearCosts
            .filter(
              (cost) =>
                (thisQuarter.id - 1) * 3 + el == //@ts-ignore
                new Date(cost.dateOfCost).getMonth() + 1
            )
            .reduce((p, c) => {
              //@ts-ignore
              return p + c.amount * c.price;
            }, 0);

          return (
            <React.Fragment key={el}>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell>{sum}</TableCell>
            </React.Fragment>
          );
        })}
        <React.Fragment>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell>
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
