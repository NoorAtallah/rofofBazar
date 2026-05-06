'use client'
import { createContext, useContext, useState, ReactNode } from 'react'
import { Product } from './data'

type CartItem = { product: Product; qty: number }
type CartCtx = {
  items: CartItem[]
  add: (p: Product) => void
  remove: (id: number) => void
  increment: (id: number) => void
  decrement: (id: number) => void
  count: number
  total: number
  clear: () => void
}

const Ctx = createContext<CartCtx | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const add = (p: Product) => setItems(prev => {
    const ex = prev.find(i => i.product.id === p.id)
    if (ex) return prev.map(i => i.product.id === p.id ? { ...i, qty: i.qty + 1 } : i)
    return [...prev, { product: p, qty: 1 }]
  })

  const remove    = (id: number) => setItems(prev => prev.filter(i => i.product.id !== id))
  const increment = (id: number) => setItems(prev => prev.map(i => i.product.id === id ? { ...i, qty: i.qty + 1 } : i))
  const decrement = (id: number) => setItems(prev => {
    const item = prev.find(i => i.product.id === id)
    if (!item) return prev
    if (item.qty === 1) return prev.filter(i => i.product.id !== id)
    return prev.map(i => i.product.id === id ? { ...i, qty: i.qty - 1 } : i)
  })
  const clear = () => setItems([])

  const count = items.reduce((s, i) => s + i.qty, 0)
  const total = items.reduce((s, i) => s + i.product.price * i.qty, 0)

  return <Ctx.Provider value={{ items, add, remove, increment, decrement, count, total, clear }}>{children}</Ctx.Provider>
}

export const useCart = () => {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useCart must be inside CartProvider')
  return ctx
}
