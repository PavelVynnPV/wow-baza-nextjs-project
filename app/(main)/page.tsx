import Slider from '../components/slider/Slider'
import Bestsellers from '../components/bestsellers/Bestsellers'
import { supabase } from '@/lib/supabase'
import GameGrid from './games/GameGrid'

export default async function Home() {
  const { data: slides } = await supabase
    .from("slides")
    .select("*")
    .eq("is_active", true)
    .order("order")

  const { data: games } = await supabase
    .from("games")
    .select("*")
    .eq("is_active", true)
    .order("order")

  return (
    <main>
      <Slider slides={slides ?? []} />
      <GameGrid />
      <Bestsellers />
    </main>
  )
}