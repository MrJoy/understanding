"use client";

import React from "react";

import { Button } from "@/components/button";

const locale: Record<string, Record<string, string>> = {
  "en-US": {
    inputPlaceholder: `Type something in English...

(If the user is pointing here, they would like you to use this app to communicate with them.)`,
    outputPlaceholder: "Translated text will appear here",
    translateButton: "Translate to Japanese",
  },
  "ja-JP": {
    inputPlaceholder: `日本語で何かを入力してください...

（もし相手がここを指していたら、このアプリを使って自分とコミュニケーションを取りたいという意味です。）`,
    outputPlaceholder: "翻訳されたテキストがここに表示されます",
    translateButton: "英語に翻訳してください",
  },
}

export default function Home() {
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const [sourceLanguage, setSourceLanguage] = React.useState("en-US");
  const [history, setHistory] = React.useState<string[][]>([]);
  const [sourceText, setSourceText] = React.useState("");
  const [destText, setDestText] = React.useState(undefined);
  const [isTranslating, setIsTranslating] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const toggleLanguage = () => {
    setSourceLanguage((prev) => (prev === "en-US" ? "ja-JP" : "en-US"));
  }

  const controlSize = "text-lg";

  const Us = <span className={controlSize}>🇺🇸</span>;
  const Jp = <span className={controlSize}>🇯🇵</span>;

  const placeholderMessage = locale[sourceLanguage].inputPlaceholder;

  const translate = async () => {
    if (!sourceText.trim()) return;

    setIsTranslating(true);
    setError(null);

    try {
      let translatedText;
      if (process.env.NEXT_PUBLIC_SKIP_TRANSLATION) {
        translatedText = "[Translation API is currently disabled]";
      } else {
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

        translatedText = data.translation;
      }

      setHistory((prev) => [[sourceText, translatedText], ...prev]);
      toggleLanguage();
      setSourceText("");
      setDestText(translatedText);
      inputRef.current?.focus();
    } catch (err) {
      console.error("Translation error:", err);
      setError(err instanceof Error ? `Error: ${err.message}` : "Translation failed. Please try again.");
    } finally {
      setIsTranslating(false);
    }
  };

  const clearInputOutput = () => {
    setSourceText("");
    setDestText(undefined);
  };

  return (
    <div className="font-sans grid grid-rows-[auto_40px_200px] min-h-screen max-h-screen min-w-full p-2 pb-20 gap-4 sm:p-1">
      <header className="row-start-1 w-full flex flex-row items-center gap-x-4">
        <textarea
          ref={inputRef}
          value={sourceText}
          onChange={(e) => setSourceText(e.target.value)}
          placeholder={placeholderMessage}
          rows={5}
          className="flex-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none rounded-lg w-full h-full"
          lang={sourceLanguage}
          disabled={isTranslating}
        />
        <div className="flex-1 h-full pt-1.5">
          {error ? (
            <div className="text-red-500 text-base">
              Error: {error}
            </div>
          ) : isTranslating ? (
            <div className="text-gray-500 text-base">
              Translating...
            </div>
          ) : destText ? (
            <div className="text-base text-gray-900">
              {destText}
            </div>
          ) : (
            <div className="text-base text-gray-400">
              {locale[sourceLanguage].outputPlaceholder}
            </div>
          )}
        </div>
      </header>

      <main className="row-start-2 w-full flex gap-4 justify-items-stretch">
        <Button className="flex-4 basis-4 text-nowrap px-4" onClick={toggleLanguage}>
          {sourceLanguage === "en-US" ? Us : Jp}
          <span className={`px-4 ${controlSize}`}>
            →
          </span>
          {sourceLanguage === "en-US" ? Jp : Us}
        </Button>

        <Button
          className={`flex-8 basis-8 text-nowrap ${controlSize}`}
          onClick={translate}
          disabled={isTranslating || !sourceText.trim()}
        >
          {isTranslating ? "Translating..." : locale[sourceLanguage].translateButton}
        </Button>

        <span className="flex-4 basis-4" />

        <Button className={`flex-1 min-w-6 max-w-6 ${controlSize}`} onClick={clearInputOutput}>
          <span className="block">
            X
          </span>
        </Button>
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
