import type { Metadata } from 'next'
import { Inter, Kalam, Patrick_Hand } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter',
  display: 'swap',
})
const kalam = Kalam({ 
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-handwritten',
  display: 'swap',
})
const patrickHand = Patrick_Hand({ 
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-retro',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'アリスのお茶会 - AIディベート',
  description: '不思議の国のアリスをモチーフにしたAIディベートアプリ',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text x="50" y="70" font-size="80" text-anchor="middle" dominant-baseline="middle">☕</text></svg>',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={`${inter.variable} ${kalam.variable} ${patrickHand.variable} font-sans`}>
        {children}
      </body>
    </html>
  )
}
