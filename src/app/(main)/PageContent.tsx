"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import useNonAuthUserId from "../hooks/useNonAuthUserId";
import { User } from "@supabase/auth-helpers-nextjs";
import { Docs, DocsType } from "../data/Docs";
import CreateDocument from "../(withHeader)/components/CreateDocument";
import Link from "next/link";

function PageContent({
  userId,
  supaUser,
}: {
  userId: string | undefined;
  supaUser: User | undefined;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [section, setSection] = useState<DocsType>();
  if (!supaUser) {
    useNonAuthUserId();
  }
  const router = useRouter();
  return (
    <main>
      <div
        style={{
          height: "70vh",
        }}
        className="flex flex-col justify-center"
      >
        <h1 className="font-semibold lg:text-9xl md:text-8xl sm:text-7xl text-5xl text-center">
          Документи
        </h1>
        <div className="flex justify-center   mt-14 text-gray-600 text-xl sm:text-3xl gap-5 sm:gap-10">
          <p>Роботи</p>
          <p>Послуги</p>
          <p>Продукція</p>
        </div>
        <div className="flex flex-col justify-center">
          <div className="flex justify-center mt-28 gap-8">
            <Button
              size={"lg"}
              variant={"outline"}
              onClick={() => router.push("/sign-in")}
            >
              Увійти
            </Button>
            <Button onClick={() => router.push("/dashboard")} size={"lg"}>
              Спробувати
            </Button>
          </div>
          <p className="text-center mt-4">Якщо не маєте аккаунту</p>
          <div className="flex justify-center mt-2">
            <Button
              size={"lg"}
              variant={"outline"}
              onClick={() => router.push("/sign-up")}
            >
              Зареєструватись
            </Button>
          </div>
        </div>
      </div>
      <div className="max-w-screen-xl mx-auto px-3">
        <h1 className="font-semibold lg:text-5xl  text-2xl">Шаблони</h1>
        <div className="gap-4 flex flex-col mt-6">
          {Docs.map((el) => (
            <Card key={el.id}>
              <div className="py-4 px-4 flex justify-between">
                <CardTitle className="text-2xl">{el.name}</CardTitle>
                <div className="gap-3 flex">
                  <Button
                    onClick={() => {
                      setIsOpen(true);
                      setSection(el.name);
                    }}
                  >
                    Створити
                  </Button>
                  <Button variant={"outline"}>Переглянути</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
      <CreateDocument
        section={section!}
        serverUserId={userId!}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        chosenCalc={undefined}
      >
        {""}
      </CreateDocument>
    </main>
  );
}

export default PageContent;
