"use client";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calculation } from "@prisma/client";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { Edit, Link, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { Dispatch, SetStateAction, memo } from "react";
import { deleteCalculation } from "../../../data/Calculation.actions";
import DeleteDialog from "../../components/DeleteDialog";
import { DEPLOY_URL } from "@/app/data/DeployUrl";
import DocumentDropDown from "./DocumentDropDown";

function CalculationList({
  calculations,
  setChosenCalcId,
  setIsOpen,
}: {
  calculations: Calculation[];
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setChosenCalcId: Dispatch<SetStateAction<number>>;
}) {
  const router = useRouter();
  return (
    <div className="mt-10 grid grid-cols-3 gap-6">
      {calculations.map((el) => (
        <Card
          key={el.id}
          className="cursor-pointer"
          onClick={() => router.push("/document/" + el.id)}
        >
          <CardHeader className="flex justify-between flex-row align-top">
            <div>
              <CardTitle>{el.name}</CardTitle>
              <CardDescription>{el.description} &nbsp;</CardDescription>
            </div>
            <DocumentDropDown
              id={el.id}
              setChosenCalcId={setChosenCalcId}
              setIsOpenDialog={setIsOpen}
              inCalculation={false}
            />
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

export default memo(CalculationList);
