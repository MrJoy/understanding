"use client";

import React from "react";

import { Button } from "@/components/button";

const locale: Record<string, Record<string, string>> = {
  "en-US": {
    inputPlaceholder: "Type something in English...",
    outputPlaceholder: "Translated text will appear here",
    translateButton: "Translate to Japanese",
  },
  "ja-JP": {
    inputPlaceholder: "日本語で何かを入力してください...",
    outputPlaceholder: "翻訳されたテキストがここに表示されます",
    translateButton: "英語に翻訳してください",
  },
}

export default function Home() {
  const [sourceLanguage, setSourceLanguage] = React.useState("en-US");
  const [history, setHistory] = React.useState<string[][]>([]);
  const [sourceText, setSourceText] = React.useState("");

  const toggleLanguage = () => {
    setSourceLanguage((prev) => (prev === "en-US" ? "ja-JP" : "en-US"));
  }

  const Us = <span className="flex-1 fi fi-us"></span>;
  const Jp = <span className="flex-1 fi fi-jp"></span>;

  const placeholderMessage = locale[sourceLanguage].inputPlaceholder;

  const translate = () => {
    // TODO: Use ChatGPT to perform the translation.
    const translatedText = "TODO...";

    setHistory((prev) => [[sourceText, translatedText], ...prev]);
  };

  const resetHistory = () => {
    setHistory([]);
    setSourceText("");
  };

  return (
    <div className="font-sans grid grid-rows-[40px_auto_200px] min-h-screen max-h-screen min-w-full p-2 pb-20 gap-4 sm:p-1">
      <header className="row-start-1 w-full flex gap-4 justify-items-stretch">
        <Button className="flex-4 basis-4 text-nowrap px-4" onClick={toggleLanguage}>
          {sourceLanguage === "en-US" ? Us : Jp}
          <span className="px-4">
            →
          </span>
          {sourceLanguage === "en-US" ? Jp : Us}
        </Button>

        <Button className="flex-8 basis-8 text-nowrap" onClick={translate}>
          {locale[sourceLanguage].translateButton}
        </Button>

        <span className="flex-4 basis-4" />

        <Button className="flex-1" onClick={resetHistory}>
          <span className="min-w-4 max-w-4 block">
            X
          </span>
        </Button>
      </header>

      <main className="row-start-2 w-full flex flex-row items-center gap-x-4">
        <textarea
          value={sourceText}
          onChange={(e) => setSourceText(e.target.value)}
          placeholder={placeholderMessage}
          rows={5}
          className="flex-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none rounded-lg w-full"
          lang={sourceLanguage}
        />
        {history.length > 0 ? (
          <div className="flex-1 text-base text-gray-900">
            {history[0][1]}
          </div>
        ) : (
          <div className="flex-1 text-base text-gray-400">
            {locale[sourceLanguage].outputPlaceholder}
          </div>
        )}
      </main>

      <footer className="row-start-3 w-full !max-h-[200px] overflow-scroll">
        {history.map((item, index) => (
          <div key={index}>
            {item[0]}
            →
            {item[1]}
          </div>
        ))}
      </footer>
    </div>
  );
}
