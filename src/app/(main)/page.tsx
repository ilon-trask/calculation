"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <main className="flex flex-col h-screen justify-center">
      <h1 className="font-semibold lg:text-9xl md:text-8xl sm:text-7xl text-5xl text-center">
        Калькуляція
      </h1>
      <div className="flex justify-center   mt-14 text-gray-600 text-xl sm:text-3xl gap-5 sm:gap-10">
        <p>Роботи</p>
        <p>Послуги</p>
        <p>Продукція</p>
      </div>
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
    </main>
  );
}
