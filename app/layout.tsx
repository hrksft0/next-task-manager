// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TasksProvider } from "@/hooks/useLocalTasks";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="sticky top-0 h-20 border-gray-500 bg-gray-300 flex items-center justify-center">
          <h1 className="text-2xl">タスク管理アプリ</h1>
        </div>
        <TasksProvider>{children}</TasksProvider>
      </body>
    </html>
  );
}
