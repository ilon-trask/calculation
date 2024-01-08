"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useState } from "react";

function DeleteDialog({
  title,
  func,
  children,
}: {
  title: string;
  func: () => void;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={(e) => setIsOpen(e)}>
      <div
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(false);
        }}
      >
        <DialogTrigger
          className="cursor-pointer"
          onClick={(e) => {
            console.log("sddsfsf");
            e.preventDefault();
            e.stopPropagation();
            setIsOpen(true);
          }}
        >
          {children}
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ви впевнені що хочете видалити {title}?</DialogTitle>
            <DialogDescription>
              Ви не зможете відновити {title}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsOpen(false);
              }}
            >
              Ні
            </Button>
            <Button
              type="button"
              variant={"destructive"}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsOpen(false);
                func();
              }}
            >
              Видалити
            </Button>
          </DialogFooter>
        </DialogContent>
      </div>
    </Dialog>
  );
}

export default DeleteDialog;
