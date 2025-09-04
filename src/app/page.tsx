"use client";

import React from "react";
import { RiEraserFill, RiChatHistoryFill, RiDeleteBin6Line } from "@remixicon/react";

import { locale } from "@/data/locale";
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/vendor/drawer";
import { Button } from "@/components/vendor/button";
import { Textarea } from "@/components/vendor/textarea";
import { useHistory } from "@/hooks/useHistory";

function swapLanguage(language: string): string {
  return language === "en-US" ? "ja-JP" : "en-US";
}

export default function Home() {
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const [sourceLanguage, setSourceLanguage] = React.useState("en-US");
  const destLanguage = swapLanguage(sourceLanguage);
  const { history, addEntry, removeEntry, clearHistory } = useHistory();
  const [sourceText, setSourceText] = React.useState("");
  // Dummy data for testing output rendering:
  // const [destText, setDestText] = React.useState("Tailwind プロジェクトで独自のカスタムスタイルを追加するためのベストプラクティス。 フレームワークを使用する際の最大の課題は、フレームワークが対応していない必要なものがある場合に何をすべきかを把握することです。 Tailwindは、何を構築していてもフレームワークと戦っている感じがしないように、拡張可能でカスタマイズ可能にするために最初から設計されています。 このガイドは、デザイントークンのカスタマイズ、必要に応じてその制約から脱出する方法、独自のカスタムCSSの追加、プラグインによるフレームワークの拡張などのトピックをカバーしています。");
  const [destText, setDestText] = React.useState(undefined);
  const [isTranslating, setIsTranslating] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const toggleLanguage = () => {
    setSourceLanguage(swapLanguage);
    setSourceText("");
    // Leave the last destText so the respondant can see it.
    // setDestText(undefined);
    inputRef.current?.focus();
  }

  const controlSize = "text-md";

  const SourceFlag = <span className={controlSize}>{locale[sourceLanguage].flag}</span>;
  const DestFlag = <span className={controlSize}>{locale[destLanguage].flag}</span>;

  const placeholderMessage = locale[sourceLanguage].inputPlaceholder;

  const translate = async () => {
    if (!sourceText.trim()) return;

    inputRef.current?.blur();

    setIsTranslating(true);
    setError(null);

    try {
      const targetLanguage = locale[destLanguage].name;

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

      addEntry(
        sourceText,
        translatedText,
        sourceLanguage === "en-US" ? "en" : "ja",
        sourceLanguage === "en-US" ? "ja" : "en"
      );
      setSourceText("");
      setDestText(translatedText);
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
    <div className="font-sans grid grid-rows-[30px_auto_40px] min-h-screen max-h-screen min-w-full gap-4 px-2 py-2 pb-3">
      <header className="row-start-1 w-full flex items-end-safe">
        <div className="flex-4 shrink-0">
          <b>Understanding</b> v0.0.6
        </div>

        <div className="flex-2" />

        <div className="flex-0 shrink-1 align-middle">
          <Drawer>
            <DrawerTrigger className="block"><RiChatHistoryFill /></DrawerTrigger>
            <DrawerContent className="min-h-[30%] max-h-[80%]">
              <DrawerHeader>
                <DrawerTitle>Translation History</DrawerTitle>
                <DrawerDescription>
                  Past translations you&apos;ve made will appear here.
                </DrawerDescription>
              </DrawerHeader>
              <div className="mx-4 mb-4 min-h-[1fr] max-h-[1fr] overflow-scroll">
                {history && history.entries.length > 0 ? (
                  <>
                    <div className="flex justify-end mb-2">
                      <Button
                        onClick={clearHistory}
                        variant="destructive"
                        className="text-xs"
                      >
                        Clear All History
                      </Button>
                    </div>
                    {history.entries.map((entry) => (
                      <div key={entry.id} className="mb-3 pb-3 border-b border-gray-200 last:border-0">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-xs text-gray-500">
                            {new Date(entry.timestamp).toLocaleString()}
                          </span>
                          <button
                            onClick={() => removeEntry(entry.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                            aria-label="Delete entry"
                          >
                            <RiDeleteBin6Line className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">
                            {entry.sourceLang === "en" ? "🇺🇸" : "🇯🇵"}
                          </span>
                          {" "}
                          {entry.sourceText}
                        </div>
                        <div className="text-sm mt-1">
                          <span className="font-medium">
                            {entry.targetLang === "en" ? "🇺🇸" : "🇯🇵"}
                          </span>
                          {" "}
                          {entry.translatedText}
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="text-center text-gray-500 py-4">
                    No translation history yet
                  </div>
                )}
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </header>
      <main className="row-start-2 w-full flex flex-row items-center gap-x-4">
        <Textarea
          ref={inputRef}
          value={sourceText}
          onChange={(e) => setSourceText(e.target.value)}
          placeholder={placeholderMessage}
          rows={5}
          className="flex-1 text-[18pt] text-gray-900 placeholder:text-gray-400 focus:outline-none rounded-lg w-full h-full"
          lang={sourceLanguage}
          disabled={isTranslating}
        />
        {error ? (
          <div className="flex-1 h-full text-red-500 text-[18pt]">
            Error: {error}
          </div>
        ) : isTranslating ? (
          <div className="flex-1 h-full text-gray-500 text-[18pt]">
            Translating...
          </div>
        ) : destText ? (
          <Textarea value={destText} readOnly className="flex-1 text-[18pt] text-gray-900 w-full h-full resize-none bg-transparent ring-0 focus:ring-0 active:ring-0 border-none focus:border-none outline-none focus:outline-none" />
        ) : (
          <div className="flex-1 h-full text-[18pt] text-gray-400 pt-1.5 leading-[24px]">
            {locale[sourceLanguage].outputPlaceholder}
          </div>
        )}
      </main>

      <main className="row-start-3 w-full flex md:gap-4 gap-2 justify-items-stretch">
        <Button
          className="flex-4 basis-4 text-nowrap px-4"
          onClick={toggleLanguage}
          disabled={isTranslating}
          variant="secondary"
        >
          {SourceFlag}
          <span className={`px-4 ${controlSize}`}>
            →
          </span>
          {DestFlag}
        </Button>

        <span className="flex-2 basis-2" />

        <Button
          className={`flex-8 basis-8 disabled:border-gray-400 text-nowrap ${controlSize}`}
          onClick={translate}
          disabled={isTranslating || !sourceText.trim()}
        >
          {isTranslating ? "Translating..." : locale[sourceLanguage].translateButton}
        </Button>

        <span className="flex-4 basis-4" />

        <Button
          className={`flex-2 basis-2 min-w-8 max-w-8 ${controlSize}`}
          onClick={clearInputOutput}
          disabled={isTranslating}
          variant="destructive"
        >
          <span className="block">
            <RiEraserFill />
          </span>
        </Button>
      </main>
    </div>
  );
}
