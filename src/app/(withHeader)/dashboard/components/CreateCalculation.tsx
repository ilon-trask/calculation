"use client";

import useNonAuthUserId from "@/app/hooks/useNonAuthUserId";
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
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createCalculation } from "../dashboard.actions";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Назва повинне містити більше 2 символів",
  }),
  description: z.string().optional(),
});

function CreateCalculation({
  serverUserId,
}: {
  serverUserId: string | undefined;
}) {
  const router = useRouter();
  const userId = serverUserId || useNonAuthUserId();

  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const data = await createCalculation({
      ...values,
      isUserRegistered: false,
      userId,
    });
    setIsOpen(false);
    router.refresh();
  }
  return (
    <>
      <Dialog open={isOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setIsOpen(true)}>Додати калькуляцію</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Створення калькуляції</DialogTitle>
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
                        <Input placeholder="Опис" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button type="submit">Створити</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CreateCalculation;
