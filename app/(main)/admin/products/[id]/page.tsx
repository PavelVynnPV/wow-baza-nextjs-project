import { createClient } from "@/lib/supabase/server";
import ProductForm from "./ProductForm";

export default async function EditProduct({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const isNew = id === "new";

  const { data: product } = isNew
    ? { data: null }
    : await supabase.from("products").select("*").eq("id", id).single();

  return (
    <div>
      <h1 className="text-white text-3xl font-bold mb-8">
        {isNew ? "Add Product" : "Edit Product"}
      </h1>
      <ProductForm product={product} isNew={isNew} />
    </div>
  );
}