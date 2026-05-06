'use client'
import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCart } from '@/lib/cart'
import { PRODUCTS } from '@/lib/data'
import { ChevronRight, Heart, Share2, ShoppingBag, Check, Star, Minus, Plus } from 'lucide-react'

function ProductContent() {
  const router = useRouter()
  const params = useSearchParams()
  const { add, items } = useCart()

  const id = Number(params.get('id')) || PRODUCTS[0].id
  const p = PRODUCTS.find(pr => pr.id === id) ?? PRODUCTS[0]

  const [faved, setFaved] = useState(false)
  const [added, setAdded] = useState(false)
  const [qty, setQty] = useState(1)
  const [imgIdx, setImgIdx] = useState(0)

  const inCart = items.find(i => i.product.id === p.id)
  const disc = p.was ? Math.round(((p.was - p.price) / p.was) * 100) : null

  const handleAdd = () => {
    if (!p.available) return
    for (let i = 0; i < qty; i++) add(p)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <div
      dir="rtl"
      className="relative min-h-full pb-8"
      style={{ fontFamily: "'Tajawal', sans-serif" }}
    >
      {/* ── ambient blurred light blobs (matching space page) ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-16 w-72 h-72 rounded-full blur-3xl opacity-50 bg-[#FCCF87]" />
        <div className="absolute top-60 -left-20 w-80 h-80 rounded-full blur-3xl opacity-40 bg-[#FF9D1B]" />
        <div className="absolute bottom-40 right-1/3 w-72 h-72 rounded-full blur-3xl opacity-30 bg-[#004f7a]" />
      </div>

      {/* ── HERO IMAGE (rounded card, not edge-to-edge) ── */}
      <div className="px-5 pt-5">
        <div className="relative w-full overflow-hidden rounded-3xl" style={{ aspectRatio: '0.9' }}>
          <img src={p.images[imgIdx]} alt={p.name} className="w-full h-full object-cover" />

          {/* soft gradient at top for icon contrast */}
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/20 to-transparent" />

          {/* top bar */}
          <div className="absolute top-0 right-0 left-0 flex justify-between items-center px-4 pt-4">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-xl bg-white/40 border border-white/60 shadow-sm"
            >
              <ChevronRight size={18} className="text-[#003A5C]" strokeWidth={1.8} />
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => setFaved(!faved)}
                className="w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-xl bg-white/40 border border-white/60 shadow-sm"
              >
                <Heart
                  size={15}
                  fill={faved ? '#FF9D1B' : 'none'}
                  color={faved ? '#FF9D1B' : '#003A5C'}
                  strokeWidth={1.8}
                />
              </button>
              <button className="w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-xl bg-white/40 border border-white/60 shadow-sm">
                <Share2 size={14} className="text-[#003A5C]" strokeWidth={1.8} />
              </button>
            </div>
          </div>

          {/* discount badge */}
          {disc && (
            <span className="absolute top-16 right-4 text-[10px] px-2.5 py-1 rounded-full bg-[#FF9D1B] text-white font-medium tracking-wide">
              -{disc}%
            </span>
          )}

          {/* image dots */}
          {p.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-xl bg-white/40 border border-white/60">
              {p.images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setImgIdx(i)}
                  className="rounded-full transition-all duration-200"
                  style={{
                    width: i === imgIdx ? 18 : 5,
                    height: 5,
                    background: i === imgIdx ? '#FF9D1B' : 'rgba(0,58,92,0.25)',
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── thumbnail strip ── */}
      {p.images.length > 1 && (
        <div className="flex gap-2 px-5 pt-4">
          {p.images.map((img, i) => (
            <button
              key={i}
              onClick={() => setImgIdx(i)}
              className="w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 transition-all duration-200"
              style={{
                border: i === imgIdx ? '2px solid #FF9D1B' : '2px solid rgba(255,255,255,0.6)',
                boxShadow: i === imgIdx ? '0 0 0 2px rgba(255,157,27,0.15)' : 'none',
              }}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* ── INFO CARD (light glass) ── */}
      <div className="px-5 pt-5">
        <div className="rounded-3xl backdrop-blur-xl bg-white/40 border border-white/60 shadow-sm p-5">
          {/* sub */}
          {p.sub && (
            <p className="text-[9px] tracking-[0.3em] uppercase text-[#FF9D1B] mb-2">
              {p.sub}
            </p>
          )}

          {/* name */}
          <h1
            className="text-[#003A5C] text-3xl mb-3"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 400,
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
            }}
          >
            {p.name}
          </h1>

          {/* rating */}
          <div className="flex items-center gap-2 mb-5">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map(s => (
                <Star
                  key={s}
                  size={12}
                  fill={s <= 4 ? '#FF9D1B' : 'none'}
                  color="#FF9D1B"
                  strokeWidth={1.5}
                />
              ))}
            </div>
            <span
              className="text-[#003A5C] text-[13px]"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}
            >
              4.8
            </span>
            <span className="text-[10px] text-[#003A5C]/40">· 127 تقييم</span>
          </div>

          {/* description */}
          <p className="text-[#003A5C]/70 text-[12px] leading-relaxed mb-5">
            {p.description}
          </p>

          {/* divider */}
          <div className="h-px bg-[#003A5C]/10 mb-5" />

          {/* price + qty */}
          <div className="flex items-center justify-between mb-1">
            <div>
              <p className="text-[9px] tracking-[0.25em] uppercase text-[#003A5C]/50 mb-1">
                السعر
              </p>
              <div className="flex items-baseline gap-1.5">
                <span
                  className="text-[#003A5C]"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 32,
                    fontWeight: 500,
                  }}
                >
                  {p.price}
                </span>
                <span className="text-[#003A5C]/50 text-[11px]">ر.س</span>
                {p.was && (
                  <span className="text-[#003A5C]/30 text-[11px] line-through">
                    {p.was}
                  </span>
                )}
              </div>
            </div>

            {/* qty control */}
            <div className="flex items-center gap-2 rounded-2xl px-1.5 py-1.5 backdrop-blur-xl bg-white/50 border border-white/70">
              <button
                onClick={() => setQty(q => Math.max(1, q - 1))}
                disabled={qty === 1}
                className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
                style={{
                  background: qty === 1 ? 'transparent' : 'rgba(0,58,92,0.08)',
                  opacity: qty === 1 ? 0.4 : 1,
                }}
              >
                <Minus size={13} className="text-[#003A5C]" strokeWidth={2} />
              </button>
              <span className="text-[#003A5C] font-medium text-[14px] w-5 text-center">
                {qty}
              </span>
              <button
                onClick={() => setQty(q => q + 1)}
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{
                  background: 'rgba(255,157,27,0.18)',
                  border: '1px solid rgba(255,157,27,0.3)',
                }}
              >
                <Plus size={13} color="#FF9D1B" strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── ADD TO CART BUTTON ── */}
      <div className="px-5 pt-4">
        <button
          onClick={handleAdd}
          disabled={!p.available}
          className="w-full h-14 rounded-2xl text-[14px] font-medium flex items-center justify-center gap-2.5 transition-all duration-300"
          style={
            !p.available
              ? {
                  background: 'rgba(0,58,92,0.08)',
                  color: 'rgba(0,58,92,0.3)',
                  cursor: 'not-allowed',
                }
              : added
                ? {
                    background: 'rgba(255,157,27,0.15)',
                    border: '1px solid rgba(255,157,27,0.4)',
                    color: '#D77900',
                  }
                : {
                    background: '#003A5C',
                    color: 'white',
                    boxShadow: '0 8px 24px rgba(0,58,92,0.25)',
                    letterSpacing: '0.02em',
                  }
          }
        >
          {!p.available ? (
            'غير متوفر'
          ) : added ? (
            <>
              <Check size={17} strokeWidth={2.5} />
              تمت الإضافة للسلة
            </>
          ) : (
            <>
              <ShoppingBag size={16} strokeWidth={1.8} />
              أضف للسلة · {p.price * qty} ر.س
            </>
          )}
        </button>

        {inCart && (
          <p className="text-center text-[#003A5C]/50 text-[10px] mt-3">
            لديك {inCart.qty} في السلة
          </p>
        )}
      </div>
    </div>
  )
}

export default function ProductPage() {
  return (
    <Suspense>
      <ProductContent />
    </Suspense>
  )
}