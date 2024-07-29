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
import { useRouter } from "next/navigation";
import { businessDocs, businessDocType } from "../BusinessTable";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const typeOfMoveForSelect = ["Всі", "Доходи", "Витрати"] as const;
const typesOfMove = [...typeOfMoveForSelect, ""] as const;

const formSchema = z.object({
  from: z.string(),
  to: z.string(),
  type: z.enum(typesOfMove),
});
type formType = z.infer<typeof formSchema>;
type formTypeType = formType["type"];

function CreateBusinessPlanDocPopUp({
  section,
  serverUserId,
  isOpen,
  setIsOpen,
  //   data,
  children,
}: {
  section: businessDocType;
  serverUserId: string;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  //   data: Calculation | undefined;
  children?: React.ReactNode;
}) {
  const router = useRouter();
  const userId = serverUserId;

  const form = useForm<formType>({
    resolver: zodResolver(formSchema),
    values: {
      from: "",
      to: "",
      type: "",
    },
    defaultValues: { from: "", to: "", type: "" },
  });
  async function onSubmit(values: formType) {
    router.push(
      window.location.pathname +
        "/subordinate/" +
        businessDocs.find((el) => el.name == section)?.link +
        "/" +
        values.from +
        "/" +
        values.to +
        "/" +
        values.type
    );

    setIsOpen(false);
    router.refresh();
  }
  // for now, delete it later
  const data = null;
  return (
    <>
      <Dialog open={isOpen} onOpenChange={(e) => setIsOpen(e)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {!data
                ? `Створення документу "` + section.toLocaleLowerCase() + `"`
                : `Редагування документу "` + section.toLocaleLowerCase() + `"`}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div>
                <p>Виберіть період</p>
                <div className="flex justify-between">
                  <FormField
                    control={form.control}
                    name="from"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>З</FormLabel>
                        <FormControl>
                          <Input placeholder="" type="month" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="to"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>До</FormLabel>
                        <FormControl>
                          {
                            //@ts-ignore
                            <Input placeholder="" type="month" {...field} />
                          }
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Тип</FormLabel>
                    <FormControl>
                      {
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Тип" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {typeOfMoveForSelect.map((el) => (
                                <SelectItem value={el} key={el}>
                                  {el}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      }
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">{!data ? "Створити" : "Зберегти"}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CreateBusinessPlanDocPopUp;
