"use client";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calculation } from "@prisma/client";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { Edit, Link, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { Dispatch, SetStateAction, memo } from "react";
import { deleteCalculation } from "../../../data/Calculation.actions";
import DeleteDialog from "../../components/DeleteDialog";
import { DEPLOY_URL } from "@/app/data/DeployUrl";

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
  const deleteHandle = async (id: number) => {
    await deleteCalculation({ calculationId: id });
    router.refresh();
  };
  const handleCopyClick = async (calcId: number) => {
    const textToCopy = DEPLOY_URL + "/calculation/" + calcId;
    try {
      await navigator.clipboard.writeText(textToCopy);
    } catch (error) {
      console.error("Error copying text:", error);
    }
  };
  return (
    <div className="mt-10 grid grid-cols-3 gap-6">
      {calculations.map((el) => (
        <Card
          key={el.id}
          className="cursor-pointer"
          onClick={() => router.push("/calculation/" + el.id)}
        >
          <CardHeader className="flex justify-between flex-row align-top">
            <div>
              <CardTitle>{el.name}</CardTitle>
              <CardDescription>{el.description} &nbsp;</CardDescription>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <DotsVerticalIcon className="h-5 w-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-32">
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsOpen(true);
                      setChosenCalcId(el.id);
                    }}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Edit</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyClick(el.id);
                    }}
                  >
                    <Link className="mr-2 h-4 w-4" />
                    <span>Copy link</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    <DeleteDialog
                      title="калькуляцію"
                      func={() => deleteHandle(el.id)}
                    >
                      <div className="flex items-center text-red-500">
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </div>
                    </DeleteDialog>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

export default memo(CalculationList);
