"use client";

import useNonAuthUserId from "@/app/hooks/useNonAuthUserId";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useEffect, useMemo, useState } from "react";

function CreateCalculation() {
  const userId = useNonAuthUserId();

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Додати калькуляцію</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Створення калькуляції</DialogTitle>
            {/* <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription> */}
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-6 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Назва
              </Label>
              <Input id="name" value="Pedro Duarte" className="col-span-5" />
            </div>
            <div className="grid grid-cols-6 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Опис
              </Label>
              <Input id="username" value="@peduarte" className="col-span-5" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Створити</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CreateCalculation;
