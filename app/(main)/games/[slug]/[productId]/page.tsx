import GamePageClient from "../GamePageClient";
import ProductClient from "./ProductClient";
import { supabase } from "@/lib/supabase";
import { Game, Product, Server, ProductTemplate } from "@/types";

export default async function GameDynamicPage({
  params,
}: {
  params: Promise<{ slug: string; productId: string }>;
}) {
  const { slug, productId } = await params;

  const isProduct = /^\d+$/.test(productId);

  if (isProduct) {
    const [{ data: product }, { data: game }, { data: servers }] =
      await Promise.all([
        supabase.from("products").select("*").eq("id", productId).single(),
        supabase.from("games").select("*").eq("slug", slug).single(),
        supabase.from("servers").select("*").eq("game_slug", slug),
      ]);

    const { data: template } = await supabase
      .from("product_templates")
      .select("*")
      .eq("category", product?.category)
      .single();

    return (
      <ProductClient
        product={product as Product}
        game={game as Game}
        template={template as ProductTemplate | null}
        servers={(servers ?? []) as Server[]}
        gameSlug={slug}
      />
    );
  }

  // service filter page e.g. /games/w_burning_crusade/gold
  const [{ data: game }, { data: products }, { data: servers }] =
    await Promise.all([
      supabase.from("games").select("title, description").eq("slug", slug).single(),
      supabase.from("products").select("*").eq("game_slug", slug).eq("is_active", true),
      supabase.from("servers").select("*").eq("game_slug", slug),
    ]);

  return (
    <GamePageClient
      game={game as Game}
      products={(products ?? []) as Product[]}
      servers={(servers ?? []) as Server[]}
      gameSlug={slug}
      initialService={productId}
    />
  );
}