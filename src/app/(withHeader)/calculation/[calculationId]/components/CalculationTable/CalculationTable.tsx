"use client";
import { Input } from "@/components/ui/input";
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
import { Plus, PlusIcon, Trash2 } from "lucide-react";
import React, {
  Dispatch,
  SetStateAction,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Cost } from "@prisma/client";
import { createCost, deleteCost } from "@/app/data/Cost.actions";
import { useRouter } from "next/navigation";
import ActiveRow from "./components/ActiveRow";
import DeleteDialog from "@/app/(withHeader)/components/DeleteDialog";

export type RowType = Omit<Cost, "id" | "amount" | "price" | "type"> & {
  id?: number;
  isActive: boolean;
  clientId: number;
  amount: string | number;
  price: string | number;
  type: TypesOfType | "";
};

export const typeArr = [
  { name: "Робота" },
  { name: "Послуга" },
  { name: "Матеріал" },
  { name: "Транспорт" },
] as const;

export type TypesOfType = (typeof typeArr)[number]["name"];

function PassiveRow({
  data,
  setData,
  setIsActive,
}: {
  data: RowType;
  setData: Dispatch<SetStateAction<RowType[]>>;
  setIsActive: Dispatch<SetStateAction<boolean>>;
}) {
  const cost = +data.amount * +data.price || 0;
  const router = useRouter();
  return (
    <TableRow onClick={() => setIsActive(true)}>
      <TableCell className="font-medium">
        <Text>{data.name}</Text>
      </TableCell>
      <TableCell>
        <Text>{data.unitOfMeasurement}</Text>
      </TableCell>
      <TableCell>
        <Text>{data.type}</Text>
      </TableCell>
      <TableCell>
        <Text className="text-right">{data.amount}</Text>
      </TableCell>
      <TableCell>
        <Text className="text-right">{data.price}</Text>
      </TableCell>
      <TableCell className="text-right">{cost}</TableCell>
      <TableCell>
        <DeleteDialog
          title="витрату"
          func={async () => {
            await deleteCost(data.id!);
            router.refresh();
          }}
        >
          <Trash2 />
        </DeleteDialog>
      </TableCell>
    </TableRow>
  );
}

function Row({
  data,
  setData,
}: {
  data: RowType;
  setData: Dispatch<SetStateAction<RowType[]>>;
}) {
  const [isActive, setIsActive] = useState(data.isActive);

  if (isActive)
    return (
      <ActiveRow data={data} setData={setData} setIsActive={setIsActive} />
    );

  return <PassiveRow data={data} setIsActive={setIsActive} setData={setData} />;
}

function CalculationTable({
  className,
  costs,
  calculationId,
}: {
  className?: string;
  costs: Cost[];
  calculationId: number;
}) {
  const [data, setData] = useState<RowType[]>([]);
  const displayedData = [
    ...costs.map(
      (el): RowType => ({
        ...el,
        clientId: el.id,
        type: el.type as TypesOfType,
        isActive: false,
      })
    ),
    ...data,
  ];
  return (
    <Table className={className}>
      <TableHeader>
        <TableRow>
          <TableHead>Назва</TableHead>
          {/* <TableHead className="w-[180px]">Назва</TableHead> */}
          <TableHead>Одиниці виміру</TableHead>
          <TableHead>Тип</TableHead>
          <TableHead className="text-right ">Кількість</TableHead>
          <TableHead className="text-right ">Ціна</TableHead>
          <TableHead className="text-right">Сума</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {displayedData.map((invoice) => (
          <Row data={invoice} key={invoice.clientId} setData={setData} />
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
                      clientId: costs.length + prev.length + 1,
                      name: "",
                      unitOfMeasurement: "",
                      isActive: true,
                      amount: "",
                      price: "",
                      type: "",
                      calculationId,
                      createdAt: new Date(),
                      updatedAt: new Date(),
                    },
                  ])
                }
              />
            </div>
          </TableCell>
          <TableCell colSpan={4} />
          <TableCell className="text-right">
            Всього:
            {displayedData.reduce((p, c) => {
              if (c.amount === "" || c.price === "") return p;
              return p + (+c.amount ?? 1) * (+c.price ?? 1);
            }, 0)}
          </TableCell>
          <TableCell />
        </TableRow>
      </TableFooter>
    </Table>
  );
}

export default CalculationTable;
