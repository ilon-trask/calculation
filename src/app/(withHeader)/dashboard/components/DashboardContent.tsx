"use client";
import H2 from "@/components/ui/H2";
import React, { useLayoutEffect, useState } from "react";
import CreateCalculation from "./CreateCalculation";
import CalculationList from "./CalculationList";
import { Calculation } from "@prisma/client";
import useNonAuthUserId from "@/app/hooks/useNonAuthUserId";
import NonAuthUserDialog from "./NonAuthUserDialog";
import { User } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

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
  const [isUser, setIsUser] = useState(false);
  useLayoutEffect(() => {
    setIsUser(!supaUser);
  }, []);
  useLayoutEffect(() => {
    router.refresh();
  }, [userId]);
  if (!supaUser) {
    useNonAuthUserId();
  }
  return (
    <>
      <div className="flex justify-between">
        <H2>Мої калькуляції</H2>
        <CreateCalculation
          serverUserId={userId!}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          chosenCalc={calculations.find((el) => el.id == chosenCalcId)}
        />
      </div>
      <CalculationList
        calculations={calculations}
        setIsOpen={setIsOpen}
        setChosenCalcId={setChosenCalcId}
      />
      <NonAuthUserDialog isOpen={isUser} setIsOpen={setIsUser} />
    </>
  );
}

export default DashboardContent;
