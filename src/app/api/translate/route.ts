import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { text, targetLanguage } = await request.json();

    if (!text || !targetLanguage) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (process.env.NEXT_PUBLIC_SKIP_TRANSLATION) {
      // For something very very long, to test scrolling of the output area:
      // "Tailwind プロジェクトで独自のカスタムスタイルを追加するためのベストプラクティス。 フレームワークを使用する際の最大の課題は、フレームワークが対応していない必要なものがある場合に何をすべきかを把握することです。 Tailwindは、何を構築していてもフレームワークと戦っている感じがしないように、拡張可能でカスタマイズ可能にするために最初から設計されています。 このガイドは、デザイントークンのカスタマイズ、必要に応じてその制約から脱出する方法、独自のカスタムCSSの追加、プラグインによるフレームワークの拡張などのトピックをカバーしています。";
      return NextResponse.json({ translation: `[${targetLanguage}] ${text}` });
    }

    const prompt = `Translate the following text to ${targetLanguage}.  The text might consist of a single word, phrase, or number.  Only provide the translation without any explanation or additional text:\n\n${text}`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4-turbo-2024-04-09",
      temperature: 0.3,
      max_tokens: 1000,
    });

    const translation = completion.choices[0]?.message?.content?.trim() || "Translation failed";

    return NextResponse.json({ translation });
  } catch (error) {
    console.error("Translation error:", error);
    return NextResponse.json(
      { error: "Translation failed" },
      { status: 500 }
    );
  }
}
