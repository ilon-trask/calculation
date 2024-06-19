"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CostType, CostWithUnit } from "@/app/data/Cost.actions";
import PassiveRow from "./components/PasiveRow";
import { UnitOfMeasurement } from "@prisma/client";
import { DocsType } from "@/app/data/Docs";
import ActiveRow from "./components/ActiveRow";
import { TableHeadsType } from "../../../page";
import { Plus } from "lucide-react";
type partRow = Omit<CostWithUnit, "id" | "amount" | "price" | "type"> & {
  id?: number;
  isActive: boolean;
  clientId: number;
  amount: string | number;
};
type CalcType = partRow & {
  section: "Калькуляція (скорочена)";
  type: TypesOfType | "";
  price: string | number;
};
type AktType = partRow & {
  section: "Дефектний акт (скорочений)";
  note: string;
};
type SetType = partRow & {
  section: "Набір робіт, матеріалів та послуг";
  note: string;
};

export type RowType = partRow | CalcType | AktType | SetType;

export const typeArr = [
  { name: "Робота" },
  { name: "Послуга" },
  { name: "Матеріал" },
  { name: "Транспорт" },
  { name: "Не визначино" },
] as const;

export type TypesOfType = (typeof typeArr)[number]["name"];

function Row({
  data,
  setData,
  units,
  serverUserId,
  TABLE_HEADS,
}: {
  data: RowType;
  setData: Dispatch<SetStateAction<RowType[]>>;
  units: UnitOfMeasurement[];
  serverUserId: string;
  TABLE_HEADS: TableHeadsType;
}) {
  const [isActive, setIsActive] = useState(data.isActive);

  if (isActive)
    return (
      <ActiveRow
        data={data}
        TABLE_HEADS={TABLE_HEADS}
        setData={setData}
        setIsActive={setIsActive}
        units={units}
        serverUserId={serverUserId}
      />
    );

  return (
    <PassiveRow
      className="cursor-pointer"
      data={data}
      TABLE_HEADS={TABLE_HEADS}
      setIsActive={setIsActive}
      isOwner
    />
  );
}

function checkIsCalcOrInvoice(data: RowType[]): data is CalcType[] {
  if (
    data[0]?.section == "Калькуляція (скорочена)" ||
    data[0]?.section == "Рахунок фактура"
  )
    return true;
  return false;
}

function WorkSetTable({
  className,
  isOwner,
  costs,
  serverUserId,
  units,
  section,
  calculationId,
  TABLE_HEADS,
}: {
  className?: string;
  isOwner: boolean;
  costs: CostType[];
  units: UnitOfMeasurement[];
  serverUserId: string;
  section: DocsType;
  calculationId: number;
  TABLE_HEADS: TableHeadsType;
}) {
  const [data, setData] = useState<RowType[]>([]);

  const displayedData = [
    ...costs.map((el): RowType => {
      return {
        ...el,
        clientId: el.id,
        //@ts-ignore
        type: el.type as TypesOfType,
        isActive: false,
      };
    }),
    ...data,
  ];
  console.log(isOwner);

  return (
    <Table className={className}>
      <TableHeader>
        <TableRow>
          {TABLE_HEADS.map((el) => (
            <TableHead
              key={el.name}
              className={el.isNumber ? "text-right" : ""}
            >
              {el.name}
            </TableHead>
          ))}
          {isOwner ? <TableHead></TableHead> : null}
        </TableRow>
      </TableHeader>
      <TableBody>
        {displayedData.map((cost) => (
          <React.Fragment key={cost.clientId}>
            {isOwner ? (
              <Row
                data={cost}
                key={cost.clientId}
                setData={setData}
                units={units}
                serverUserId={serverUserId}
                TABLE_HEADS={TABLE_HEADS}
              />
            ) : (
              <PassiveRow
                key={cost.clientId}
                TABLE_HEADS={TABLE_HEADS}
                data={cost}
                isOwner={isOwner}
              />
            )}
          </React.Fragment>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>
            {isOwner ? (
              <div className="flex justify-center items-center cursor-pointer print:hidden">
                <Plus
                  strokeWidth={2.3}
                  onClick={() =>
                    setData(
                      //@ts-ignore
                      (prev) => [
                        ...prev,
                        {
                          clientId: costs.length + prev.length + 1,
                          name: "",
                          unitOfMeasurementId: "" as any,
                          isActive: true,
                          amount: "",
                          price: "",
                          type: "",
                          calculationId,
                          createdAt: new Date(),
                          updatedAt: new Date(),
                          section,
                          note: "",
                        },
                      ]
                    )
                  }
                />
              </div>
            ) : null}
          </TableCell>
          <TableCell colSpan={TABLE_HEADS.length - 2} />
          {checkIsCalcOrInvoice(displayedData) && (
            <TableCell className="text-right">
              Всього:
              {displayedData.reduce((p, c) => {
                if (c.amount === "" || c.price === "") return p;
                return p + (+c.amount ?? 1) * (+c.price ?? 1);
              }, 0)}
            </TableCell>
          )}
          <TableCell />
        </TableRow>
      </TableFooter>
    </Table>
  );
}

export default WorkSetTable;
