"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { CircleChevronRight } from "lucide-react";

interface Feature {
  id: number;
  title: string;
  description: string;
  icon_url: string;
  order: number;
}

export default function WhyUs() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [active, setActive] = useState<Feature | null>(null);

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from("features")
        .select("*")
        .eq("is_active", true)
        .order("order");
      if (data && data.length > 0) {
        setFeatures(data as Feature[]);
        setActive(data[0] as Feature);
      }
    }
    fetch();
  }, []);

  return (
    <div className="max-w-[1700px] mx-auto px-4 py-16 pt-[26px] pb-[150px] ">
      <h2 className="text-white text-center text-4xl font-bold mb-12">
        WHY SHOULD U CHOOSE US
      </h2>

      <div className="hidden lg:flex gap-8 justify-center items-center">
        <div className="flex flex-col gap-[26px] w-[45%]">
          {features.map((f) => (
            <button
              key={f.id}
              onClick={() => setActive(f)}
              className={`flex items-center justify-between px-5 h-[40px] rounded-lg border transition-all text-left cursor-pointer ${
                active?.id === f.id
                  ? "border-[#FF9500] text-white"
                  : "border-white/20 text-white/60 hover:border-white/40"
              }`}
            >
              <span className="font-semibold text-[20px] text-white">
                {f.title}
              </span>
              <span>
                <CircleChevronRight />
              </span>
            </button>
          ))}
        </div>
        <div className="w-[5px] h-[50vh] bg-white" />
        {active && (
          <div className="flex-1 bg-white/5 rounded-xl py-[24px] flex flex-col items-center text-center gap-[23px] max-h-[451px]">
            <h3 className="text-white text-[20px] font-semibold">
              {active.title}
            </h3>
            {active.icon_url && (
              <img
                src={active.icon_url}
                alt={active.title}
                className="w-[160px] h-[160px] object-contain"
              />
            )}
            <p className="text-white/70 text-[16px] leading-relaxed text-center px-[68px]">
              {active.description}
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 lg:hidden">
        {features.map((f) => (
          <div
            key={f.id}
            className="border border-white/20 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => setActive(active?.id === f.id ? null : f)}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <span
                className={`font-semibold text-[20px] ${active?.id === f.id ? "text-[#FF9500]" : "text-white"}`}
              >
                {f.title}
              </span>
              <CircleChevronRight
                className={
                  active?.id === f.id ? "text-[#FF9500]" : "text-white/60"
                }
              />
            </button>

            {active?.id === f.id && (
              <div className="px-5 pb-5 flex flex-col items-center text-center border-t border-white/10">
                {f.icon_url && (
                  <img
                    src={f.icon_url}
                    alt={f.title}
                    className="w-16 h-16 object-contain my-4"
                  />
                )}
                <p className="text-white/70 text-sm leading-relaxed">
                  {f.description}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
