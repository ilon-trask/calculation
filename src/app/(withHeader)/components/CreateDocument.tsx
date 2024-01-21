"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import React, { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  createCalculation,
  updateCalculation,
} from "../../data/Calculation.actions";
import { useRouter } from "next/navigation";
import { Calculation } from "@prisma/client";
import { DocsType } from "@/app/data/Docs";

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Назва повинна містити більше 2 символів",
  }),
  description: z.string().optional().nullable(),
});

function CreateDocument({
  section,
  serverUserId,
  isOpen,
  setIsOpen,
  chosenCalc,
  children,
}: {
  section: DocsType;
  serverUserId: string;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  chosenCalc: Calculation | undefined;
  children?: React.ReactNode;
}) {
  console.log(section);
  const router = useRouter();
  const userId = serverUserId;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      name: chosenCalc?.name || "",
      description: chosenCalc?.description || null,
    },
    defaultValues: { name: "", description: "" },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (chosenCalc) {
      const data = await updateCalculation({
        ...values,
        isUserRegistered: false,
        userId,
        section,
        id: chosenCalc.id,
      });
    } else {
      const data = await createCalculation({
        ...values,
        isUserRegistered: false,
        userId,
        section,
      });
      router.push("/dashboard");
    }
    setIsOpen(false);
    router.refresh();
  }
  return (
    <>
      <Dialog open={isOpen} onOpenChange={(e) => setIsOpen(e)}>
        <DialogTrigger asChild>
          {children ?? (
            <Button>
              {!chosenCalc ? "Додати калькуляцію" : "Редагувати калькуляцію"}
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {!chosenCalc
                ? "Створення назви документу"
                : "Редагування назви документу"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-4 py-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Назва *</FormLabel>
                      <FormControl>
                        <Input placeholder="Назва" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Опис</FormLabel>
                      <FormControl>
                        {
                          //@ts-ignore
                          <Input placeholder="Опис" {...field} />
                        }
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button type="submit">
                  {!chosenCalc ? "Створити" : "Зберегти"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CreateDocument;
