'use client'
import { useState } from 'react'
import { useCart } from '@/lib/cart'
import { Minus, Plus, X, ArrowLeft, ShoppingBag, CheckCircle } from 'lucide-react'

const DELIVERY = 15
const PROMO_CODE = 'ROFOF10'
const PROMO_DISCOUNT = 0.10

export default function CartPage() {
  const { items, remove, increment, decrement, total, clear } = useCart()
  const [promo, setPromo] = useState('')
  const [promoOk, setPromoOk] = useState(false)
  const [ordered, setOrdered] = useState(false)

  const discount = promoOk ? Math.round(total * PROMO_DISCOUNT) : 0
  const finalTotal = total - discount + DELIVERY

  const applyPromo = () => {
    if (promo.toUpperCase() === PROMO_CODE) setPromoOk(true)
  }

  // ── Ambient blobs (shared bg layer) ──
  const Blobs = () => (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-20 -right-16 w-72 h-72 rounded-full blur-3xl opacity-50 bg-[#FCCF87]" />
      <div className="absolute top-40 -left-20 w-80 h-80 rounded-full blur-3xl opacity-40 bg-[#FF9D1B]" />
      <div className="absolute bottom-40 right-1/3 w-72 h-72 rounded-full blur-3xl opacity-30 bg-[#004f7a]" />
    </div>
  )

  // ── ORDERED STATE ──
  if (ordered) {
    return (
      <div
        dir="rtl"
        className="relative flex flex-col items-center justify-center min-h-full px-8 text-center"
        style={{ fontFamily: "'Tajawal', sans-serif" }}
      >
        <Blobs />
        <div className="relative w-20 h-20 rounded-full flex items-center justify-center mb-6 backdrop-blur-xl bg-white/40 border border-white/60 shadow-sm">
          <CheckCircle size={36} color="#FF9D1B" strokeWidth={1.5} />
        </div>
        <h2
          className="text-[#003A5C] text-4xl mb-3 relative"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, letterSpacing: '-0.02em' }}
        >
          تم الطلب
        </h2>
        <p className="text-[#003A5C]/60 text-[12px] leading-relaxed mb-8 relative max-w-xs">
          تم استلام طلبك بنجاح. سيتم التواصل معك قريبًا.
        </p>
        <button
          onClick={() => { clear(); setOrdered(false) }}
          className="relative h-12 px-8 rounded-2xl text-white text-[13px] font-medium"
          style={{ background: '#003A5C', boxShadow: '0 8px 24px rgba(0,58,92,0.25)', letterSpacing: '0.02em' }}
        >
          العودة للتسوق
        </button>
      </div>
    )
  }

  // ── EMPTY STATE ──
  if (items.length === 0) {
    return (
      <div
        dir="rtl"
        className="relative flex flex-col items-center justify-center min-h-full px-8 text-center"
        style={{ fontFamily: "'Tajawal', sans-serif" }}
      >
        <Blobs />
        <div className="relative w-20 h-20 rounded-full flex items-center justify-center mb-6 backdrop-blur-xl bg-white/40 border border-white/60 shadow-sm">
          <ShoppingBag size={28} color="#003A5C" strokeWidth={1.5} />
        </div>
        <h2
          className="text-[#003A5C] text-3xl mb-2 relative"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, letterSpacing: '-0.02em' }}
        >
          السلة فارغة
        </h2>
        <p className="text-[#003A5C]/50 text-[12px] relative">أضف منتجات من المساحات</p>
      </div>
    )
  }

  // ── MAIN CART ──
  return (
    <div
      dir="rtl"
      className="relative min-h-full pb-8"
      style={{ fontFamily: "'Tajawal', sans-serif" }}
    >
      <Blobs />

      {/* ── HEADER ── */}
      <div className="px-5 pt-12 pb-6">
        <p className="text-[9px] tracking-[0.3em] uppercase text-[#FF9D1B] mb-1">
          Your Cart
        </p>
        <h1
          className="text-[#003A5C] text-4xl"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, letterSpacing: '-0.02em' }}
        >
          سلتك
        </h1>
        <p className="text-[#003A5C]/50 text-[12px] mt-1">
          {items.reduce((s, i) => s + i.qty, 0)} منتجات
        </p>
      </div>

      {/* ── ITEMS ── */}
      <div className="px-5 flex flex-col gap-3 mb-4">
        {items.map(({ product: p, qty }) => (
          <div
            key={p.id}
            className="flex gap-3 items-center p-2.5 rounded-2xl backdrop-blur-xl bg-white/40 border border-white/60 shadow-sm"
          >
            {/* image */}
            <div className="rounded-xl overflow-hidden flex-shrink-0" style={{ width: 68, height: 68 }}>
              <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
            </div>

            {/* info */}
            <div className="flex-1 min-w-0">
              {p.sub && (
                <p className="text-[8px] tracking-[0.25em] uppercase text-[#FF9D1B] mb-0.5">
                  {p.sub}
                </p>
              )}
              <p className="text-[#003A5C] text-[13px] font-medium leading-snug truncate mb-2">
                {p.name}
              </p>

              {/* qty control */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => decrement(p.id)}
                  className="w-6 h-6 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(0,58,92,0.08)' }}
                >
                  <Minus size={10} className="text-[#003A5C]" strokeWidth={2.2} />
                </button>
                <span className="text-[#003A5C] text-[13px] font-medium w-4 text-center">
                  {qty}
                </span>
                <button
                  onClick={() => increment(p.id)}
                  className="w-6 h-6 rounded-lg flex items-center justify-center"
                  style={{
                    background: 'rgba(255,157,27,0.18)',
                    border: '1px solid rgba(255,157,27,0.3)',
                  }}
                >
                  <Plus size={10} color="#FF9D1B" strokeWidth={2.2} />
                </button>
              </div>
            </div>

            {/* price + remove */}
            <div className="flex flex-col items-end gap-3 pl-1">
              <button onClick={() => remove(p.id)} className="opacity-30 hover:opacity-60 transition-opacity">
                <X size={14} className="text-[#003A5C]" />
              </button>
              <div className="flex items-baseline gap-1">
                <span
                  className="text-[#003A5C]"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 500 }}
                >
                  {p.price * qty}
                </span>
                <span className="text-[9px] text-[#003A5C]/50">ر.س</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── PROMO ── */}
      <div className="px-5 mb-4">
        <div className="flex gap-2 p-1.5 rounded-2xl backdrop-blur-xl bg-white/40 border border-white/60 shadow-sm">
          <input
            type="text"
            value={promo}
            onChange={e => setPromo(e.target.value)}
            placeholder="كود الخصم"
            className="flex-1 bg-transparent text-[#003A5C] text-[12px] px-3 outline-none placeholder:text-[#003A5C]/35"
            dir="rtl"
          />
          <button
            onClick={applyPromo}
            className="h-10 px-5 rounded-xl text-[12px] font-medium transition-colors"
            style={
              promoOk
                ? { background: 'rgba(255,157,27,0.2)', color: '#D77900' }
                : { background: '#003A5C', color: 'white', letterSpacing: '0.02em' }
            }
          >
            {promoOk ? '✓ مُطبّق' : 'تطبيق'}
          </button>
        </div>
        {promoOk && (
          <p className="text-[#D77900] text-[11px] mt-2 px-1">
            تم تطبيق خصم 10% 🎉
          </p>
        )}
      </div>

      {/* ── ORDER SUMMARY ── */}
      <div className="mx-5 rounded-2xl p-5 mb-4 backdrop-blur-xl bg-white/40 border border-white/60 shadow-sm">
        <p className="text-[9px] tracking-[0.3em] uppercase text-[#FF9D1B] mb-4">
          Order Summary
        </p>

        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-baseline">
            <span className="text-[#003A5C]/60 text-[12px]">المجموع</span>
            <div className="flex items-baseline gap-1">
              <span className="text-[#003A5C] text-[13px] font-medium">{total}</span>
              <span className="text-[#003A5C]/40 text-[10px]">ر.س</span>
            </div>
          </div>

          {promoOk && (
            <div className="flex justify-between items-baseline">
              <span className="text-[#D77900] text-[12px]">خصم الكود</span>
              <div className="flex items-baseline gap-1">
                <span className="text-[#D77900] text-[13px] font-medium">-{discount}</span>
                <span className="text-[#D77900]/60 text-[10px]">ر.س</span>
              </div>
            </div>
          )}

          <div className="flex justify-between items-baseline">
            <span className="text-[#003A5C]/60 text-[12px]">التوصيل</span>
            <div className="flex items-baseline gap-1">
              <span className="text-[#003A5C] text-[13px] font-medium">{DELIVERY}</span>
              <span className="text-[#003A5C]/40 text-[10px]">ر.س</span>
            </div>
          </div>

          <div className="h-px bg-[#003A5C]/10 my-1" />

          <div className="flex justify-between items-baseline">
            <span className="text-[#003A5C] text-[13px] font-medium">الإجمالي</span>
            <div className="flex items-baseline gap-1">
              <span
                className="text-[#003A5C]"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 500 }}
              >
                {finalTotal}
              </span>
              <span className="text-[#003A5C]/50 text-[11px]">ر.س</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── CHECKOUT BTN ── */}
      <div className="px-5">
        <button
          onClick={() => setOrdered(true)}
          className="w-full h-14 rounded-2xl font-medium text-[14px] flex items-center justify-center gap-2.5 transition-all"
          style={{
            background: '#003A5C',
            color: 'white',
            boxShadow: '0 8px 24px rgba(0,58,92,0.25)',
            letterSpacing: '0.02em',
          }}
        >
          تأكيد الطلب · {finalTotal} ر.س
          <ArrowLeft size={16} strokeWidth={1.8} />
        </button>
      </div>
    </div>
  )
}