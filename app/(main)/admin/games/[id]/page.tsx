import { createClient } from "@/lib/supabase/server";
import GameForm from "./GameForm";

export default async function EditGame({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const isNew = id === "new";

  const { data: game } = isNew
    ? { data: null }
    : await supabase.from("games").select("*").eq("id", id).single();

  return (
    <div>
      <h1 className="text-white text-3xl font-bold mb-8">
        {isNew ? "Add Game" : "Edit Game"}
      </h1>
      <GameForm game={game} isNew={isNew} />
    </div>
  );
}