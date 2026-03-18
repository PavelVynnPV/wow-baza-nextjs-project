"use client";

import Image from "next/image";
import React, { useState } from "react";
import NavButtons from "./NavButtons";
import { Search } from "lucide-react";

const Navbar = () => {
  const [search, setSearch] = useState("");

  // SEARCH FILTER
  // const filtered = products.filter(p =>
  //     p.title.toLowerCase().includes(search.toLowerCase())
  //   )

  return (
    <nav className="w-full mt-[50px] mb-[100px] text-white">
      {/* navbar container */}
      <div className="flex items-center justify-center max-w-[1800px] h-[70px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* logo + catalog */}
        <div className="flex items-center gap-5">
          <Image
            src="/logo.png"
            alt="logo"
            width={100}
            height={100}
            className="object-contain w-[50px] h-[50px] md:w-[120px] md:h-[120px] cursor-pointer"
          />
          <button className="bg-[#FF9500]/70 px-20 w-[65px] h-[30px] md:w-[40px] md:h-[30px] lg:w-[45px] lg:h-[50px] font-semibold tracking-2 rounded-lg border-none cursor-pointer flex items-center justify-center transition-all hover:scale-103">
            <span>Catalog</span>
          </button>
        </div>

        {/* Search bar */}
        <div className="relative flex items-center w-[990px] mr-[20px] ml-[33px]">
        <Search className="absolute left-3 w-5 h-5" />
        <input
            type="text"
            value={search}
            className="flex w-full h-[30px] md:h-[30px] lg:h-[50px] bg-linear-to-r from-[#FF0004]/40 to-[#000000] text-white outline-none pl-10 rounded-[5px] placeholder:text-white"
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Search'
          />
        </div>
        {/* Help+lang+profile+cart btns */}
        <NavButtons />
      </div>
    </nav>
  );
};

export default Navbar;
