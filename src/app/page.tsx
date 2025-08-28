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
  const [isTranslating, setIsTranslating] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const toggleLanguage = () => {
    setSourceLanguage((prev) => (prev === "en-US" ? "ja-JP" : "en-US"));
  }

  const Us = <span className="flex-1 fi fi-us"></span>;
  const Jp = <span className="flex-1 fi fi-jp"></span>;

  const placeholderMessage = locale[sourceLanguage].inputPlaceholder;

  const translate = async () => {
    if (!sourceText.trim()) return;

    setIsTranslating(true);
    setError(null);

    try {
      const targetLanguage = sourceLanguage === "en-US" ? "Japanese" : "English";

      const response = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: sourceText,
          targetLanguage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Translation failed");
      }

      const translatedText = data.translation;
      setHistory((prev) => [[sourceText, translatedText], ...prev]);
      toggleLanguage();
      setSourceText("");
    } catch (err) {
      console.error("Translation error:", err);
      setError(err instanceof Error ? err.message : "Translation failed. Please try again.");
    } finally {
      setIsTranslating(false);
    }
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

        <Button
          className="flex-8 basis-8 text-nowrap"
          onClick={translate}
          disabled={isTranslating || !sourceText.trim()}
        >
          {isTranslating ? "Translating..." : locale[sourceLanguage].translateButton}
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
          disabled={isTranslating}
        />
        <div className="flex-1">
          {error ? (
            <div className="text-red-500 text-base">
              Error: {error}
            </div>
          ) : isTranslating ? (
            <div className="text-gray-500 text-base">
              Translating...
            </div>
          ) : history.length > 0 ? (
            <div className="text-base text-gray-900">
              {history[0][1]}
            </div>
          ) : (
            <div className="text-base text-gray-400">
              {locale[sourceLanguage].outputPlaceholder}
            </div>
          )}
        </div>
      </main>

      <footer className="row-start-3 w-full !max-h-[200px] overflow-scroll">
        {history.map((item, index) => (
          <div key={index}>
            {item[0]}
            <span className="px-2">
              →
            </span>
            {item[1]}
          </div>
        ))}
      </footer>
    </div>
  );
}
