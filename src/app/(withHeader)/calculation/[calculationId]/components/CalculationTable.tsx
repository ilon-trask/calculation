"use client";
import { Combobox } from "@/app/(withHeader)/calculation/[calculationId]/components/combobox";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Text from "@/components/ui/Text";
import { PlusIcon, Trash2 } from "lucide-react";
import React, { useState } from "react";

type RowType = {
  id: number;
  name: string;
  unitOfMeasurement: string;
  isActive: boolean;
} & (
  | {
      workAmount: string | number;
      workPrice: string | number;
    }
  | {
      serviceAmount: string | number;
      servicePrice: string | number;
    }
  | {
      materialAmount: string | number;
      materialPrice: string | number;
    }
  | {
      transportAmount: string | number;
      transportPrice: string | number;
    }
  | {}
);

const type = [
  { name: "work" },
  { name: "service" },
  { name: "material" },
  { name: "transport" },
] as const;

function ActiveRow({ data }: { data: RowType }) {
  const [rowState, setRowState] = useState<RowType>(data);
  const cost =
    +rowState.workAmount * +rowState.workPrice ||
    +rowState.serviceAmount * +rowState.servicePrice ||
    +rowState.materialAmount * +rowState.materialPrice ||
    +rowState.transportAmount * +rowState.transportPrice ||
    0;
  return (
    <TableRow>
      <TableCell className="font-medium">
        <Input
          value={rowState.name}
          onChange={(event) =>
            setRowState((prev) => ({ ...prev, name: event.target.value }))
          }
        />
      </TableCell>
      <TableCell>
        <Combobox />
      </TableCell>
      {type.map((e) => (
        <TableCell key={e.name}>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Кіль."
              value={rowState[e.name + "Amount"]}
              onChange={(event) =>
                setRowState((prev) => ({
                  ...prev,
                  [e.name + "Amount"]: event.target.value,
                }))
              }
            />{" "}
            /{" "}
            <Input
              type="number"
              placeholder="Ціна"
              value={rowState[e.name + "Price"]}
              onChange={(event) =>
                setRowState((prev) => ({
                  ...prev,
                  [e.name + "Price"]: event.target.value,
                }))
              }
            />
          </div>
        </TableCell>
      ))}
      <TableCell className="text-right">{cost}</TableCell>
      <TableCell>
        <Trash2 />
      </TableCell>
    </TableRow>
  );
}
function PassiveRow({ data }: { data: RowType }) {
  const cost =
    +data.workAmount * +data.workPrice ||
    +data.serviceAmount * +data.servicePrice ||
    +data.materialAmount * +data.materialPrice ||
    +data.transportAmount * +data.transportPrice ||
    0;
  return (
    <TableRow>
      <TableCell className="font-medium">
        <Text>{data.name}</Text>
      </TableCell>
      <TableCell>
        <Text>{data.unitOfMeasurement}</Text>
      </TableCell>
      {type.map((e) => (
        <>
          {data[e.name + "Amount"] || data[e.name + "Price"] ? (
            <TableCell key={e.name}>
              <div className="flex items-center gap-2">
                <Text>{data[e.name + "Amount"]}</Text> /{" "}
                <Text>{data[e.name + "Price"]}</Text>
              </div>
            </TableCell>
          ) : (
            <TableCell />
          )}
        </>
      ))}
      <TableCell className="text-right">{cost}</TableCell>
      <TableCell>
        <Trash2 />
      </TableCell>
    </TableRow>
  );
}

function Row({ data }: { data: RowType }) {
  const [isActive, setIsActive] = useState(data.isActive);

  return (
    <>{isActive ? <ActiveRow data={data} /> : <PassiveRow data={data} />}</>
  );
}

function CalculationTable({ className }: { className?: string }) {
  const [data, setData] = useState<RowType[]>([
    {
      id: 1,
      name: "lsjkdf",
      unitOfMeasurement: "кг",
      isActive: false,
      materialAmount: 10,
      materialPrice: 4,
    },
    {
      id: 2,
      name: "lhnls",
      unitOfMeasurement: "год",
      isActive: false,
      serviceAmount: 10,
      servicePrice: 4,
    },
  ]);
  return (
    <Table className={className}>
      <TableHeader>
        <TableRow>
          <TableHead>Назва</TableHead>
          <TableHead>Одиниці виміру</TableHead>
          <TableHead>Робота</TableHead>
          <TableHead>Послуги</TableHead>
          <TableHead>Матеріали</TableHead>
          <TableHead>Транспорт</TableHead>
          <TableHead className="text-right">Всього</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((invoice) => (
          <Row data={invoice} key={invoice.id} />
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell className="cursor-pointer">
            <div className="flex justify-center items-center">
              <PlusIcon
                onClick={() =>
                  setData((prev) => [
                    ...prev,
                    {
                      id: prev.length + 1,
                      name: "",
                      unitOfMeasurement: "",
                      isActive: true,
                    },
                  ])
                }
              />
            </div>
          </TableCell>
          <TableCell colSpan={7}></TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}

export default CalculationTable;
