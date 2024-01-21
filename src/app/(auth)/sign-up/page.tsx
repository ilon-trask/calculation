"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import supabaseClient from "@/lib/supabaseClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  email: z
    .string()
    .nonempty("Email не може бути пустим")
    .email("форматування не відповідає email"),
  password: z
    .string()
    .nonempty("Пароль не може бути пустим")
    .min(8, "мінімальна довжина 8 "),
});

function page() {
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(schema),
  });
  const [err, setErr] = useState("");
  const [show, setShow] = useState(false);
  const router = useRouter();
  const onSubmit = async (res: z.infer<typeof schema>) => {
    const { data, error } = await supabaseClient.auth.signUp({
      email: res.email,
      password: res.password,
      options: {
        emailRedirectTo: "http://localhost:3000/auth/callback",
      },
    });
    if (!error) {
      setShow(true);
    } else {
      setErr(error.message);
    }
  };
  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-fit max-w-96">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Створення аккаунту</CardTitle>
          <CardDescription>
            Введіть свої дані для створення аккаунту
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="password">Пароль</FormLabel>
                    <FormControl>
                      <Input id="password" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {show ? (
                <p className="text-sm font-medium text-red-500">
                  Лист для підтвердження було надіслано на пошту.
                  <br />
                  Перегляньте пошту та активуйте посилання
                </p>
              ) : null}
              {err ? (
                <p className="text-sm font-medium text-destructive">{err}</p>
              ) : null}
              {!show ? (
                <Button type="submit" className="w-full">
                  Створити аккаунт
                </Button>
              ) : null}
            </form>
          </Form>
          <div className="text-center">
            <Button variant="link" onClick={() => router.push("/sign-in")}>
              Уже маєте аккаунт? Увійти
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default page;
