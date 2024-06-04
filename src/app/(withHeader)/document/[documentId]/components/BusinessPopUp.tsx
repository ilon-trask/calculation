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
import UnitOfMeasurementComp from "./UnitOfMeasurementComp/UnitOfMeasurementComp";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UnitOfMeasurement } from "@prisma/client";
import { createCost } from "@/app/data/Cost.actions";
import { useRouter } from "next/navigation";

type RowStateType = {
  name: string;
  unitOfMeasurementId: number;
  amount: string | number;
  price: string | number;
  date: string;
};

function BusinessPopUp({
  children,
  serverUserId,
  units,
  calculationId,
  isIncome,
  costSubtype,
}: {
  children: JSX.Element;
  units: UnitOfMeasurement[];
  serverUserId: string;
  calculationId: number;
  isIncome: boolean;
  costSubtype: string;
}) {
  const [rowState, setRowState] = useState<RowStateType>({
    name: "",
    amount: "",
    date: "",
    price: "",
    unitOfMeasurementId: 0,
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
              <Input
                value={rowState.name}
                onChange={(e) =>
                  setRowState((prev) => ({ ...prev, name: e.target.value }))
                }
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
              Період
              <Input
                type="month"
                value={rowState.date}
                onChange={(e) => {
                  console.log(e.target.value);
                  setRowState((prev) => ({ ...prev, date: e.target.value }));
                }}
              />
            </div>
          </div>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            {isIncome ? (
              <Button
                onClick={() => {
                  if (rowState.date) {
                    const dateOfCost = new Date(rowState.date);
                  }
                  delete rowState.date;
                  const cost = createCost({
                    ...rowState,
                    amount: +rowState.amount,
                    price: +rowState.price,
                    dateOfCost,
                    calculationId,
                    costSubtype,
                    isIncome: true,
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
                  delete rowState.date;
                  const cost = createCost({
                    ...rowState,
                    amount: +rowState.amount,
                    price: +rowState.price,
                    dateOfCost,
                    calculationId,
                    costSubtype,
                    isIncome: false,
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
