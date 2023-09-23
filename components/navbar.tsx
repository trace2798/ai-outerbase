import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { FC } from "react";
import { ModeToggle } from "./mood-toggle";

const font = Poppins({ weight: "600", subsets: ["latin"] });
interface navbarProps {}

export const Navbar: FC<navbarProps> = ({}) => {
  return (
    <>
      <div className="fixed w-full z-50 flex justify-between items-center py-2 px-4 h-16 border-b border-primary/10 dark:bg-zinc-950">
        <div className="flex items-center">
          <Link href="/">
            <h1
              className={cn(
                " text-xl md:text-3xl font-bold text-primary",
                font.className
              )}
            >
              Amalgam
            </h1>
          </Link>
        </div>
        <div className="flex items-center gap-x-3">
          <ModeToggle />
        </div>
      </div>
    </>
  );
};
