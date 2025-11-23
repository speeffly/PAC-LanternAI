import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Lantern AI - Career Exploration for Rural Students',
  description: 'AI-powered career guidance for rural healthcare and infrastructure careers',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
