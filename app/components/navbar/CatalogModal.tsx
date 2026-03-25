"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import { CircleChevronRight, Search } from "lucide-react";
import { Game, Category } from "@/types";

const CatalogModal = ({
  games,
  categories,
  activeGame: initialGame,
  onClose,
}: {
  games: Game[];
  categories: Category[];
  activeGame: string;
  onClose: () => void;
}) => {
  const [activeGame, setActiveGame] = useState<string>(initialGame);
  const [search, setSearch] = useState("");

  const filteredCategories = categories.filter(
    (cat) => cat.game_slug === activeGame,
  );

  const filteredGames = games.filter((game) =>
    game.title.toLowerCase().includes(search.toLowerCase()),
  );

  const activeGameData = games.find((g) => g.slug === activeGame);

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-60" onClick={onClose} />

      <div className="fixed top-[70px] left-0 right-0 z-70 bg-[#1a1a1a] flex max-w-[1800px] mx-auto rounded-b-xl overflow-hidden shadow-2xl rounded-2xl border border-white/20">
        <div className="w-[360px] bg-[#635050]/60 h-[80vh] px-[30px] py-[40px] flex flex-col">
          <div className="relative flex items-center w-full mb-[35px]">
            <Search className="absolute left-3 w-5 h-5 text-[#808080] font-bold" />
            <input
              type="text"
              value={search}
              className="flex w-full py-1 px-10 outline-none bg-[#D9D9D9]/6 rounded-[5px] border-white/50 border-[0.5px] text-white placeholder:text-[#808080] placeholder:font-bold"
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
            />
          </div>

          <div className="overflow-y-auto flex-1">
            {filteredGames.map((game) => (
              <div
                key={game.id}
                className="flex justify-between items-center px-[5px] border-b border-transparent hover:border-white mb-[5px]"
              >
                <button
                  key={game.id}
                  onClick={() => setActiveGame(game.slug)}
                  className={`w-full flex gap-3 py-3 text-sm text-left cursor-pointer font-bold transition-all ${
                    activeGame === game.slug ? "text-[#FF9500]" : "text-white"
                  }`}
                >
                  <Image
                    src={game.image_url}
                    alt={game.title}
                    width={24}
                    height={24}
                    className="rounded-full w-6 h-6 object-cover"
                  />
                  {game.title}
                </button>
                <CircleChevronRight
                  className={`stroke-3 ${
                    activeGame === game.slug
                      ? "text-[#FF9500]"
                      : "text-white/60"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 p-6">
          <div className="mb-4">
            <h2 className="text-white font-bold text-lg">
              {activeGameData?.title}
            </h2>
            {activeGameData?.patch && (
              <Link href={`/games/${activeGameData.slug}`} onClick={onClose}>
                <p className="text-[#FF9500] text-sm mt-1 hover:underline cursor-pointer">
                  ⚔️ {activeGameData.patch}
                </p>
              </Link>
            )}
          </div>

          <hr className="border-white/10 mb-4" />

          <div className="grid grid-cols-2 gap-2">
          {filteredCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/games/${activeGame}?category=${cat.slug}`}
                onClick={onClose}
                className="text-white/70 hover:text-[#FF9500] text-sm transition-all"
              >
                {cat.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default CatalogModal;
