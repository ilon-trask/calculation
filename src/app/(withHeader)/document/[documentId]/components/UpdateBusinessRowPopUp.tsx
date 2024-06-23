"use client";
import Text from "@/components/ui/Text";
import { Button } from "@/components/ui/button";
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
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { busTableType } from "./Tables/BusinessTable/components/DataRows";
import UnitOfMeasurementComp from "./UnitOfMeasurementComp/UnitOfMeasurementComp";
import { UnitOfMeasurement } from "@prisma/client";
import { updateBusinessPlanRow } from "@/app/data/Cost.actions";
import { useRouter } from "next/navigation";

function UpdateBusinessRowPopUp({
  children,
  data,
  serverUserId,
  units,
}: {
  children: JSX.Element;
  data: busTableType;
  units: UnitOfMeasurement[];
  serverUserId: string;
}) {
  const [formState, setFormState] = useState<busTableType>(data);
  useEffect(() => {
    setFormState(data);
  }, [JSON.stringify(data)]);
  const router = useRouter();
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className=" sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Редагування [рядка]</DialogTitle>
        </DialogHeader>
        <div className="flex justify-between align-middle">
          <Label>
            <Text>Назва</Text>
            <Input
              value={formState.name}
              onChange={(e) =>
                setFormState({ ...formState, name: e.target.value })
              }
            />
          </Label>
          <Label>
            <Text>Одиниці виміру</Text>
            <UnitOfMeasurementComp
              serverUserId={serverUserId}
              units={units}
              unitOfMeasurementId={formState.unitOfMeasurementId}
              onValueChange={(e) => {
                setFormState((prev) => ({
                  ...prev,
                  unitOfMeasurementId: +e,
                }));
              }}
            />
          </Label>
          <Trash2 className="cursor-pointer" />
        </div>
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Кількість</TableHead>
                <TableHead>Ціна</TableHead>
                <TableHead>Дата оплати</TableHead>
                <TableHead>Період виникнення</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {formState.values.map((el) => (
                <TableRow key={el.id}>
                  <TableCell>
                    <Input
                      value={el.amount}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          values: formState.values.map((value) =>
                            value.id == el.id
                              ? {
                                  ...value,
                                  amount: e.target.value as number | "",
                                }
                              : value
                          ),
                        })
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={el.price}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          values: formState.values.map((value) =>
                            value.id == el.id
                              ? {
                                  ...value,
                                  price: e.target.value as number | "",
                                }
                              : value
                          ),
                        })
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="month"
                      value={(() => {
                        let date = new Date(el.dateOfCost);
                        const year = date.getFullYear();
                        const month = (date.getMonth() + 1)
                          .toString()
                          .padStart(2, "0");
                        return `${year}-${month}`;
                      })()}
                      onChange={(e) =>
                        setFormState({
                          ...formState,

                          values: formState.values.map((value) =>
                            value.id == el.id
                              ? {
                                  ...value,
                                  dateOfCost: new Date(e.target.value),
                                }
                              : value
                          ),
                        })
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="month"
                      value={(() => {
                        let date = new Date(el.dateOfOccurrence);
                        const year = date.getFullYear();
                        const month = (date.getMonth() + 1)
                          .toString()
                          .padStart(2, "0");
                        return `${year}-${month}`;
                      })()}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          values: formState.values.map((value) =>
                            value.id == el.id
                              ? {
                                  ...value,
                                  dateOfOccurrence: new Date(e.target.value),
                                }
                              : value
                          ),
                        })
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Trash2 className="cursor-pointer" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              onClick={() => {
                console.log(JSON.stringify(formState));
                console.log(JSON.stringify(data));
                console.log(JSON.stringify(formState) != JSON.stringify(data));
                if (JSON.stringify(formState) != JSON.stringify(data)) {
                  updateBusinessPlanRow({
                    ...formState,
                    values: formState.values.map((el) => ({
                      ...el,
                      price: +el.price,
                      amount: +el.amount,
                    })),
                  });
                }

                setFormState(data);
                router.refresh();
              }}
            >
              Зберегти
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default UpdateBusinessRowPopUp;
