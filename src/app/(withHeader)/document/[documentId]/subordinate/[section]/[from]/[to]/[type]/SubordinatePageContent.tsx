"use client";
import { businessDocs } from "@/app/(withHeader)/document/[documentId]/components/Tables/BusinessTable/BusinessTable";
import React from "react";

type Props = { params: any };

function SubordinatePageContent({ params }: Props) {
  return (
    <div>
      <p className="text-center font-semibold text-xl uppercase">
        {businessDocs.find((el) => el.link == params.section)?.name}
      </p>
      <p className="text-center">
        за період {params.from} по {params.to}
      </p>
    </div>
  );
}

export default SubordinatePageContent;
