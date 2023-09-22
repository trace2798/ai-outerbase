"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UseChatHelpers } from "ai/react";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import Typewriter from "typewriter-effect";

const exampleMessages = [
  {
    heading: "Ask you data a question",
    message: `Tell me about my data`,
  },
  {
    heading: "Ask about books you have added",
    message: "What are the names of the books I have added?",
  },
  {
    heading: "Ask for numbers",
    message:
      "Can you tell me about the numbers of books and reviews I have added?",
  },
];

export function EmptyStateAI({ setInput }: Pick<UseChatHelpers, "setInput">) {
  const [isTypingDone, setIsTypingDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTypingDone(true);
    }, 11000);

    return () => clearTimeout(timer); // This will clear the timeout if the component unmounts before the timeout finishes
  }, []);
  return (
    <>
      {!isTypingDone && (
        <div className="text-2xl font-ranadeRegular">
          <Typewriter
            options={{
              strings: ["Welcome", "Ask your data a question"],
              autoStart: true,
              loop: true,
            }}
          />
        </div>
      )}
      {isTypingDone && (
        <Card className="p-5 bg-muted font-ranadeLight">
          <div className="flex flex-col items-center w-full justify-center">
            <p className="w-full mt-3">
              {" "}
              Not custom trained on this data so response likely to hallucinate.
            </p>
            <p className="w-full mt-3">
              The data for the answers have been fetch using Outerbase Commands.
            </p>
          </div>
          <div className="mt-4 flex flex-col items-start space-y-2">
            {exampleMessages.map((message, index) => (
              <Button
                key={index}
                variant="link"
                className="h-auto p-0 text-base"
                onClick={() => setInput(message.message)}
              >
                <ArrowRight className="mr-2 text-muted-foreground" />
                {message.heading}
              </Button>
            ))}
          </div>
        </Card>
      )}
    </>
  );
}
