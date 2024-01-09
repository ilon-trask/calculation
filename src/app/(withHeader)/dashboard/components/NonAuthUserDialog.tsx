"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import React, { Dispatch, SetStateAction } from "react";

function NonAuthUserDialog({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();

  return (
    <Dialog open={isOpen} onOpenChange={(e) => setIsOpen(e)}>
      <DialogContent
        className="sm:max-w-md"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <DialogHeader>
          <DialogTitle>Ви не зареєстрували аккаунт</DialogTitle>
          <DialogDescription>Ваші дані можуть бути втрачені</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="secondary"
            onClick={(e) => {
              setIsOpen(false);
            }}
          >
            Продовжити
          </Button>
          <Button
            type="button"
            onClick={(e) => {
              setIsOpen(false);
              router.push("/sign-up");
            }}
          >
            Зареєструватись
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default NonAuthUserDialog;
