import { TableCell } from "@/components/ui/table";
import { ReactNode } from "react";

function TableTextHeading({ children }: { children: ReactNode }) {
  return (
    <TableCell
      colSpan={120}
      className="text-center text-white uppercase hover:bg-black"
    >
      {children}
    </TableCell>
  );
}
export default TableTextHeading;
