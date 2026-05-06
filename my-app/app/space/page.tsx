'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/cart'
import { BRAND, PRODUCTS } from '@/lib/data'
import { Heart, ShoppingBag, Search, Check, Star, Grid3x3, ShoppingCart } from 'lucide-react'

export default function SpacePage() {
  const router = useRouter()
  const { add } = useCart()
  const [favs, setFavs] = useState<number[]>([])
  const [added, setAdded] = useState<number | null>(null)
  const [query, setQuery] = useState('')

  const handleAdd = (p: typeof PRODUCTS[0]) => {
    if (!p.available) return
    add(p)
    setAdded(p.id)
    setTimeout(() => setAdded(null), 1600)
  }

  const toggleFav = (id: number) =>
    setFavs(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id])

  const filtered = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.sub.toLowerCase().includes(query.toLowerCase())
  )

  const featured = filtered[0]
  const rest = filtered.slice(1)

  return (
    <div
      dir="rtl"
      className="relative min-h-full"
      style={{ fontFamily: "'Tajawal', sans-serif" }}
    >
      {/* ── ambient blurred light blobs (the soft glow behind glass) ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-16 w-72 h-72 rounded-full blur-3xl opacity-50 bg-[#FCCF87]" />
        <div className="absolute top-40 -left-20 w-80 h-80 rounded-full blur-3xl opacity-40 bg-[#FF9D1B]" />
        <div className="absolute bottom-40 right-1/3 w-72 h-72 rounded-full blur-3xl opacity-30 bg-[#004f7a]" />
      </div>

      {/* ── GLASS HEADER BAR ── */}
      <div className="sticky top-0 z-30 px-5 pt-5 pb-3">
        <div className="flex items-center justify-between mb-4">
          <button className="w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-xl bg-white/40 border border-white/60 shadow-sm">
            <Grid3x3 size={16} className="text-[#003A5C]" strokeWidth={1.8} />
          </button>

          <div className="text-center">
            <p className="text-[9px] tracking-[0.3em] uppercase text-[#003A5C]/50">
              {BRAND.space}
            </p>
            <p
              className="text-[15px] text-[#003A5C] -mt-0.5"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}
            >
              {BRAND.name}
            </p>
          </div>

          <button className="relative w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-xl bg-white/40 border border-white/60 shadow-sm">
            <ShoppingCart size={15} className="text-[#003A5C]" strokeWidth={1.8} />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FF9D1B] text-white text-[9px] flex items-center justify-center font-medium">
              2
            </span>
          </button>
        </div>

        {/* search — glass pill */}
        <div className="flex items-center gap-2 px-4 h-11 rounded-2xl backdrop-blur-xl bg-white/40 border border-white/60 shadow-sm">
          <Search size={14} className="text-[#003A5C]/60" strokeWidth={1.8} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="ابحث عن منتج..."
            className="flex-1 bg-transparent outline-none text-[12px] text-[#003A5C] placeholder:text-[#003A5C]/40"
          />
        </div>
      </div>

      {/* ── HERO / NEW ARRIVAL ── */}
      {featured && (
        <div className="px-5 mt-2">
          <button
            onClick={() => router.push(`/product?id=${featured.id}`)}
            className="relative w-full overflow-hidden rounded-3xl block"
            style={{ aspectRatio: '0.78' }}
          >
            <img src={featured.image} alt={featured.name} className="w-full h-full object-cover" />

            {/* dark gradient bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#003A5C]/70 via-[#003A5C]/10 to-transparent" />

            {/* top floating glass tag */}
            <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full backdrop-blur-xl bg-white/40 border border-white/60">
              <p className="text-[9px] tracking-[0.25em] uppercase text-[#003A5C] font-medium">
                New Arrival
              </p>
            </div>

            {/* bottom content */}
            <div className="absolute bottom-0 right-0 left-0 p-6 text-right">
              <h2
                className="text-white text-4xl mb-2"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, letterSpacing: '-0.02em' }}
              >
                {featured.name}
              </h2>
              <p className="text-white/80 text-[11px] leading-relaxed mb-4 max-w-[80%] mr-auto">
                مجموعة جديدة من منتجات {BRAND.name} المختارة بعناية لذوقك المميز
              </p>

              {/* dots */}
              <div className="flex justify-end gap-1.5">
                <div className="w-5 h-1 rounded-full bg-[#FF9D1B]" />
                <div className="w-1 h-1 rounded-full bg-white/50" />
                <div className="w-1 h-1 rounded-full bg-white/50" />
                <div className="w-1 h-1 rounded-full bg-white/50" />
              </div>
            </div>
          </button>
        </div>
      )}

      {/* ── RECOMMENDED LABEL ── */}
      <div className="px-5 mt-7 mb-4 flex items-end justify-between">
        <div>
          <p className="text-[9px] tracking-[0.3em] uppercase text-[#FF9D1B] mb-0.5">
            Recommended
          </p>
          <h3
            className="text-2xl text-[#003A5C]"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, letterSpacing: '-0.02em' }}
          >
            المنتجات المختارة
          </h3>
        </div>
        <div className="flex items-center gap-1.5">
          <Star size={11} fill="#FF9D1B" color="#FF9D1B" strokeWidth={0} />
          <span
            className="text-[13px] text-[#003A5C]"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}
          >
            {BRAND.rating}
          </span>
          <span className="text-[10px] text-[#003A5C]/40">({BRAND.reviews})</span>
        </div>
      </div>

      {/* ── GLASS PRODUCT GRID ── */}
      <div className="grid grid-cols-2 gap-3 px-5">
        {rest.map(p => {
          const disc = p.was ? Math.round(((p.was - p.price) / p.was) * 100) : null
          const isAdded = added === p.id
          const isFaved = favs.includes(p.id)

          return (
            <div
              key={p.id}
              className={`relative rounded-3xl overflow-hidden backdrop-blur-xl bg-white/40 border border-white/60 shadow-sm p-2.5 ${!p.available ? 'opacity-60' : ''}`}
            >
              {/* image */}
              <button
                onClick={() => router.push(`/product?id=${p.id}`)}
                className="relative w-full overflow-hidden rounded-2xl block bg-white/30"
                style={{ aspectRatio: '1' }}
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />

                {disc && (
                  <span className="absolute top-2 right-2 text-[9px] px-2 py-0.5 rounded-full bg-[#FF9D1B] text-white font-medium tracking-wide">
                    -{disc}%
                  </span>
                )}

                <button
                  onClick={e => { e.stopPropagation(); toggleFav(p.id) }}
                  className="absolute top-2 left-2 w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-xl bg-white/60 border border-white/70 transition-all hover:scale-110"
                >
                  <Heart
                    size={11}
                    fill={isFaved ? '#FF9D1B' : 'none'}
                    color={isFaved ? '#FF9D1B' : '#003A5C'}
                    strokeWidth={1.8}
                  />
                </button>

                {!p.available && (
                  <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm bg-white/40">
                    <span className="text-[10px] px-3 py-1 rounded-full bg-white/80 text-[#003A5C]">
                      غير متوفر
                    </span>
                  </div>
                )}
              </button>

              {/* text */}
              <div className="px-1 pt-3 pb-1">
                <p className="text-[8px] tracking-[0.25em] uppercase text-[#FF9D1B] mb-1">
                  {p.sub}
                </p>
                <p className="text-[12px] leading-snug text-[#003A5C] font-medium mb-2 line-clamp-1">
                  {p.name}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-1">
                    <span
                      className="text-[#003A5C]"
                      style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, fontWeight: 500 }}
                    >
                      {p.price}
                    </span>
                    <span className="text-[9px] text-[#003A5C]/50">ر.س</span>
                    {p.was && (
                      <span className="text-[9px] line-through text-[#003A5C]/30">
                        {p.was}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleAdd(p)}
                    disabled={!p.available}
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
                    style={
                      isAdded
                        ? { background: '#FF9D1B', color: 'white' }
                        : p.available
                          ? { background: '#003A5C', color: 'white' }
                          : { background: 'rgba(0,58,92,0.1)', color: 'rgba(0,58,92,0.3)', cursor: 'not-allowed' }
                    }
                  >
                    {isAdded ? <Check size={12} strokeWidth={2.5} /> : <ShoppingBag size={11} strokeWidth={1.8} />}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="h-10" />
    </div>
  )
}