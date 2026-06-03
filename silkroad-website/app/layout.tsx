import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Silkroad Innovation Hub — Bridge between Silicon Valley and Central Eurasia',
  description:
    'Silkroad Innovation Hub connects Central Eurasian startups to Silicon Valley. Platinum Partner at TechCrunch Disrupt 2023, 2024, 2025. Located in Menlo Park, CA.',
  keywords: [
    'Silkroad Innovation Hub',
    'Central Eurasia startups',
    'Silicon Valley',
    'TechCrunch Disrupt',
    'startup accelerator',
    'Kazakhstan',
    'Uzbekistan',
    'Azerbaijan',
  ],
  openGraph: {
    title: 'Silkroad Innovation Hub',
    description:
      'Bridge between Silicon Valley and Central Eurasia. TC Disrupt Platinum Partner 3 years running.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
