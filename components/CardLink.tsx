import { ExternalLink, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import CandoxaLogo from '@/public/logos/Candoxa_Logo.svg'

type CardLinkProps = {
  wallet_address: string;
  full_wallet_address: string;
  link: string;
  title: string;
  description: string;
  published_date: string;
  love_counter: number;
}

export default function CardLink({ wallet_address, full_wallet_address, link, title, description, published_date, love_counter }: CardLinkProps) {
  return (
    <div className="flex flex-col justify-between min-h-56 md:h-64 w-full max-w-4xl border border-white/20 bg-lavender-blue/80 backdrop-blur-xl rounded-3xl p-4 md:p-6 shadow-2xl shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-300 hover:scale-[1.02] relative overflow-hidden">

      <div className="absolute inset-0 bg-linear-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex justify-between items-start relative z-10">
        <Link href={`/profile/${full_wallet_address}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
          <Image
            src={CandoxaLogo}
            alt="Candoxa Logo"
            width={40}
            height={40}
            className="w-8 h-8 md:w-10 md:h-10"
          />
          <span className="font-sherika text-sm md:text-base text-light-blue hover:underline">{wallet_address}</span>
        </Link>
        <Link
          href={link}
          target="_blank"
        >
          <ExternalLink className="cursor-pointer text-blue-primary hover:text-dark-blue w-5 h-5 md:w-6 md:h-6" />
        </Link>
      </div>
      <div className="flex flex-col gap-1 md:gap-2 relative z-10">
        <h1 className="text-blue-primary font-bold text-lg md:text-2xl underline line-clamp-2">{title}</h1>
        <p className="text-sm md:text-base text-dark-blue line-clamp-2">{description}</p>
      </div>
      <div className="flex justify-between items-center relative z-10">
        <span className="text-xs md:text-sm text-dark-blue">{published_date}</span>
        <div className="flex items-center gap-1.5 md:gap-2 text-dark-blue bg-white/10 backdrop-blur-sm px-2 md:px-3 py-1 md:py-1.5 rounded-full border border-white/20">
          <Heart className="border-none text-red-600 hover:fill-red-600 cursor-pointer transition-all duration-200 w-4 h-4 md:w-5 md:h-5" />
          <span className="text-sm md:text-base">{love_counter}</span>
        </div>
      </div>
    </div>
  )
}