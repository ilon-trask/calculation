"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import supabaseClient from "@/lib/supabaseClient";
import { User } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

function AvatarComp() {
  return (
    <Avatar className="cursor-pointer">
      <AvatarFallback>?</AvatarFallback>
    </Avatar>
  );
}

function TooltipAvatar() {
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div>
          <AvatarComp />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => {
            router.push("/sign-in");
          }}
        >
          <UserIcon className="mr-2 h-4 w-4" />
          <span>Увійти в аккаунт</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function DropdownMenuAvatar() {
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div>
          <AvatarComp />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuItem
          className="text-red-500 cursor-pointer"
          onClick={() => {
            supabaseClient.auth.signOut();
            router.push("/sign-in");
          }}
        >
          <UserIcon className="mr-2 h-4 w-4" />
          <span>Вийти з аккаунту</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function CheckIsUser({ user }: { user: User | undefined }) {
  if (!user) {
    return <TooltipAvatar />;
  }
  return <DropdownMenuAvatar />;
}
export default CheckIsUser;
