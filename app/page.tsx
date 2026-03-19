'use client'

import GameGrid from './games/GameGrid'
import Slider from './components/slider/Slider'
import Bestsellers from './components/bestsellers/Bestsellers'
import Features from './components/features/Features'
import Loader from './components/ui/Loader'

import { useEffect, useState } from 'react'

export default function Home() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  if (loading) return <Loader />

  return (
    <main>
      <Slider />
      <GameGrid/>
      <Bestsellers/>
      <Features/>
    </main>
  )
}