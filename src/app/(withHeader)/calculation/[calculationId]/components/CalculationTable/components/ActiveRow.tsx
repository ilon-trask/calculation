"use client";

import { createCost, deleteCost, updateCost } from "@/app/data/Cost.actions";
import { RowType, TypesOfType, typeArr } from "../CalculationTable";
import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useMemo,
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
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import DeleteDialog from "@/app/(withHeader)/components/DeleteDialog";
import { UnitOfMeasurement } from "@prisma/client";
import CreateUnitOfMeasurement from "./CreateUnitOfMeasurement";

async function createCostHandler(values: RowType) {
  if (values.id) {
    const cost = await updateCost({
      id: values.id!,
      amount: +values.amount,
      calculationId: values.calculationId,
      name: values.name,
      price: +values.price,
      type: values.type,
      unitOfMeasurementId: values.unitOfMeasurementId,
      createdAt: values.createdAt,
      updatedAt: values.updatedAt,
    });
    return cost;
  } else {
    const cost = await createCost({
      amount: +values.amount,
      calculationId: values.calculationId,
      name: values.name,
      price: +values.price,
      type: values.type,
      unitOfMeasurementId: values.unitOfMeasurementId,
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
}: {
  data: RowType;
  setData: Dispatch<SetStateAction<RowType[]>>;
  setIsActive: Dispatch<SetStateAction<boolean>>;
  units: UnitOfMeasurement[];
  serverUserId: string;
}) {
  let timeIdsArr: MutableRefObject<NodeJS.Timeout[]> = useRef([]);

  let check = false;
  const [rowState, setRowState] = useState<RowType>(data);
  const router = useRouter();
  const clearTimeouts = () => {
    timeIdsArr.current.forEach((el) => clearTimeout(el));
    timeIdsArr.current = [];
  };
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // I did this to check whether this is the second render out of two
      check = !check;
      if (check) {
        if (
          !rowState.amount ||
          !rowState.price ||
          !rowState.type ||
          !rowState.unitOfMeasurement
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
    }, 3000);
    timeIdsArr.current.push(timeoutId);
  }, [
    rowState.amount,
    rowState.price,
    rowState.name,
    rowState.type,
    rowState.unitOfMeasurement,
  ]);
  const cost = +rowState.amount * +rowState.price || 0;

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <TableRow>
        <TableCell className="font-medium">
          <Input
            placeholder="Назва"
            value={rowState.name}
            onChange={(e) => {
              clearTimeouts();
              setRowState((prev) => ({ ...prev, name: e.target.value }));
            }}
          />
        </TableCell>
        <TableCell>
          <Select
            value={rowState.unitOfMeasurementId + ""}
            onValueChange={(e) => {
              clearTimeouts();
              setRowState((prev) => ({ ...prev, unitOfMeasurementId: +e }));
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Одиниці виміру" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() => setIsOpen(true)}
                  >
                    <Plus className="h-4 w-4" />
                    <span>Додати варіант</span>
                  </div>
                </SelectLabel>
                <SelectSeparator />
                {units.map((el) => (
                  <SelectItem value={el.id + ""} key={el.id}>
                    {el.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </TableCell>
        <TableCell>
          <Select
            value={rowState.type}
            onValueChange={(e) => {
              clearTimeouts();
              setRowState((prev) => ({ ...prev, type: e as TypesOfType }));
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
        <TableCell>
          <Input
            type="number"
            placeholder="Кіль."
            value={rowState.amount}
            onChange={(e) => {
              clearTimeouts();
              setRowState((prev) => ({ ...prev, amount: e.target.value }));
            }}
          />
        </TableCell>
        <TableCell>
          <Input
            type="number"
            placeholder="Ціна"
            value={rowState.price}
            onChange={(e) => {
              clearTimeouts();
              setRowState((prev) => ({ ...prev, price: e.target.value }));
            }}
          />
        </TableCell>
        <TableCell className="text-right">{cost}</TableCell>
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
      <CreateUnitOfMeasurement
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        serverUserId={serverUserId}
      />
    </>
  );
}

export default ActiveRow;
