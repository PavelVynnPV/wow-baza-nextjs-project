"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

import SliderDots from "./SliderDots";

interface Slide {
  id: number;
  title_frase: string;
  title_game_name: string;
  slide_description: string;
  slide_button: string;
  image_url: string;
  order: number;
  is_active: boolean;
}

export default function Slider() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    async function fetchSlides() {
      const { data, error } = await supabase
        .from("slides")
        .select("*")
        .eq("is_active", true)
        .order("order", { ascending: true });

      if (data) setSlides(data as Slide[]);
    }
    fetchSlides();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(timer);
  }, [slides]);

  if (slides.length === 0) return <div>Loading...</div>;

  return (
    <div className="text-white max-w-[1700px] mx-auto px-2 mb-[80px]">
      <div className="relative w-full h-[500px] overflow-hidden mb-5">
        <img
          src={slides[current].image_url}
          className="absolute inset-0 w-full h-full object-cover rounded-3xl"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/20 to-transparent rounded-3xl"/>

        <div className="absolute bottom-10 left-3 text-white z-10 space-y-[11px] md:bottom-10 md:left-9">
          <p className="text-[24px] font-semibold m-0">
            {slides[current].title_frase}
          </p>
          <h2 className="text-[35px] font-bold m-0">
            {slides[current].title_game_name}
          </h2>
          <p className="text-[12px] font-medium m-0">
            {slides[current].slide_description}
          </p>
          <button className="mt-5 bg-[#FF0004]/50 px-4 py-2 rounded text-sm border lg:w-[100px] lg:h-[40px] cursor-pointer hover:scale-105">
            {slides[current].slide_button}
          </button>
        </div>
      </div>
      <SliderDots
        total={slides.length}
        current={current}
        onChange={setCurrent}
      />
    </div>
  );
}
