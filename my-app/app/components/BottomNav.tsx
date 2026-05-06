'use client'
import { useCart } from '@/lib/cart'
import { usePathname, useRouter } from 'next/navigation'
import { Compass, QrCode, ShoppingBag } from 'lucide-react'

const TABS = [
  { href: '/space',   icon: QrCode,      label: 'المساحة' },
  { href: '/product', icon: Compass,     label: 'استكشف'  },
  { href: '/cart',    icon: ShoppingBag, label: 'السلة'   },
]

export default function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { count } = useCart()

  return (
    <div
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 px-4"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 12px)' }}
    >
      <nav
        className="flex items-center justify-around rounded-2xl px-2 py-2 mb-3 backdrop-blur-xl bg-white/50 border border-white/60"
        style={{ boxShadow: '0 8px 32px rgba(0,58,92,0.15)' }}
      >
        {TABS.map(tab => {
          const active = pathname.startsWith(tab.href)
          const Icon = tab.icon
          const isCart = tab.href === '/cart'

          return (
            <button
              key={tab.href}
              onClick={() => router.push(tab.href)}
              className="flex flex-col items-center gap-1 flex-1 py-1.5 rounded-xl transition-all duration-200 relative"
              style={{
                background: active ? 'rgba(255,157,27,0.18)' : 'transparent',
              }}
            >
              <div className="relative">
                <Icon
                  size={20}
                  color={active ? '#D77900' : '#003A5C'}
                  strokeWidth={active ? 2 : 1.6}
                  style={{ opacity: active ? 1 : 0.55 }}
                />
                {isCart && count > 0 && (
                  <span
                    className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 rounded-full text-white text-[9px] font-bold flex items-center justify-center"
                    style={{
                      background: '#FF9D1B',
                      boxShadow: '0 2px 6px rgba(255,157,27,0.4)',
                    }}
                  >
                    {count}
                  </span>
                )}
              </div>
              <span
                className="text-[10px] font-medium"
                style={{
                  color: active ? '#D77900' : '#003A5C',
                  opacity: active ? 1 : 0.5,
                  fontFamily: "'Tajawal', sans-serif",
                }}
              >
                {tab.label}
              </span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}