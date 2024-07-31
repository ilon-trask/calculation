"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import UnitOfMeasurementComp from "../../../UnitOfMeasurementComp/UnitOfMeasurementComp";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UnitOfMeasurement } from "@prisma/client";
import { createCost } from "@/app/data/Cost.actions";
import { useRouter } from "next/navigation";
import BusinessNameComp from "../../../BusinessNameComp/BusinessNameComp";
import { busTableType } from "./DataRows";
import {
  SelectItem,
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { typeArr } from "../../DashboardTable/components/ActiveRow";
import { TypesOfType } from "../../DashboardTable/DashboardTable";

export type RowStateType = {
  name: string;
  unitOfMeasurementId: number;
  amount: string | number;
  price: string | number;
  date: string;
  dateOfOccurrence: string;
  type: TypesOfType | "";
};

function BusinessPopUp({
  children,
  serverUserId,
  units,
  calculationId,
  isIncome,
  costSubtype,
  costs,
  activityType,
}: {
  children: JSX.Element;
  units: UnitOfMeasurement[];
  serverUserId: string;
  calculationId: number;
  isIncome: boolean;
  costSubtype: string;
  costs: busTableType[];
  activityType: "операційна" | "інвестиційна" | null;
}) {
  const [rowState, setRowState] = useState<RowStateType>({
    name: "",
    amount: "",
    date: "",
    price: "",
    unitOfMeasurementId: 0,
    dateOfOccurrence: "",
    type: "",
  });
  const router = useRouter();

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Створення [рядка]</DialogTitle>
          <div>
            <div>
              Назва показника
              {/* <Input
                value={rowState.name}
                onChange={(e) =>
                  setRowState((prev) => ({ ...prev, name: e.target.value }))
                }
              /> */}
              <BusinessNameComp
                units={costs}
                unitOfMeasurementId={rowState.name}
                setRowState={setRowState}
                onValueChange={(e) => {
                  setRowState((prev) => ({
                    ...prev,
                    name: e,
                  }));
                }}
              />
            </div>
            <div>
              Одиниці виміру
              <UnitOfMeasurementComp
                serverUserId={serverUserId}
                units={units}
                unitOfMeasurementId={rowState.unitOfMeasurementId}
                onValueChange={(e) => {
                  setRowState((prev) => ({
                    ...prev,
                    unitOfMeasurementId: +e,
                  }));
                }}
              />
            </div>
            <div>
              Ціна
              <Input
                type="number"
                value={rowState.price}
                onChange={(e) =>
                  setRowState((prev) => ({ ...prev, price: e.target.value }))
                }
              />
            </div>
            <div>
              Кількість
              <Input
                type="number"
                value={rowState.amount}
                onChange={(e) =>
                  setRowState((prev) => ({ ...prev, amount: e.target.value }))
                }
              />
            </div>
            <div>
              Період оплати
              <Input
                type="month"
                value={rowState.date}
                onChange={(e) => {
                  setRowState((prev) => ({ ...prev, date: e.target.value }));
                }}
              />
            </div>
            <div>
              Період виникнення
              <Input
                type="month"
                value={rowState.dateOfOccurrence}
                onChange={(e) => {
                  setRowState((prev) => ({
                    ...prev,
                    dateOfOccurrence: e.target.value,
                  }));
                }}
              />
            </div>
            <div>
              Товарна структура
              <Select
                value={rowState.type}
                onValueChange={(e) => {
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
            </div>
          </div>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            {isIncome ? (
              <Button
                onClick={() => {
                  const dateOfCost = new Date(rowState.date);
                  const dateOfOccurrence = new Date(rowState.dateOfOccurrence);
                  const { date, ...newRowState } = rowState;
                  const cost = createCost({
                    ...newRowState,
                    amount: +rowState.amount,
                    price: +rowState.price,
                    dateOfCost,
                    dateOfOccurrence,
                    calculationId,
                    costSubtype,
                    isIncome: true,
                    activityType,
                  });
                  router.refresh();
                }}
              >
                Зберегти
              </Button>
            ) : (
              <Button
                onClick={() => {
                  const dateOfCost = new Date(rowState.date);
                  const dateOfOccurrence = new Date(rowState.dateOfOccurrence);
                  const { date, ...newRowState } = rowState;
                  const cost = createCost({
                    ...newRowState,
                    amount: +rowState.amount,
                    price: +rowState.price,
                    dateOfOccurrence,
                    dateOfCost,
                    calculationId,
                    costSubtype,
                    isIncome: false,
                    activityType,
                  });
                  router.refresh();
                }}
              >
                Зберегти
              </Button>
            )}
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default BusinessPopUp;
