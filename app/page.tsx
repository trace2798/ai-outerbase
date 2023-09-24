"use client";
import ButtonRotatingBackgroundGradient from "@/components/button-ai";
import { CreateIndexSheet } from "@/components/create-index-sheet";
import { TypingEffect } from "@/components/typewriter";
import Update from "@/components/update";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center text-center h-screen py-24 mx-[10vw]">
      {/* <CreateIndexSheet /> */}
      <h1 className="font-bold text-4xl">Amalgam: A blend between</h1>
      <TypingEffect />
      <h3 className="text-xl mt-5 font-ranadeRegular text-center">
        This is my submission for{" "}
        <a
          href="https://hashnode.com/hackathons/outerbase"
          target="_blank"
          className="text-xl hover:underline font-satoshiBlack "
        >
          Outerbase x Hashnode
        </a>{" "}
        hackathon. <br />
        <a
          href="https://shreyas-chaliha.hashnode.dev/"
          target="_blank"
          className="underline hover:cursor-pointer text-base hover:text-indigo-500"
        >
          Hashnode Article
        </a>
      </h3>
      <Link href="/ai">
        <ButtonRotatingBackgroundGradient />
      </Link>
      {/* <Update /> */}
    </div>
  );
}
