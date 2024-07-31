import { TableCell } from "@/components/ui/table";
import { ReactNode } from "react";

function TableTextSubHeading({ children }: { children: ReactNode }) {
  return <TableCell className="uppercase font-semibold">{children}</TableCell>;
}

export default TableTextSubHeading;
