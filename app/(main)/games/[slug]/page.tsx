import GamePageClient from "./GamePageClient";
import { supabase } from "@/lib/supabase";
import { Game, Product, Server } from "@/types";

export default async function GamePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [{ data: game }, { data: products }, { data: servers }] =
    await Promise.all([
      supabase
        .from("games")
        .select("title, description")
        .eq("slug", slug)
        .single(),
      supabase
        .from("products")
        .select("*")
        .eq("game_slug", slug)
        .eq("is_active", true),
      supabase.from("servers").select("*").eq("game_slug", slug),
    ]);

  return (
    <GamePageClient
      game={game as Game}
      products={(products ?? []) as Product[]}
      servers={(servers ?? []) as Server[]}
      gameSlug={slug}
    />
  );
}
