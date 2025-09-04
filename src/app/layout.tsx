import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Understanding",
  description: "A tool to help people understand each other",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <link rel="manifest" href="manifest.json" />
        <meta name="format-detection" content="telephone=no" />
        <meta
          name="viewport"
          content="width=device-width, height=device-height, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
      </head>
      <body
        className="antialiased overflow-clip"
      >
        {children}
      </body>
    </html>
  );
}
