import Link from "next/link";
import { ArrowRight, Fish, MapPin, TriangleAlert, Users, Waves } from "lucide-react";

export default function Welcome() {
  return <div className="mx-auto flex min-h-full max-w-xl flex-col gap-8 px-5 py-8 sm:py-12">
    <header className="flex items-center justify-between gap-3">
      <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-white"><Fish className="text-lime" size={28} />Fishlog</Link>
      <Link href="/feed" className="rounded-full border border-forest-green/40 px-4 py-2 text-xs font-semibold text-lime hover:bg-charcoal">Iniciar sesión</Link>
    </header>
    <section className="relative overflow-hidden rounded-[2rem] border border-forest-green/40 bg-charcoal px-6 py-8 sm:px-8">
      <div aria-hidden="true" className="pointer-events-none absolute -right-8 -top-8 h-48 w-48 rounded-full bg-lime/5 blur-2xl" />
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-lime/20 bg-lime/5 px-3 py-1.5 text-xs font-medium text-lime"><Waves size={15} />Hecho para compartir la pesca</div>
      <h1 className="max-w-sm text-4xl font-bold leading-tight tracking-tight text-white">Tu próxima historia empieza en el río.</h1>
      <p className="mt-4 text-sm leading-relaxed text-light-gray/65">Descubre capturas, spots y peligros compartidos por otros pescadores. Explora el mapa sin crear una cuenta y encuentra tu próximo lugar.</p>
      <div className="mt-7 flex flex-col gap-3">
        <Link href="/map" className="flex min-h-13 items-center justify-center gap-2 rounded-2xl bg-lime px-5 py-4 font-bold text-deep-black transition-colors hover:bg-lime/90"><MapPin size={20} />Explorar el mapa<ArrowRight size={18} /></Link>
        <Link href="/log" className="flex min-h-13 items-center justify-center gap-2 rounded-2xl border border-forest-green/60 bg-deep-black px-5 py-4 font-semibold text-white transition-colors hover:border-lime"><Fish size={20} className="text-lime" />Compartir mi captura</Link>
      </div>
      <p className="mt-3 text-center text-xs text-light-gray/45">Inicia sesión o crea tu cuenta para publicar.</p>
    </section>
    <section aria-label="Qué puedes descubrir" className="grid grid-cols-3 gap-3">
      {[{ Icon: Fish, title: "Capturas", detail: "Fotos y ubicaciones", color: "text-lime" }, { Icon: MapPin, title: "Spots", detail: "Lugares para explorar", color: "text-blue-400" }, { Icon: TriangleAlert, title: "Peligros", detail: "Reportes del lugar", color: "text-red-400" }].map(({ Icon, title, detail, color }) => (
        <div key={title} className="rounded-2xl border border-forest-green/20 bg-charcoal p-3 text-center"><Icon size={24} className={`mx-auto mb-2 ${color}`} /><h2 className="text-sm font-semibold text-white">{title}</h2><p className="mt-1 text-[11px] leading-relaxed text-light-gray/50">{detail}</p></div>
      ))}
    </section>
    <section className="flex items-start gap-3 px-1"><Users className="mt-1 shrink-0 text-lime" size={22} /><div><h2 className="font-semibold text-white">La pesca se disfruta en comunidad</h2><p className="mt-2 text-sm leading-relaxed text-light-gray/60">Entra al feed, sigue las aventuras de tus amigos y lleva tu propia bitácora de capturas.</p><Link href="/feed" className="mt-3 inline-flex min-h-10 items-center gap-1 text-sm font-semibold text-lime">Entrar al feed<ArrowRight size={15} /></Link></div></section>
  </div>;
}
