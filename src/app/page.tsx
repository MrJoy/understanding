"use client";

import React from "react";

import { Button } from "@/components/button";

export default function Home() {
  const [sourceLanguage, setSourceLanguage] = React.useState("en-US");

  const toggleLanguage = () => {
    setSourceLanguage((prev) => (prev === "en-US" ? "ja-JP" : "en-US"));
  }

  const Us = <span className="flex-1 fi fi-us"></span>;
  const Jp = <span className="flex-1 fi fi-jp"></span>;

  const placeholderMessage = sourceLanguage === "en-US" ? "Type something in English..." : "日本語で何かを入力してください...";

  const translate = () => {
    // TODO: Use ChatGPT to perform the translation.
  }

  return (
    <div className="font-sans grid grid-rows-[40px_1fr_20px] items-start justify-items-center min-h-screen min-w-full p-8 pb-20 gap-16 sm:p-20">
      <header className="row-start-1 w-full flex gap-16 justify-items-stretch">
        <Button className="flex-1 basis-1 text-nowrap px-4" onClick={toggleLanguage}>
          {sourceLanguage === "en-US" ? Us : Jp}
          <span className="px-4">
            →
          </span>
          {sourceLanguage === "en-US" ? Jp : Us}
        </Button>

        <Button className="flex-4 basis-4 text-nowrap" onClick={translate}>
          {sourceLanguage === "en-US" ? "Translate to Japanese" : "英語に翻訳してください"}
        </Button>
      </header>

      <main className="w-full flex flex-col row-start-2 items-center sm:items-start">
        <textarea
          placeholder={placeholderMessage}
          rows={20}
          className="flex-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none rounded-lg w-full"
          lang={sourceLanguage}
        />
      </main>

      {/* <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
      </footer> */}
    </div>
  );
}
