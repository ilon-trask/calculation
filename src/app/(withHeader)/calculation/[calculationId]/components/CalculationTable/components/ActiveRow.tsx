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

async function createCostHandler(values: RowType) {
  if (values.id) {
    console.log("update" + values);
    const cost = await updateCost({
      id: values.id!,
      amount: +values.amount,
      calculationId: values.calculationId,
      name: values.name,
      price: +values.price,
      type: values.type,
      unitOfMeasurement: values.unitOfMeasurement,
      createdAt: values.createdAt,
      updatedAt: values.updatedAt,
    });
    return cost;
  } else {
    console.log("create" + values);
    const cost = await createCost({
      amount: +values.amount,
      calculationId: values.calculationId,
      name: values.name,
      price: +values.price,
      type: values.type,
      unitOfMeasurement: values.unitOfMeasurement,
    });
    console.log(cost);
    return cost;
  }
}

function ActiveRow({
  data,
  setData,
  setIsActive,
}: {
  data: RowType;
  setData: Dispatch<SetStateAction<RowType[]>>;
  setIsActive: Dispatch<SetStateAction<boolean>>;
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

  return (
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
          value={rowState.unitOfMeasurement}
          onValueChange={(e) => {
            clearTimeouts();
            setRowState((prev) => ({ ...prev, unitOfMeasurement: e }));
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Одиниці виміру" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>
                <div className="flex items-center ">
                  <Plus className="h-4 w-4" />
                  <span>Додати варіант</span>
                </div>
              </SelectLabel>
              <SelectSeparator />
              {[
                { name: "кілограми" },
                { name: "години" },
                { name: "літри" },
              ].map((el) => (
                <SelectItem value={el.name} key={el.name}>
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
  );
}

export default ActiveRow;
