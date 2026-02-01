import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Grammar Bot - AI-Powered Grammar Correction',
  description: 'Fix your grammar instantly with AI-powered correction. Powered by Google Gemini.',
  keywords: ['grammar', 'correction', 'AI', 'writing', 'english'],
  authors: [{ name: 'Dhany Yudi Prasetyo' }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
