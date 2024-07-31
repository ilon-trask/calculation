import {
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";
import { quarterNamesType, quarterType } from "../BusinessTablePage";

type Props = { thisQuarter: quarterType };

function BusinessTableHeader({ thisQuarter }: Props) {
  return (
    <TableHeader>
      <TableRow>
        <TableHead rowSpan={2}>Показники</TableHead>
        <TableHead rowSpan={2}>Одиниці виміру</TableHead>
        {thisQuarter?.children.map((el) => (
          <TableHead colSpan={3} key={el}>
            {el}
          </TableHead>
        ))}

        <TableHead colSpan={3}>Рік</TableHead>
      </TableRow>
      <TableRow>
        {Array.from({ length: 4 }, (_, index) => index + 1).map((el) => {
          return (
            <React.Fragment key={el}>
              <TableCell>Кількість</TableCell>
              <TableCell>Ціна</TableCell>
              <TableCell>Сума</TableCell>
            </React.Fragment>
          );
        })}
      </TableRow>
    </TableHeader>
  );
}

export default BusinessTableHeader;
