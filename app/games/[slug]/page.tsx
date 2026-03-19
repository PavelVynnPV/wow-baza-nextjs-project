'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams } from 'next/navigation'

interface Product {
  id: number
  title: string
  description: string
  features: string
  image_url: string
  price: number
  currency: string
  category: string
  faction: string
}

export default function GamePage() {
  const { slug } = useParams()
  const [products, setProducts] = useState<Product[]>([])
  const [faction, setFaction] = useState<'horde' | 'alliance'>('horde')

  useEffect(() => {
    async function fetchProducts() {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('game_slug', slug)
        .eq('faction', faction)
        .eq('is_active', true)

      if (data) setProducts(data as Product[])
    }
    fetchProducts()
  }, [slug, faction])

  return (
    <div className="max-w-[1700px] mx-auto px-4 py-10">
      
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setFaction('horde')}
          className={`cursor-pointer px-6 py-2 rounded-lg font-semibold transition-all ${faction === 'horde' ? 'bg-red-600 text-white' : 'bg-white/10 text-white/50'}`}
        >
          🔴 Horde
        </button>
        <button
          onClick={() => setFaction('alliance')}
          className={`cursor-pointer px-6 py-2 rounded-lg font-semibold transition-all ${faction === 'alliance' ? 'bg-blue-600 text-white' : 'bg-white/10 text-white/50'}`}
        >
          🔵 Alliance
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <div key={product.id} className="bg-white/5 rounded-xl overflow-hidden">
            <img src={product.image_url} alt={product.title} className="w-full h-[200px] object-cover" />
            <div className="p-4">
              <h3 className="text-[#FF9500] font-bold text-lg mb-2">{product.title}</h3>
              <ul className="mb-3">
                {product.features?.split(',').map((f, i) => (
                  <li key={i} className="text-white/80 text-sm">• {f.trim()}</li>
                ))}
              </ul>
              <p className="text-white/50 text-sm">from</p>
              <p className="text-white text-2xl font-bold">$ {product.price}</p>
              <button className="mt-3 w-full bg-[#FF9500] rounded-lg py-2 text-white font-semibold">
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}