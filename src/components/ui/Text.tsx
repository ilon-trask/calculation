import { cn } from "@/lib/utils";
import React from "react";

function Text({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <p className={cn("leading-7 ", className)}>{children}</p>;
}

export default Text;
