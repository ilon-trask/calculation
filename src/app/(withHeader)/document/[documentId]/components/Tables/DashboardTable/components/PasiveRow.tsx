import DeleteDialog from "@/app/(withHeader)/components/DeleteDialog";
import { deleteCost } from "@/app/data/Cost.actions";
import Text from "@/components/ui/Text";
import { TableCell, TableRow } from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";
import { TableHeadsType } from "../../../../page";

function PassiveRow(
  props: {
    data: any;
    TABLE_HEADS: TableHeadsType;
    className?: string;
  } & (
    | {
        isOwner: true;
        setIsActive: Dispatch<SetStateAction<boolean>>;
      }
    | {
        isOwner: false;
      }
  )
) {
  const { data, TABLE_HEADS, className } = props;

  const router = useRouter();
  return (
    <TableRow
      className={className}
      onClick={() => {
        if (props.isOwner) props.setIsActive(true);
      }}
    >
      {TABLE_HEADS.map((el) => {
        if (el.name == "Одиниці виміру")
          return (
            <TableCell key={el.name}>
              <Text>{data.unitOfMeasurement?.name}</Text>
            </TableCell>
          );
        if (el.label == "sum") {
          const cost = +data.amount * +data.price || 0;
          return (
            <TableCell key={el.name} className="text-right">
              <Text>{cost}</Text>
            </TableCell>
          );
        }
        return (
          <TableCell key={el.name} className={el.isNumber ? "text-right" : ""}>
            {data[el.label]}
          </TableCell>
        );
      })}
      {props.isOwner ? (
        <TableCell className="print:hidden">
          <DeleteDialog
            title="витрату"
            func={async () => {
              await deleteCost(data.id!);
              router.refresh();
            }}
          >
            <Trash2 />
          </DeleteDialog>
        </TableCell>
      ) : null}
    </TableRow>
  );
}

export default PassiveRow;
