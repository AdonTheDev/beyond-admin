import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BEYONDMENU | Premium Cafe & Artisanal Coffee Experience",
  description: "Experience handcrafted specialty coffee, gourmet pastries, and a modern cafe atmosphere at BEYONDMENU. Order online or visit our locations.",
  keywords: ["cafe", "specialty coffee", "gourmet pastries", "artisanal coffee", "modern cafe", "breakfast", "lunch"],
  authors: [{ name: "BEYONDMENU Team" }],
  creator: "BEYONDMENU",
  publisher: "BEYONDMENU",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
    shortcut: "/shortcut-icon.png",
  },
  openGraph: {
    type: "website",
    url: "https://beyondmenu.com",
    title: "BEYONDMENU | Premium Cafe & Artisanal Coffee Experience",
    description: "Experience handcrafted specialty coffee, gourmet pastries, and a modern cafe atmosphere at BEYONDMENU.",
    siteName: "BEYONDMENU",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "BEYONDMENU Cafe" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "BEYONDMENU | Premium Cafe & Artisanal Coffee Experience",
    description: "Experience handcrafted specialty coffee, gourmet pastries, and a modern cafe atmosphere at BEYONDMENU.",
    images: [{ url: "/twitter-image.jpg", width: 1200, height: 600, alt: "BEYONDMENU Cafe" }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  generator: "BEYONDMENU"
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#5A3825"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}