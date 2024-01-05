import React from "react";
import Breadcrumb from "./components/Breadcrumb";
import CalculationTable from "./components/CalculationTable";

function page() {
  return (
    <div>
      <Breadcrumb />
      <CalculationTable className="mt-10" />
    </div>
  );
}

export default page;
