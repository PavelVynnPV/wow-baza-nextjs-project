"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { Game, Product } from "@/types";

export default function Bestsellers() {
  const [products, setProducts] = useState<Product[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [activeGame, setActiveGame] = useState("");

  useEffect(() => {
    async function fetchGames() {
      const { data } = await supabase
        .from("games")
        .select("*")
        .eq("is_active", true)
        .order("order");
      if (data && data.length > 0) {
        setGames(data);
        setActiveGame("w_burning_crusade");
      }
    }
    fetchGames();
  }, []);

  useEffect(() => {
    if (!activeGame) return;
    async function fetchBestsellers() {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("is_bestseller", true)
        .eq("is_active", true)
        .eq("game_slug", activeGame);
      if (data) setProducts(data as Product[]);
    }
    fetchBestsellers();
  }, [activeGame]);

  return (
    <div className="relative mt-[64px] mb-[90px]">
      <div className="absolute z-[-1] flex justify-center items-center inset-0">
        <Image
          src="/background-bestseller.jpg"
          alt="bestseller-bg"
          fill
          className="object-cover opacity-20"
        />
      </div>
      <div className="max-w-[1700px] mx-auto px-4 py-10 ">
        <h2 className="text-white text-center text-[50px] font-bold mb-[70px] font-rocker tracking-widest uppercase">
          WOW BESTSELLERS
        </h2>

        <div className="flex justify-center gap-3 mb-8 flex-wrap">
          {games.map((game) => (
            <button
              key={game.slug}
              onClick={() => setActiveGame(game.slug)}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                activeGame === game.slug
                  ? "bg-red-600 text-white"
                  : "bg-[#0B0E14]/70 text-white/70 hover:bg-white/10 hover:text-white cursor-pointer border-[0.5] border-white/50"
              }`}
            >
              {game.title}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-[30px] mt-[70px]">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-[#0B0E14] rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform border-white/50 border-[0.5]"
            >
              <img
                src={product.image_url}
                alt={product.title}
                className="w-full h-[180px] object-cover"
              />
              <div className="p-4">
                <h3 className="text-[#FF9500] font-bold text-[16px] mb-2">
                  {product.title} - <span className="capitalize">{product.category}</span>
                </h3>
                <ul className="mb-3">
                  {product.features?.split(",").map((f, i) => (
                    <li key={i} className="text-white text-[12px] flex items-center gap-1.5">
                      <span className="text-[#FF9500] text-[16px]">•</span> {f.trim()}
                    </li>
                  ))}
                </ul>
                <p className="text-white text-xs">from</p>
                <p className="text-white text-xl font-bold">
                  $ {product.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
