import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CogniMateAI — AI Study Assistant",
  description:
    "AI-powered learning platform that helps students study smarter with summaries, quizzes, flashcards, and personalized study plans.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg-primary text-text-primary font-sans">
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#1F2937",
                color: "#F9FAFB",
                border: "1px solid #374151",
                borderRadius: "0.75rem",
                fontSize: "0.875rem",
              },
              success: {
                iconTheme: { primary: "#10B981", secondary: "#F9FAFB" },
              },
              error: {
                iconTheme: { primary: "#EF4444", secondary: "#F9FAFB" },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
