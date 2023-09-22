"use client";
import { EmptyStateAI } from "@/components/empty";
import { Input } from "@/components/ui/input";

import { cn } from "@/lib/utils";
import { useChat } from "ai/react";
import { useTheme } from "next-themes";
import { ElementRef, useEffect, useRef } from "react";
import { BeatLoader } from "react-spinners";

export default function Home() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    data,
    isLoading,
    setInput,
  } = useChat();
  const { theme } = useTheme();
  const scrollRef = useRef<ElementRef<"div">>(null);
  useEffect(() => {
    scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.length > 0 ? (
        messages.map((m) => (
          <div
            key={m.id}
            className={cn("whitespace-pre-wrap", {
              "text-blue-500 text-right p-4  gap-x-8 rounded-lg max-w-lg ":
                m.role === "user",
              "text-green-500 p-4 w-full flex items-start gap-x-8 rounded-lg max-w-lg bg-muted":
                m.role !== "user",
            })}
          >
            {m.role === "user" ? "" : ""}
            {m.content}
          </div>
        ))
      ) : (
        <>
          <EmptyStateAI setInput={setInput} />
        </>
      )}
      <form onSubmit={handleSubmit}>
        {isLoading && (
          <div className="p-4 rounded-lg w-1/2 flex items-center justify-center bg-muted mt-10">
            <BeatLoader
              color={theme === "light" ? "black" : "white"}
              size={5}
            />
          </div>
        )}
        <div ref={scrollRef} />

        <Input
          className="fixed bottom-0 w-[80vw] md:w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Talk to the application..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
