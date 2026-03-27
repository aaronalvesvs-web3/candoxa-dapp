import type { Metadata } from "next";
import localFont from "next/font/local"
import { Poppins } from "next/font/google";
import { ReactNode } from "react";
import Image from "next/image";
import BackgroundImageDApp from '@/public/images/Background.png'
import BackgroundGridImageDApp from '@/public/images/Background_Grid.png'
import { Toaster } from "@/components/ui/sonner"

import "./globals.css";
import Navbar from "@/components/Navbar";
import { Web3Provider } from "@/providers/Web3Provider";
import { cookieToInitialState } from "wagmi";
import { getConfig } from "@/lib/web3/wagmi";
import { headers } from "next/headers";

const sherika = localFont({
  src: [
    {
      path: "../public/fonts/Sherika-ExtraBold.otf",
      weight: '800',
      style: "extrabold"
    }
  ],
  variable: "--font-sherika"
})

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ['400', '500', '600', '700']
});

export const metadata: Metadata = {
  title: "Candoxa",
  description: "DApp for creators to gather verified links in a public profile, with on-chain reputation and community curation.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const initialState = cookieToInitialState(
    getConfig(),
    (await headers()).get('cookie'),
  )

  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${sherika.variable} antialiased`}
      >
        <Web3Provider initialState={initialState}>
          <div className="fixed inset-0 -z-10">
            <Image
              src={BackgroundGridImageDApp}
              alt="Background Grid Image DApp"
              fill
              className="object-cover"
              quality={100}
              priority
            />
            <Image
              src={BackgroundImageDApp}
              alt="Background Image DApp"
              fill
              className="object-cover animate-fadeOut"
              quality={100}
              priority
            />
          </div>
          <div className="animate-fadeIn h-screen flex flex-col">
            <Navbar />
            <main className="pt-25 flex-1 overflow-y-auto">
              {children}
            </main>
            <Toaster position="bottom-center" />
          </div>
        </Web3Provider>
      </body>
    </html>
  );
}
