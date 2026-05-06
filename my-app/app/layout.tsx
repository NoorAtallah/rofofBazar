import './globals.css'
import type { Metadata } from 'next'
import { CartProvider } from '@/lib/cart'
import BottomNav from '@/app/components/BottomNav'

export const metadata: Metadata = {
  title: 'رفوف بازار',
  description: 'تسوق من مساحات رفوف',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Tajawal:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <CartProvider>
          <div
            className="relative mx-auto overflow-hidden"
            style={{
              maxWidth: 430,
              height: '100dvh',
              background: '#E8E6E1',
            }}
          >
            <main className="relative h-full overflow-y-auto pb-28 z-10" style={{ scrollbarWidth: 'none' }}>
              {children}
            </main>

            <BottomNav />
          </div>
        </CartProvider>
      </body>
    </html>
  )
}