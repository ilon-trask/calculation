import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CreateBusinessPlanDocPopUp from "./CreateBusinessPlanDocPopUp";
import { Button } from "@/components/ui/button";
import React, { Dispatch, SetStateAction, useState } from "react";
import { quartersType, quarterNamesType } from "../BusinessTablePage";

export const businessDocs = [
  {
    id: 1,
    name: "План руху грошових коштів",
    link: "business-plan-of-expenses",
  },
  {
    id: 2,
    name: "Калькуляція",
    link: "calculation",
  },
] as const;
export type businessDocType = (typeof businessDocs)[number]["name"] | "";

type Props = {
  serverUserId: string;
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  quarters: quartersType;
  quarter: quarterNamesType;
  setQuarter: Dispatch<SetStateAction<quarterNamesType>>;
};

function BusinessPlanSettings({
  serverUserId,
  value,
  setValue,
  quarters,
  quarter,
  setQuarter,
}: Props) {
  const [open, setOpen] = useState(false);
  const [docType, setDocType] = useState<businessDocType>("");
  const [isOpenDoc, setIsOpenDoc] = useState(false);

  return (
    <div className="flex justify-between">
      <div>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild onClick={() => setOpen(true)}>
            <Button>{value}</Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandGroup>
                {[
                  2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029,
                  2030,
                ].map((year: number) => (
                  <CommandItem
                    key={year}
                    value={year + ""}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value == year + "" ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {year}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
        {quarters.map((el) => (
          <Button
            key={el.name}
            variant={quarter == el.name ? "default" : "outline"}
            onClick={() => {
              setQuarter(el.name);
            }}
          >
            {el.name}
          </Button>
        ))}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger className="h-10 px-4 py-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90">
          Розрахунокові документи
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {businessDocs.map((el) => (
            <DropdownMenuItem
              key={el.id}
              onClick={() => {
                if (el.link == "business-plan-of-expenses") setIsOpenDoc(true);
                setDocType(el.name);
              }}
              className="cursor-pointer"
            >
              {el.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <CreateBusinessPlanDocPopUp
        isOpen={isOpenDoc}
        setIsOpen={setIsOpenDoc}
        section={docType as businessDocType}
        serverUserId={serverUserId}
      />
    </div>
  );
}

export default BusinessPlanSettings;
