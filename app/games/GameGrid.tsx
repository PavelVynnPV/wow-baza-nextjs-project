'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface Game {
  id: number
  title: string
  slug: string
  image_url: string
  is_active: boolean
  order: number
}

export default function GameGrid() {
  const [games, setGames] = useState<Game[]>([])
  const router = useRouter()

  useEffect(() => {
    async function fetchGames() {
      const { data } = await supabase
        .from('games')
        .select('*')
        .eq('is_active', true)
        .order('order', { ascending: true })

      if (data) setGames(data as Game[])
    }
    fetchGames()
  }, [])

  return (
    <div className="max-w-[1700px] mx-auto px-4 py-10">
      <h2 className="text-white text-center text-4xl font-bold mb-[50px]">
        Your Game Our Boost
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {games.map(game => (
          <div
            key={game.id}
            onClick={() => router.push(`/games/${game.slug}`)}
            className="relative rounded-xl overflow-hidden cursor-pointer group"
          >
            <img
              src={game.image_url}
              alt={game.title}
              className="w-full h-[344px] object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent"/>
            <p className="absolute bottom-3 left-3 text-white font-bold text-[20px] md:text-[30px] items-center">
              {game.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}