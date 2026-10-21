import Link from "next/link";
import { notFound } from "next/navigation";
import { Store, ChevronLeft } from "lucide-react";
import { getAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import ShopForm, { ShopDeleteButton } from "./ShopForm";

export default async function ShopsPage({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  if (!await getAdmin()) notFound();
  const { edit } = await searchParams;
  const shops = await prisma.shop.findMany({ orderBy: { createdAt: "desc" } });
  const shop = typeof edit === "string" ? shops.find(item => item.id === edit) : undefined;
  if (edit && !shop) notFound();
  return <div className="mx-auto max-w-xl space-y-6 p-4">
    <header className="flex items-center gap-3"><Link href="/profile" aria-label="Volver al perfil" className="p-2 text-lime"><ChevronLeft /></Link><Store className="text-amber-300" /><h1 className="text-xl font-bold text-white">Administrar tiendas</h1></header>
    <p className="text-sm text-light-gray/60">Solo los administradores pueden agregar, editar o retirar estos puntos del mapa.</p>
    <section className="space-y-4"><div className="flex items-center justify-between"><h2 className="font-semibold text-white">{shop ? "Editar tienda" : "Nueva tienda"}</h2>{shop && <Link href="/admin/shops" className="text-sm text-lime">Cancelar edición</Link>}</div><ShopForm key={shop?.id ?? "new"} shop={shop} /></section>
    <section className="space-y-3"><h2 className="font-semibold text-white">Tiendas registradas ({shops.length})</h2>
      {!shops.length && <p className="text-sm text-light-gray/50">Todavía no hay tiendas. Agrega la primera usando el formulario.</p>}
      {shops.map(item => <article key={item.id} className="rounded-2xl border border-amber-300/20 bg-charcoal p-4"><h3 className="font-semibold text-white">{item.name}</h3>{item.address && <p className="mt-1 text-sm text-light-gray/60">{item.address}</p>}<div className="mt-2 flex items-center gap-5"><Link href={`/map?shopId=${encodeURIComponent(item.id)}`} className="py-2 text-xs text-amber-300">Ver en el mapa</Link><Link href={`/admin/shops?edit=${encodeURIComponent(item.id)}`} className="py-2 text-xs text-lime">Editar</Link><ShopDeleteButton id={item.id} name={item.name} /></div></article>)}
    </section>
  </div>;
}
