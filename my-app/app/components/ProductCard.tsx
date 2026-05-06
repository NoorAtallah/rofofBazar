'use client'
import { useState } from 'react'
import { Heart, ShoppingBag, Check, Plus } from 'lucide-react'

export interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  emoji: string
  bg: string
  sub?: string
  available: boolean
}

interface ProductCardProps {
  product: Product
  onAdd: (product: Product) => void
  onClick?: () => void
}

export default function ProductCard({ product, onAdd, onClick }: ProductCardProps) {
  const [added, setAdded] = useState(false)
  const [faved, setFaved] = useState(false)

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!product.available) return
    setAdded(true)
    onAdd(product)
    setTimeout(() => setAdded(false), 1800)
  }

  const toggleFav = (e: React.MouseEvent) => {
    e.stopPropagation()
    setFaved(!faved)
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null

  return (
    <div
      onClick={onClick}
      className={`relative rounded-3xl overflow-hidden backdrop-blur-xl bg-white/40 border border-white/60 shadow-sm p-2.5 active:scale-[0.98] transition-transform duration-150 select-none ${!product.available ? 'opacity-60' : ''}`}
    >
      {/* Image */}
      <div className={`relative w-full aspect-square rounded-2xl overflow-hidden flex items-center justify-center text-5xl ${product.bg}`}>
        <span>{product.emoji}</span>

        {discount && (
          <span className="absolute top-2 right-2 text-[9px] px-2 py-0.5 rounded-full bg-[#FF9D1B] text-white font-medium tracking-wide">
            -{discount}%
          </span>
        )}

        <button
          onClick={toggleFav}
          className="absolute top-2 left-2 w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-xl bg-white/60 border border-white/70 transition-all hover:scale-110"
        >
          <Heart
            size={11}
            fill={faved ? '#FF9D1B' : 'none'}
            color={faved ? '#FF9D1B' : '#003A5C'}
            strokeWidth={1.8}
          />
        </button>

        {!product.available && (
          <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm bg-white/40">
            <span className="text-[10px] px-3 py-1 rounded-full bg-white/80 text-[#003A5C]">
              غير متوفر
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="px-1 pt-3 pb-1">
        {product.sub && (
          <p className="text-[8px] tracking-[0.25em] uppercase text-[#FF9D1B] mb-1">
            {product.sub}
          </p>
        )}
        <p className="text-[12px] leading-snug text-[#003A5C] font-medium mb-2 line-clamp-1">
          {product.name}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span
              className="text-[#003A5C]"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, fontWeight: 500 }}
            >
              {product.price}
            </span>
            <span className="text-[9px] text-[#003A5C]/50">ر.س</span>
            {product.originalPrice && (
              <span className="text-[9px] line-through text-[#003A5C]/30">
                {product.originalPrice}
              </span>
            )}
          </div>

          <button
            onClick={handleAdd}
            disabled={!product.available}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
            style={
              added
                ? { background: '#FF9D1B', color: 'white' }
                : product.available
                  ? { background: '#003A5C', color: 'white' }
                  : { background: 'rgba(0,58,92,0.1)', color: 'rgba(0,58,92,0.3)', cursor: 'not-allowed' }
            }
          >
            {added ? <Check size={12} strokeWidth={2.5} /> : <ShoppingBag size={11} strokeWidth={1.8} />}
          </button>
        </div>
      </div>
    </div>
  )
}