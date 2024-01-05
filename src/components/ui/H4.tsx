import { cn } from "@/lib/utils";
import React from "react";

function H4(props: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h4
      {...props}
      className={cn(
        "scroll-m-20 text-xl font-semibold tracking-tight",
        props.className
      )}
    >
      {props.children}
    </h4>
  );
}

export default H4;
