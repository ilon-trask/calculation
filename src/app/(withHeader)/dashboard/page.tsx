import H2 from "@/components/ui/H2";
import { Button } from "@/components/ui/button";
import React from "react";
import CalculationList from "./components/CalculationList";
import CreateCalculation from "./components/CreateCalculation";
import { getCalculations } from "./dashboard.actions";
import { cookies } from "next/headers";

// <div className="max-w-fit">
// <div className="flex items-center space-x-1 rounded-md bg-secondary text-secondary-foreground">
//   <Button variant="secondary" className="px-3 shadow-none">
//     <StarIcon className="mr-2 h-4 w-4" />
//     Star
//   </Button>
//   <DropdownMenu>
//     <DropdownMenuTrigger asChild>
//       <Button variant="secondary" className="px-2 shadow-none">
//         <ChevronDownIcon className="h-4 w-4 text-secondary-foreground" />
//       </Button>
//     </DropdownMenuTrigger>
//     <DropdownMenuContent
//       align="end"
//       alignOffset={-5}
//       className="w-[200px]"
//       forceMount
//     >
//       <DropdownMenuLabel>Suggested Lists</DropdownMenuLabel>
//       <DropdownMenuSeparator />
//       <DropdownMenuCheckboxItem checked>
//         Future Ideas
//       </DropdownMenuCheckboxItem>
//       <DropdownMenuCheckboxItem>My Stack</DropdownMenuCheckboxItem>
//       <DropdownMenuCheckboxItem>Inspiration</DropdownMenuCheckboxItem>
//       <DropdownMenuSeparator />
//       <DropdownMenuItem>
//         <PlusIcon className="mr-2 h-4 w-4" /> Create List
//       </DropdownMenuItem>
//     </DropdownMenuContent>
//   </DropdownMenu>
// </div>
// </div>

async function page() {
  const userId = cookies().get("userId")?.value;
  const calculations = userId ? await getCalculations({ userId }) : [];
  return (
    <>
      <div className="flex justify-between">
        <H2>Мої калькуляції</H2>
        <CreateCalculation serverUserId={userId} />
      </div>
      <CalculationList calculations={calculations} />
    </>
  );
}

export default page;
