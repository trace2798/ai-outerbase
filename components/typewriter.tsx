"use client";
import { m } from "framer-motion";
import React from "react";

export function TypingEffect() {
  const text = " Outerbase, Pinecone and OpenAI";
  const [displayedText, setDisplayedText] = React.useState("");
  const [i, setI] = React.useState(0);

  React.useEffect(() => {
    const typingEffect = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prevState) => prevState + text.charAt(i));
        setI(i + 1);
      } else {
        clearInterval(typingEffect);
      }
    }, 200);

    return () => {
      clearInterval(typingEffect);
    };
  }, [i]);

  return (
    <h1 className=" font-display text-4xl font-bold tracking-[-0.02em] drop-shadow-sm md:text-2xl ">
      {displayedText ? displayedText : "Outerbase, Pinecone and OpenAI"}
    </h1>
  );
}
