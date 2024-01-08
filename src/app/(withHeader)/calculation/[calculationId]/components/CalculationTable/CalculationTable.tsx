"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Text from "@/components/ui/Text";
import { PlusIcon, Trash2 } from "lucide-react";
import React, { Dispatch, SetStateAction, useState } from "react";
import { Cost } from "@prisma/client";
import { deleteCost } from "@/app/data/Cost.actions";
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

function PassiveRow(
  props: {
    data: RowType;
  } & (
    | {
        isOwner: true;
        setIsActive: Dispatch<SetStateAction<boolean>>;
      }
    | {
        isOwner: false;
      }
  )
) {
  const { data } = props;
  const cost = +data.amount * +data.price || 0;
  const router = useRouter();
  return (
    <TableRow
      onClick={() => {
        if (props.isOwner) props.setIsActive(true);
      }}
    >
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
      {props.isOwner ? (
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
      ) : null}
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

  return <PassiveRow data={data} setIsActive={setIsActive} isOwner />;
}

function CalculationTable({
  className,
  costs,
  calculationId,
  isOwner,
}: {
  className?: string;
  costs: Cost[];
  calculationId: number;
  isOwner: boolean;
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
          {isOwner ? <TableHead></TableHead> : null}
        </TableRow>
      </TableHeader>
      <TableBody>
        {displayedData.map((cost) => (
          <>
            {isOwner ? (
              <Row data={cost} key={cost.clientId} setData={setData} />
            ) : (
              <PassiveRow key={cost.clientId} data={cost} isOwner={isOwner} />
            )}
          </>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>
            {isOwner ? (
              <div className="flex justify-center items-center cursor-pointer">
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
            ) : null}
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
