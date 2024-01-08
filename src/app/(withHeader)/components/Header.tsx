import { Avatar, AvatarFallback } from "@/components/ui/avatar";

function Header() {
  return (
    <div className="flex justify-between h-16 items-center mb-3">
      <p className="font-semibold text-2xl">Logo</p>
      <Avatar className="cursor-pointer">
        <AvatarFallback>?</AvatarFallback>
      </Avatar>
    </div>
  );
}

export default Header;
