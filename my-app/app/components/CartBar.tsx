'use client'

interface CartBarProps {
  count: number
  total: number
  onCheckout: () => void
}

export default function CartBar({ count, total, onCheckout }: CartBarProps) {
  if (count === 0) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-ink px-5 py-4 flex items-center justify-between z-50"
      style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}>
      <div className="flex flex-col gap-0.5">
        <span className="text-gold2 text-[11px] font-light">{count} {count === 1 ? 'منتج' : 'منتجات'} في السلة</span>
        <span className="text-white font-display text-lg font-medium">{total} ر.س</span>
      </div>

      <button
        onClick={onCheckout}
        className="bg-gold text-ink rounded-xl px-5 py-2.5 text-sm font-medium flex items-center gap-1.5 active:scale-95 transition-transform"
      >
        الدفع
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}