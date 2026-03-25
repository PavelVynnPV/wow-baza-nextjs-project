import { createClient } from "@/lib/supabase/server";
import SlideForm from "./SlideForm";

export default async function EditSlide({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const isNew = id === "new";

  const { data: slide } = isNew
    ? { data: null }
    : await supabase.from("slides").select("*").eq("id", id).single();

  return (
    <div>
      <h1 className="text-white text-3xl font-bold mb-8">
        {isNew ? "Add Slide" : "Edit Slide"}
      </h1>
      <SlideForm slide={slide} isNew={isNew} />
    </div>
  );
}