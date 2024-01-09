import React from "react";
import { getCalculations } from "../../data/Calculation.actions";
import DashboardContent from "./components/DashboardContent";
import getUser from "@/app/hooks/getUser";
import supabaseServer from "@/lib/supabaseServer";

async function page() {
  const user = await getUser();
  const { data } = await supabaseServer.auth.getSession();
  const calculations = user?.id
    ? await getCalculations({ userId: user.id })
    : [];
  return (
    <DashboardContent
      userId={user?.id}
      calculations={calculations}
      supaUser={data.session?.user}
    />
  );
}

export default page;
