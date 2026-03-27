"use client"

import Image from "next/image";
import { Button } from "./ui/button";
import CandoxaLogo from '@/public/logos/Candoxa_Logo.svg'
import MetaMask from '@/public/icons/MetaMask.svg'
import Link from "next/link";
import { LogOut, Menu, X } from 'lucide-react'
import { useConnect, useConnection, useDisconnect } from "wagmi";
import { toast } from "sonner";
import { useState } from "react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const connection = useConnection()
  const { connect, connectors } = useConnect({
    mutation: {
      onSuccess: () => {
        toast.success('Wallet Connected Successfully!')
        setMobileMenuOpen(false)
      },
      onError: (error) => {
        console.error('Connection error:', error)
        toast.error('Failed to connect wallet. Please try again.')
      }
    }
  })
  const { disconnect } = useDisconnect({
    mutation: {
      onSuccess: () => {
        toast.info('Wallet Disconnected')
        setMobileMenuOpen(false)
      }
    }
  })

  const handleConnect = () => {
    // Detecta se está em dispositivo mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    // Tenta usar injected primeiro (MetaMask browser ou extensão)
    const injectedConnector = connectors.find(c => c.type === 'injected')
    const walletConnectConnector = connectors.find(c => c.type === 'walletConnect')

    // Se estiver em mobile e não tiver window.ethereum, usa WalletConnect
    if (isMobile && typeof window !== 'undefined' && !window.ethereum) {
      if (walletConnectConnector) {
        toast.info('Opening WalletConnect...')
        connect({ connector: walletConnectConnector })
      } else {
        // Sugere abrir no navegador da MetaMask
        const currentUrl = window.location.href
        const metamaskDeepLink = `https://metamask.app.link/dapp/${currentUrl.replace(/^https?:\/\//, '')}`

        toast.error('Please open this link in MetaMask browser', {
          action: {
            label: 'Open in MetaMask',
            onClick: () => {
              window.location.href = metamaskDeepLink
            },
          },
          duration: 10000,
        })
      }
    } else if (injectedConnector) {
      // Desktop ou mobile com MetaMask browser
      connect({ connector: injectedConnector })
    } else if (walletConnectConnector) {
      // Fallback para WalletConnect
      connect({ connector: walletConnectConnector })
    } else {
      toast.error('No wallet connector available. Please install MetaMask.')
    }
  }

  return (
    <nav className="flex items-center justify-between p-4 md:p-6 bg-lavender-blue fixed w-full z-20 border-b-2 border-dark-blue">
      <Link href="/" onClick={() => setMobileMenuOpen(false)}>
        <Image
          src={CandoxaLogo}
          alt="Candoxa Logo"
          width={50}
          height={50}
          className="w-10 h-10 md:w-12 md:h-12"
        />
      </Link>

      {/* Desktop Menu */}
      {connection.status === 'connected' && (
        <ul className="hidden md:flex gap-8 text-lg font-medium text-dark-blue">
          <li className="hover:underline hover:text-blue-primary cursor-pointer">
            <Link href="/">
              Home
            </Link>
          </li>
          <li className="hover:underline hover:text-blue-primary cursor-pointer">
            <Link href="/discover">
              Discover
            </Link>
          </li>
        </ul>
      )}

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden p-2 text-blue-primary hover:bg-light-blue/20 rounded-lg transition-colors"
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Desktop Connect/Profile */}
      <div className="hidden md:flex items-center">
        {connection.addresses && connection.addresses.length > 0 ?
          <div className="flex items-center gap-4">
            <Link href="/profile" className="flex flex-col items-center hover:opacity-80 transition-opacity">
              <span className="font-bold text-xl text-blue-primary">{`${(connection.addresses[0]).slice(0, 6)}....${(connection.addresses[0]).slice(-4)}`}</span>
              <span className="font-sherika text-dark-blue hover:underline">My Profile</span>
            </Link>
            <Button
              size="icon"
              onClick={() => disconnect()}
              className="p-6 cursor-pointer text-light-blue hover:text-white hover:bg-light-blue rounded-full"
            >
              <LogOut />
            </Button>
          </div>
          :
          <Button
            className="flex items-center gap-4 p-6 bg-light-blue hover:underline cursor-pointer rounded-full text-white font-bold hover:bg-blue-primary"
            onClick={handleConnect}
          >
            <Image
              src={MetaMask}
              alt="MetaMask Logo"
              width={30}
              height={30}
            />
            Connect with MetaMask
          </Button>
        }
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-lavender-blue border-b-2 border-dark-blue shadow-lg">
          <div className="flex flex-col p-4 gap-4">
            {connection.status === 'connected' && (
              <div className="flex flex-col gap-2 border-b border-dark-blue/20 pb-4">
                <Link
                  href="/"
                  className="text-dark-blue hover:text-blue-primary font-medium py-2 px-4 hover:bg-light-blue/20 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/discover"
                  className="text-dark-blue hover:text-blue-primary font-medium py-2 px-4 hover:bg-light-blue/20 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Discover
                </Link>
              </div>
            )}

            {connection.addresses && connection.addresses.length > 0 ? (
              <div className="flex flex-col gap-3">
                <Link
                  href="/profile"
                  className="flex flex-col items-center p-4 hover:bg-light-blue/20 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="font-bold text-lg text-blue-primary">{`${(connection.addresses[0]).slice(0, 6)}....${(connection.addresses[0]).slice(-4)}`}</span>
                  <span className="font-sherika text-dark-blue text-sm">My Profile</span>
                </Link>
                <Button
                  onClick={() => disconnect()}
                  className="flex items-center justify-center gap-2 p-4 bg-red-500/20 hover:bg-red-500 text-red-700 hover:text-white rounded-lg font-medium transition-colors"
                >
                  <LogOut size={20} />
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button
                className="flex items-center justify-center gap-3 p-4 bg-light-blue hover:bg-blue-primary text-white font-bold rounded-lg transition-colors"
                onClick={handleConnect}
              >
                <Image
                  src={MetaMask}
                  alt="MetaMask Logo"
                  width={24}
                  height={24}
                />
                Connect with MetaMask
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
