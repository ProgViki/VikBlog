import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'techwrite · senior software architect',
  description: 'Deep dives into distributed systems, cloud-native patterns, and secure by design. Production-grade write-ups for the pragmatic engineer.',
  keywords: 'software architecture, distributed systems, devops, cloud-native, security, system design',
  authors: [{ name: 'techwrite architect' }],
  openGraph: {
    title: 'techwrite · senior software architect',
    description: 'Deep dives into distributed systems, cloud-native patterns, and secure by design.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  )
}