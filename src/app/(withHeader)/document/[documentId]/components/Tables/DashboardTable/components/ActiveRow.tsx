"use client";

import { createCost, deleteCost, updateCost } from "@/app/data/Cost.actions";
import { AktType, CalcType, RowType, TypesOfType } from "../DashboardTable";
import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { TableCell, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import DeleteDialog from "@/app/(withHeader)/components/DeleteDialog";
import { UnitOfMeasurement } from "@prisma/client";
import { TableHeadsType } from "../../../../page";
import UnitOfMeasurementComp from "../../../UnitOfMeasurementComp/UnitOfMeasurementComp";
export const typeArr = [
  { name: "Робота" },
  { name: "Послуга" },
  { name: "Матеріал" },
  { name: "Транспорт" },
  { name: "Не визначино" },
] as const;

async function createCostHandler(values: RowType) {
  const { price, type } = values as any;
  if (values.id) {
    const cost = await updateCost({
      id: values.id!,
      amount: +values.amount,
      calculationId: values.calculationId,
      name: values.name,
      price: +price || null,
      type: type || null,
      unitOfMeasurementId: values.unitOfMeasurementId,
      createdAt: values.createdAt,
      updatedAt: values.updatedAt,
      note: values.note,
      section: values.section,
      costSubtype: null,
      dateOfCost: null,
      dateOfOccurrence: null,
      isIncome: null,
      activityType: null,
    });
    return cost;
  } else {
    const cost = await createCost({
      amount: +values.amount,
      calculationId: values.calculationId,
      name: values.name,
      price: +price || null,
      type: type || null,
      unitOfMeasurementId: values.unitOfMeasurementId,
      note: values.note,
      section: values.section,
      costSubtype: null,
      dateOfCost: null,
      dateOfOccurrence: null,
      isIncome: null,
      activityType: null,
    });
    return cost;
  }
}

function ActiveRow({
  data,
  setData,
  setIsActive,
  units,
  serverUserId,
  TABLE_HEADS,
}: {
  data: RowType;
  setData: Dispatch<SetStateAction<RowType[]>>;
  setIsActive: Dispatch<SetStateAction<boolean>>;
  units: UnitOfMeasurement[];
  serverUserId: string;
  TABLE_HEADS: TableHeadsType;
}) {
  let timeIdsArr: MutableRefObject<NodeJS.Timeout[]> = useRef([]);

  let check = false;
  const [rowState, setRowState] = useState<RowType>(data);

  const router = useRouter();
  const clearTimeouts = () => {
    timeIdsArr.current.forEach((el) => clearTimeout(el));
    timeIdsArr.current = [];
  };
  useEffect(
    () => {
      const timeoutId = setTimeout(() => {
        // I did this to check whether this is the second render out of two
        check = !check;
        if (check) {
          if (
            !TABLE_HEADS.filter((el) => el.label != "sum")

              .map((el) => !!rowState[el.label as keyof RowType])
              .reduce((p, c) => {
                if (!c) return false;
                return p;
              }, true)
          ) {
            return;
          }
          const cost = createCostHandler(rowState);

          setData((prev) => [
            ...prev.filter((el) => el.clientId != rowState.clientId),
          ]);
          setIsActive(false);
          router.refresh();
        }
      }, 2000);
      timeIdsArr.current.push(timeoutId);
    },

    TABLE_HEADS.map((el) => rowState[el.label as keyof RowType])
  );
  //@ts-ignore
  const cost = +rowState.amount * +rowState.price || 0;

  return (
    <>
      <TableRow>
        {TABLE_HEADS.map((el) => {
          if (el.name == "Одиниці виміру") {
            return (
              <TableCell key={el.name}>
                <UnitOfMeasurementComp
                  serverUserId={serverUserId}
                  key={el.name}
                  onValueChange={(e) => {
                    clearTimeouts();
                    setRowState((prev) => ({
                      ...prev,
                      unitOfMeasurementId: +e,
                    }));
                  }}
                  unitOfMeasurementId={rowState.unitOfMeasurementId}
                  units={units}
                />
              </TableCell>
            );
          }
          if (el.label == "name")
            return (
              <TableCell className="font-medium" key={el.name}>
                <Input
                  placeholder="Назва"
                  value={rowState.name}
                  onChange={(e) => {
                    clearTimeouts();
                    setRowState((prev) => ({ ...prev, name: e.target.value }));
                  }}
                />
              </TableCell>
            );

          if (el.label == "amount")
            return (
              <TableCell key={el.name}>
                <Input
                  type="number"
                  placeholder="Кіль."
                  value={rowState.amount}
                  onChange={(e) => {
                    clearTimeouts();
                    setRowState((prev) => ({
                      ...prev,
                      amount: e.target.value,
                    }));
                  }}
                />
              </TableCell>
            );
          if (el.label == "note") {
            const state = rowState as AktType;
            return (
              <TableCell key={el.name}>
                <Input
                  placeholder="Примітка"
                  value={state.note}
                  onChange={(e) => {
                    clearTimeouts();
                    setRowState((prev) => ({
                      ...prev,
                      note: e.target.value,
                    }));
                  }}
                />
              </TableCell>
            );
          }
          if (el.label == "type") {
            const state = rowState as CalcType;
            return (
              <TableCell key={el.name}>
                <Select
                  value={state.type}
                  onValueChange={(e) => {
                    clearTimeouts();
                    setRowState((prev) => ({
                      ...prev,
                      type: e as TypesOfType,
                    }));
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Тип" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {typeArr.map((el) => (
                        <SelectItem value={el.name} key={el.name}>
                          {el.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </TableCell>
            );
          }
          if (el.label == "price") {
            const state = rowState as CalcType;
            return (
              <TableCell key={el.name}>
                <Input
                  type="number"
                  placeholder="Ціна"
                  value={state.price}
                  onChange={(e) => {
                    clearTimeouts();
                    setRowState((prev) => ({ ...prev, price: e.target.value }));
                  }}
                />
              </TableCell>
            );
          }
          if (el.label == "sum") {
            return (
              <TableCell key={el.name} className="text-right">
                {cost}
              </TableCell>
            );
          }
        })}

        <TableCell className="cursor-pointer">
          {rowState.id ? (
            <DeleteDialog
              title="витрату"
              func={async () => {
                clearTimeouts();
                //   setIsActive(false);
                await deleteCost(data.id!);
                router.refresh();
              }}
            >
              <Trash2 />
            </DeleteDialog>
          ) : (
            <Trash2
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setData((prev) => [
                  ...prev.filter((el) => el.clientId != data.clientId),
                ]);
              }}
            />
          )}
        </TableCell>
      </TableRow>
    </>
  );
}

export default ActiveRow;
