import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Appbar from "@/components/Appbar";
import { ThemeProvider } from "next-themes";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import { Providers } from "@/lib/Providers";
import SocketProvider from "@/context/SocketProvider";

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
  title: "SyncStream",
  description: "Sync Stream is a platform for watching videos with friends.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        <SocketProvider>
        <ThemeProvider attribute={"class"} defaultTheme="system" enableSystem disableTransitionOnChange>
          <Providers>
            <Appbar/>
            {children}
            <Toaster position="top-center"/>
            <Footer/>
          </Providers>
        </ThemeProvider>
        </SocketProvider>
      </body>
    </html>
  );
}
