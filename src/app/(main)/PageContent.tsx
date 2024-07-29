"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { User } from "@supabase/auth-helpers-nextjs";
import { Docs, DocsType } from "../data/Docs";
import CreateDocument from "../(withHeader)/components/CreateDocument";
import HeaderWrap from "../(withHeader)/components/Header/HeaderWrap";
import Container from "@/components/ui/Container";
import H2 from "@/components/ui/H2";

function PageContent({
  userId,
  supaUser,
}: {
  userId: string | undefined;
  supaUser: User | undefined;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [section, setSection] = useState<DocsType>();
  const router = useRouter();
  return (
    <main>
      <Container>
        <HeaderWrap />
        <div
          style={{ height: "70vh" }}
          className="flex flex-col justify-center"
        >
          <h1 className="font-semibold lg:text-6xl md:text-4xl sm:text-3xl text-2xl text-center mx-6">
            Розрахунок техніко-економічних показників діяльності організацій
          </h1>
          <p className="text-2xl text-center mt-14">
            <span className="font-semibold">Template</span> формування та
            обробка господарських документів
          </p>
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
          <H2 className="text-center">Доступні документи</H2>
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
      </Container>
    </main>
  );
}

export default PageContent;
