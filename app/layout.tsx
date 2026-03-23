import type { Metadata, Viewport } from 'next'
import { Outfit, DM_Sans } from 'next/font/google'
import './globals.css'
import { SwRegister } from '@/components/sw-register'
import { BottomNav } from '@/components/bottom-nav'
import { TopBar } from '@/components/top-bar'

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
  weight: ['400', '600', '700', '800', '900'],
})

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0A0A0A',
}

export const metadata: Metadata = {
  title: 'GainTrack GT',
  description: 'Tu tracker personal de fitness y nutrición',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'GainTrack GT',
  },
  icons: {
    apple: '/icons/icon-180x180.png',
    icon: '/icons/icon-192x192.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      className={`${outfit.variable} ${dmSans.variable} dark`}
    >
      <body className="antialiased overscroll-none" style={{ backgroundColor: 'var(--gt-black)', color: 'var(--gt-text)' }}>
        <SwRegister />
        <TopBar />
        <div className="flex flex-col min-h-[100dvh]">
          <main
            className="flex-1 overflow-y-auto scrollbar-none safe-bottom"
            style={{ paddingTop: 'calc(env(safe-area-inset-top) + 2.75rem)' }}
          >
            {children}
          </main>
          <BottomNav />
        </div>
      </body>
    </html>
  )
}
