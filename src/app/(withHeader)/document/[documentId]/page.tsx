import React from "react";
import Breadcrumb from "./components/Breadcrumb";
import {
  CalculationType,
  getCalculationWithItems,
} from "../../../data/Calculation.actions";
import prismadb from "@/lib/prismadb";
import { UnitOfMeasurement } from "@prisma/client";
import WorkSetTable from "./components/Tables/DashboardTable/DashboardTable";
import { getUser } from "@/app/hooks/getUser";
import DocumentTitle from "./components/DocumentTitle";
import BusinessTablePage from "./components/Tables/BusinessTablePage/BusinessTablePage";

//дефектний акт
//набір робіт
const SET_WORK_TABLE_HEADS = [
  { name: "Назва робіт, матеріалів та послуг", isNumber: false, label: "name" },
  {
    name: "Одиниці виміру",
    isNumber: false,
    label: "unitOfMeasurementId",
  },
  { name: "Кількість", isNumber: true, label: "amount" },
  { name: "Примітка", isNumber: false, label: "note" },
] as const;

const CALCULATION_TABLE_HEADS = [
  { name: "Назва", isNumber: false, label: "name" },
  {
    name: "Одиниці виміру",
    isNumber: false,
    label: "unitOfMeasurementId",
  },
  { name: "Тип", isNumber: false, label: "type" },
  { name: "Ціна", isNumber: true, label: "price" },
  { name: "Кількість", isNumber: true, label: "amount" },
  { name: "Сума", isNumber: true, label: "sum" },
] as const;

const INVOICE_TABLE_HEADS = [
  { name: "Назва", isNumber: false, label: "name" },
  {
    name: "Одиниці виміру",
    isNumber: false,
    label: "unitOfMeasurementId",
  },
  { name: "Ціна", isNumber: true, label: "price" },
  { name: "Кількість", isNumber: true, label: "amount" },
  { name: "Сума", isNumber: true, label: "sum" },
] as const;

export type TableHeadsType =
  | typeof SET_WORK_TABLE_HEADS
  | typeof CALCULATION_TABLE_HEADS
  | typeof INVOICE_TABLE_HEADS;

function Table({
  calculation,
  isOwner,
  units,
  userId,
}: {
  calculation: CalculationType;
  isOwner: boolean;
  userId: string | undefined;
  units: UnitOfMeasurement[];
}) {
  if (calculation.section == "Калькуляція (скорочена)") {
    return (
      <WorkSetTable
        className="mt-10"
        calculationId={calculation.id}
        section={calculation.section}
        costs={calculation.costs}
        isOwner={isOwner}
        units={units}
        serverUserId={userId!}
        TABLE_HEADS={CALCULATION_TABLE_HEADS}
      />
    );
  }

  if (calculation.section == "Набір робіт, матеріалів та послуг") {
    return (
      <WorkSetTable
        className="mt-10"
        calculationId={calculation.id}
        section={calculation.section}
        costs={calculation.costs}
        isOwner={isOwner}
        units={units}
        serverUserId={userId!}
        TABLE_HEADS={SET_WORK_TABLE_HEADS}
      />
    );
  }
  if (calculation.section == "Дефектний акт (скорочений)") {
    return (
      <WorkSetTable
        className="mt-10"
        calculationId={calculation.id}
        section={calculation.section}
        costs={calculation.costs}
        isOwner={isOwner}
        units={units}
        serverUserId={userId!}
        TABLE_HEADS={SET_WORK_TABLE_HEADS}
      />
    );
  }
  if (calculation.section == "Рахунок фактура") {
    return (
      <WorkSetTable
        className="mt-10"
        calculationId={calculation.id}
        section={calculation.section}
        costs={calculation.costs}
        isOwner={isOwner}
        units={units}
        serverUserId={userId!}
        TABLE_HEADS={INVOICE_TABLE_HEADS}
      />
    );
  }

  if (calculation.section == "Розрахунок бізнес-плану") {
    return (
      <BusinessTablePage
        units={units}
        serverUserId={userId!}
        calculationId={calculation.id}
        costs={calculation.costs as any}
        isOwner={isOwner}
      />
    );
  }

  return null;
}

async function page({
  params: paramsPromise,
}: {
  params: Promise<{ documentId: string }>;
}) {
  const params = await paramsPromise;
  const calculation = +params.documentId
    ? await getCalculationWithItems({ calculationId: +params.documentId })
    : null;
  if (!calculation) throw new Error("Такої калькуляції немає");
  const user = await getUser();
  // if (!user) throw new Error("не зареєстровані");
  const units = await prismadb.unitOfMeasurement.findMany({
    where: { OR: [{ userId: user?.id }, { userId: null }] },
  });
  const isOwner = user?.id == calculation.userId;
  return (
    <div>
      <Breadcrumb name={calculation.name} />
      <DocumentTitle userId={user?.id} calculation={calculation} />
      <div className="ml-8">
        <p className="mt-5 font-semibold text-lg">{calculation.name}</p>
        <p className="mt-2">{calculation.description}</p>
      </div>
      <Table
        calculation={calculation}
        isOwner={isOwner}
        units={units}
        userId={user?.id}
      />
    </div>
  );
}

export default page;
