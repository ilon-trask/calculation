"use client";
import { Dispatch, SetStateAction, useState } from "react";
import { RowType } from "../Tables/DashboardTable/DashboardTable";
import { UnitOfMeasurement } from "@prisma/client";
import { TableCell } from "@/components/ui/table";

import { Pen, Plus } from "lucide-react";
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
import { RowStateType } from "../BusinessPopUp";
import ChangeBusinessName from "./ChangeBusinessName";

function BusinessNameComp({
  unitOfMeasurementId,
  onValueChange,
  units,
  setRowState,
}: {
  unitOfMeasurementId: string;
  onValueChange: (e: string) => void;
  units: { id: number; name: string }[];
  setRowState: Dispatch<SetStateAction<RowStateType>>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [names, setNames] = useState<{ name: string; id: number }[]>(units);
  return (
    <>
      <Select value={unitOfMeasurementId} onValueChange={onValueChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Назва" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>
              <div
                className="flex items-center cursor-pointer"
                onClick={() => setIsOpen(true)}
              >
                <Pen className="h-4 w-4" />
                <span>Змінити назву</span>
              </div>
            </SelectLabel>
            <SelectSeparator />
            {names.map((el) => (
              <SelectItem value={el.name + ""} key={el.id}>
                {el.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
        <ChangeBusinessName
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          setRowState={setRowState}
          setNames={setNames}
        />
      </Select>
    </>
  );
}

export default BusinessNameComp;
