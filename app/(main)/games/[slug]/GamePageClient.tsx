"use client";

import { useState, useEffect } from "react";
import { ArrowDown, ArrowBigDown } from "lucide-react";
import { Game, Product, Server } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";

export default function GamePageClient({
  game,
  products,
  servers,
  gameSlug,
  initialService,
}: {
  game: Game | null;
  products: Product[];
  servers: Server[];
  gameSlug: string;
  initialService?: string; // passed from server component via URL segment
}) {
  const router = useRouter();

  const [selectedServer, setSelectedServer] = useState<string>("all");
  const [selectedService, setSelectedService] = useState<string>(
    initialService ?? "all"
  );
  const [selectedFaction, setSelectedFaction] = useState<string>("all");
  const [selectedPvp, setSelectedPvp] = useState<string>("all");
  const [visibleCount, setVisibleCount] = useState(8);

  // Sync selectedService when initialService changes (navigation between slugs)
  useEffect(() => {
    setSelectedService(initialService ?? "all");
    setVisibleCount(8);
  }, [initialService]);

  const services = [
    ...new Set(products.map((p) => p.category).filter(Boolean)),
  ];
  const factions = [...new Set(products.map((p) => p.faction).filter(Boolean))];

  // When service filter changes — navigate to the appropriate URL
  const handleServiceChange = (value: string) => {
    setSelectedService(value);
    setVisibleCount(8);

    if (value === "all") {
      router.push(`/games/${gameSlug}`);
    } else {
      router.push(`/games/${gameSlug}?category=${value}`);
    }
  };

  const filtered = products.filter((p) => {
    if (selectedServer !== "all" && p.server_id !== Number(selectedServer))
      return false;
    if (selectedService !== "all" && p.category !== selectedService)
      return false;
    if (selectedFaction !== "all" && p.faction !== selectedFaction)
      return false;
    return true;
  });

  const visible = filtered.slice(0, visibleCount);

  const FilterButton = ({
    label,
    value,
    options,
    onChange,
  }: {
    label: string;
    value: string;
    options: { value: string; label: string }[] | string[];
    onChange: (v: string) => void;
  }) => (
    <div className="relative flex items-center">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none w-[250px] bg-[#2F292D] text-white text-sm px-[10px] py-[5px] rounded-[5px] border border-white/20 cursor-pointer outline-none transition-all"
      >
        <option value="all">{label}</option>
        {options.map((o) => {
          const val = typeof o === "string" ? o : o.value;
          const lbl = typeof o === "string" ? o : o.label;
          return (
            <option key={val} value={val}>
              {lbl}
            </option>
          );
        })}
      </select>
      <ArrowDown className="absolute right-2 top-1.5 w-[20px] h-[20px] text-white pointer-events-none" />
    </div>
  );

  return (
    <div className="relative w-full mb-[100px]">
      <div className="absolute z-[-1] flex justify-center items-center inset-0">
        <Image
          src="/background-bestseller.jpg"
          alt="bestseller-bg"
          fill
          className="object-cover opacity-20"
        />
      </div>
      <div className="relative max-w-[1700px] mx-auto px-4 py-10 text-white">
        <h1 className="font-rocker text-[75px] font-bold mb-[46px]">
          {game?.title}
        </h1>
        <p className="text-white/70 text-[16px] leading-6 tracking-wider max-w-[1800px] mb-[60px]">
          {game?.description}
        </p>

        <div className="flex flex-wrap gap-[22px] mb-[72px]">
          <FilterButton
            label="Choose your server"
            value={selectedServer}
            options={servers.map((s) => ({
              value: String(s.id),
              label: s.name,
            }))}
            onChange={setSelectedServer}
          />

          {/* Service filter — changes URL */}
          <FilterButton
            label="Choose the service"
            value={selectedService}
            options={services}
            onChange={handleServiceChange}
          />

          <FilterButton
            label="Choose your faction"
            value={selectedFaction}
            options={factions}
            onChange={setSelectedFaction}
          />

          <FilterButton
            label="Choose PVP or PVE"
            value={selectedPvp}
            options={["PVP", "PVE"]}
            onChange={setSelectedPvp}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {visible.map((product) => (
            <Link key={product.id} href={`/games/${gameSlug}/${product.id}`}>
              <div className="bg-[#0B0E14] rounded-xl overflow-hidden transition-all cursor-pointer border border-white/20 hover:bg-white/10">
                <img
                  src={product.image_url}
                  alt={product.title}
                  className="w-full h-[200px] object-cover"
                />
                <div className="p-4">
                  <h3 className="text-[#FF9500] font-bold text-lg mb-2">
                    {product.title} -{" "}
                    <span className="capitalize">{product.category}</span>
                  </h3>
                  <ul className="mb-3">
                    {product.features?.split(",").map((f, i) => (
                      <li key={i} className="text-white text-sm">
                        • {f.trim()}
                      </li>
                    ))}
                  </ul>
                  <p className="text-white/80 text-sm">from</p>
                  <p className="text-white text-2xl font-bold">
                    $ {product.price}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {visibleCount < filtered.length && (
          <div className="flex justify-center mt-[30px]">
            <button
              onClick={() => setVisibleCount((prev) => prev + 8)}
              className="flex items-center gap-2 bg-[#2F292D] hover:bg-white/20 px-6 py-3 rounded-lg text-[20px] transition-all cursor-pointer"
            >
              show more <ArrowBigDown className="w-[20px] h-[20px]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}