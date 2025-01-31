import "./globals.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import Header from "@/app/_navigation/header";
import ThemeProvider from "@/components/themes/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import Sidebar from "@/app/_navigation/sidebar/components/sidebar";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import ReactQueryProvider from "./_providers/react-query/react-query-provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "The Road to Next",
  description: "My Road to Next application ...",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NuqsAdapter>
          <ThemeProvider>
            <ReactQueryProvider>
              <Header />
              <div className="flex h-screen overflow-hidden border-collapse">
                <Sidebar />
                <main
                  className="
            min-h-screen flex-1
            overflow-y-auto overflow-x-hidden
            py-24 px-8
            bg-secondary/20
            flex flex-col
          "
                >
                  {children}
                </main>
              </div>
              <Toaster expand />
            </ReactQueryProvider>
          </ThemeProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
