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
import { Edit, Link, Share, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { memo } from "react";
import { deleteCalculation } from "../../../data/Calculation.actions";
import DeleteDialog from "../../components/DeleteDialog";

function CalculationList({ calculations }: { calculations: Calculation[] }) {
  const router = useRouter();
  const deleteHandle = async (id: number) => {
    await deleteCalculation({ calculationId: id });
    router.refresh();
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
              <DropdownMenuContent className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Edit</span>
                    {/* <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut> */}
                  </DropdownMenuItem>
                  {/* <DropdownMenuItem>
                    {/* <Trash2 className="mr-2 h-4 w-4" /> 
                    <span>lksjdf</span>
                  </DropdownMenuItem> */}
                  <DropdownMenuItem>
                    <Link className="mr-2 h-4 w-4" />
                    <span>Copy link</span>
                    {/* <DropdownMenuShortcut>⌘S</DropdownMenuShortcut> */}
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
