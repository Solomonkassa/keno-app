import type React from "react"
import { Inter } from "next/font/google"
import { Providers } from "./providers"
import { MainNav } from "@/components/main-nav"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Keno Web App",
  description: "Play Keno online and win big!",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <MainNav />
            <main className="flex-grow">{children}</main>
            <footer className="py-4 text-center bg-gray-100">© 2025 Keno Web App. All rights reserved.</footer>
          </div>
        </Providers>
      </body>
    </html>
  )
}



import './globals.css'