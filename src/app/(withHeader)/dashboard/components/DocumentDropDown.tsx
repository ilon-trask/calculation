import React, { Dispatch, SetStateAction } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { Edit, Link, Printer, SendHorizontal, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteCalculation } from "@/app/data/Calculation.actions";
import { DEPLOY_URL } from "@/app/data/DeployUrl";
import DeleteDialog from "../../components/DeleteDialog";

type PropsType = {
  id: number;
  setIsOpenDialog: Dispatch<SetStateAction<boolean>>;
} & (
  | {
      inCalculation: false;
      setChosenCalcId: Dispatch<SetStateAction<number>>;
    }
  | { inCalculation: true }
);

function PrintButton() {}

function DocumentDropDown(props: PropsType) {
  const { id, inCalculation, setIsOpenDialog } = props;
  const router = useRouter();
  const deleteHandle = async (id: number) => {
    await deleteCalculation({ calculationId: id });
    if (!inCalculation) router.refresh();
    router.push("/dashboard");
  };
  const handleCopyClick = async (calcId: number) => {
    const textToCopy = DEPLOY_URL + "/document/" + calcId;
    try {
      await navigator.clipboard.writeText(textToCopy);
    } catch (error) {
      console.error("Error copying text:", error);
    }
  };
  const printHandle = (calcId: number) => {
    if (inCalculation) return window.print();

    router.push("/document/" + calcId);

    window.print();
  };

  return (
    <div className="print:hidden">
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="cursor-pointer">
          <DotsVerticalIcon className="h-5 w-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-52 print:hidden">
          <DropdownMenuGroup>
            {inCalculation && (
              <>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    printHandle(id);
                  }}
                >
                  <Printer className="mr-2 h-4 w-4" />
                  <span>Друк</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <SendHorizontal className="mr-2 h-4 w-4" />
                  <span>Відправити на пошту</span>
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleCopyClick(id);
              }}
            >
              <Link className="mr-2 h-4 w-4" />
              <span>Скопіювати посилання</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsOpenDialog(true);
                if (!inCalculation) props.setChosenCalcId(id);
              }}
            >
              <Edit className="mr-2 h-4 w-4" />
              <span>Редагувати</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <DeleteDialog title="калькуляцію" func={() => deleteHandle(id)}>
                <div className="flex items-center text-red-500">
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Видалити</span>
                </div>
              </DeleteDialog>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default DocumentDropDown;
