"use client";
import H2 from "@/components/ui/H2";
import React, { useLayoutEffect, useState } from "react";
import CreateDocument from "../../components/CreateDocument";
import CalculationList from "./CalculationList";
import { Calculation } from "@prisma/client";
import NonAuthUserDialog from "./NonAuthUserDialog";
import { User } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Docs, DocsType } from "@/app/data/Docs";

function DashboardContent({
  userId,
  calculations,
  supaUser,
}: {
  userId: string | undefined;
  calculations: Calculation[];
  supaUser: User | undefined;
}) {
  const router = useRouter();
  const [chosenCalcId, setChosenCalcId] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [section, setSection] = useState<DocsType>();
  const [isUser, setIsUser] = useState(false);
  useLayoutEffect(() => setIsUser(!supaUser), []);
  useLayoutEffect(() => router.refresh(), [userId]);

  return (
    <>
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger className="h-10 px-4 py-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90">
            Додати документ
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {Docs.map((el) => (
              <DropdownMenuItem
                key={el.id}
                onClick={() => {
                  setIsOpen(true);
                  setSection(el.name);
                }}
                className="cursor-pointer"
              >
                {el.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {Docs.map((el) => {
        const data = calculations.filter((doc) => doc.section == el.name);
        if (data.length)
          return (
            <React.Fragment key={el.id}>
              <H2>{el.name}</H2>
              <CalculationList
                calculations={data}
                setIsOpen={setIsOpen}
                setChosenCalcId={setChosenCalcId}
              />
            </React.Fragment>
          );
      })}
      {/* <CreateDocument
        serverUserId={userId!}
        section={section!}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        chosenCalc={calculations.find((el) => el.id == chosenCalcId)}      /> */}
      <NonAuthUserDialog isOpen={isUser} setIsOpen={setIsUser} />
    </>
  );
}

export default DashboardContent;
