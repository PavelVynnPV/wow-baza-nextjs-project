"use client";

import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import NavButtons from "./NavButtons";
import { Search } from "lucide-react";
import BurgerMenu from "./BurgerMenu";
import Link from "next/link";
import CatalogModal from "./CatalogModal";
import { supabase } from "@/lib/supabase";
import { Game, Category, Product } from "@/types";
import { createPortal } from "react-dom";


const Navbar = () => {
  const [search, setSearch] = useState("");
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [games, setGames] = useState<Game[]>([]);
  const [activeGame, setActiveGame] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchResults, setSearchResults] = useState<{ games: Game[]; products: Product[] }>({ games: [], products: [] });
  const [searchOpen, setSearchOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState({ top: 0, left: 0, width: 0 });
  const searchRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [{ data: gamesData }, { data: categoriesData }] = await Promise.all([
        supabase.from("games").select("*").eq("is_active", true).order("order"),
        supabase.from("categories").select("*").eq("is_active", true).order("order"),
      ]);
      if (gamesData) { setGames(gamesData); setActiveGame(gamesData[2].slug); }
      if (categoriesData) setCategories(categoriesData);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setSearchResults({ games: [], products: [] });
      setSearchOpen(false);
      return;
    }
    const timer = setTimeout(async () => {
      const [{ data: gamesData }, { data: productsData }] = await Promise.all([
        supabase.from("games").select("id, title, slug, image_url").ilike("title", `%${search}%`).eq("is_active", true).limit(3),
        supabase.from("products").select("id, title, game_slug, image_url, category").ilike("title", `%${search}%`).eq("is_active", true).limit(5),
      ]);
      setSearchResults({ games: (gamesData ?? []) as Game[], products: (productsData ?? []) as Product[] });
      setSearchOpen(true);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchRef.current && !searchRef.current.contains(e.target as Node) &&
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node)
      ) setSearchOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const updatePosition = () => {
      if (searchRef.current) {
        const rect = searchRef.current.getBoundingClientRect();
        setDropdownStyle({ top: rect.bottom, left: rect.left, width: rect.width });
      }
    };
    if (searchOpen) updatePosition();
    window.addEventListener("scroll", updatePosition);
    return () => window.removeEventListener("scroll", updatePosition);
  }, [searchOpen]);

  const hasResults = searchResults.games.length > 0 || searchResults.products.length > 0;

  return (
    <nav className="w-full mt-[20px] mb-[30px] md:mt-[50px] md:mb-[60px] lg:mt-[50px] lg:mb-[100px] text-white relative">
      <BurgerMenu games={games} categories={categories} activeGame={activeGame} />
      <div className="hidden lg:flex items-center justify-center max-w-[1800px] h-[70px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-5">
          <Link href="/">
            <Image src="/logo.png" alt="logo" width={100} height={100}
              className="object-contain w-[50px] h-[50px] md:w-[120px] md:h-[120px] cursor-pointer" />
          </Link>
          <button
            onClick={() => setCatalogOpen(!catalogOpen)}
            className="bg-[#FF9500]/70 px-20 w-[65px] h-[30px] md:w-[40px] md:h-[30px] lg:w-[45px] lg:h-[50px] font-semibold tracking-2 rounded-lg border-none cursor-pointer flex items-center justify-center transition-all hover:scale-103"
          >
            <span>Catalog</span>
          </button>
        </div>

        <div ref={searchRef} className="relative flex items-center w-[990px] mr-[20px] ml-[33px]">
          <Search className="absolute left-3 w-5 h-5" />
          <input
            type="text"
            value={search}
            className="flex w-full h-[50px] bg-linear-to-r from-[#FF0004]/40 to-[#000000] text-white outline-none pl-10 rounded-[5px] placeholder:text-white"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search games or products..."
            onFocus={() => hasResults && setSearchOpen(true)}
          />
        </div>

        <NavButtons />
      </div>

      {catalogOpen && (
        <CatalogModal categories={categories} activeGame={activeGame} games={games} onClose={() => setCatalogOpen(false)} />
      )}

      {searchOpen && hasResults && createPortal(
        <div
          ref={dropdownRef}
          style={{ position: "fixed", top: `${dropdownStyle.top}px`, left: `${dropdownStyle.left}px`, width: `${dropdownStyle.width}px` }}
          className="bg-[#1a1a1a] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-100"
        >
          {searchResults.games.length > 0 && (
            <div>
              <p className="text-white/40 text-xs px-4 py-2 uppercase tracking-wider border-b border-white/5">Games</p>
              {searchResults.games.map((game) => (
                <Link key={game.id} href={`/games/${game.slug}`}
                  onClick={() => { setSearch(""); setSearchOpen(false); }}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-all"
                >
                  <img src={game.image_url} alt={game.title} className="w-8 h-8 rounded-full object-cover" />
                  <span className="text-white text-sm font-semibold">{game.title}</span>
                </Link>
              ))}
            </div>
          )}
          {searchResults.products.length > 0 && (
            <div>
              <p className="text-white/40 text-xs px-4 py-2 uppercase tracking-wider border-b border-white/5">Products</p>
              {searchResults.products.map((product) => (
                <Link key={product.id} href={`/games/${product.game_slug}/${product.id}`}
                  onClick={() => { setSearch(""); setSearchOpen(false); }}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-all"
                >
                  <img src={product.image_url} alt={product.title} className="w-8 h-8 rounded object-cover" />
                  <span className="text-white text-sm">{product.title} <span className="text-white/40 text-xs capitalize">— {product.category}</span></span>
                </Link>
              ))}
            </div>
          )}
        </div>,
        document.body,
      )}
    </nav>
  );
};

export default Navbar;