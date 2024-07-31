import { createContext, useContext } from "react";
import { SeparatedCostsType } from "./getSeparatedCosts";

export const CostsContext = createContext<SeparatedCostsType | undefined>(
  undefined
);

export function useCostsContext() {
  const data = useContext(CostsContext);
  if (!data) throw new Error("useCostsContext is not defined");
  return data;
}
