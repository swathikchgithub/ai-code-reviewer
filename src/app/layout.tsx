import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Code Reviewer - Professional Code Feedback",
  description: "Paste your code snippet and get structured reviews, scores, and targeted fixes from AI Senior Developers and Mentors.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
