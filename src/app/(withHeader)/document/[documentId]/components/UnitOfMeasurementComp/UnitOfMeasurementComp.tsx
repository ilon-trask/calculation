"use client";
import { Dispatch, SetStateAction, useState } from "react";
import { RowType } from "../Tables/DashboardTable/DashboardTable";
import { UnitOfMeasurement } from "@prisma/client";
import { TableCell } from "@/components/ui/table";

import { Plus } from "lucide-react";
import {
  SelectLabel,
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
  SelectItem,
} from "@/components/ui/select";
import CreateUnitOfMeasurement from "./CreateUnitOfMeasurement";

function UnitOfMeasurementComp({
  unitOfMeasurementId,
  onValueChange,
  units,
  serverUserId,
}: {
  unitOfMeasurementId: number;
  onValueChange: (e: string) => void;
  units: UnitOfMeasurement[];
  serverUserId: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Select value={unitOfMeasurementId + ""} onValueChange={onValueChange}>
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
      <CreateUnitOfMeasurement
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        serverUserId={serverUserId}
      />
    </>
  );
}

export default UnitOfMeasurementComp;
