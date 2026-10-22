"use client";

import { useId, useRef, useState } from "react";
import { Fish, ArrowUpLeft } from "lucide-react";
import { suggestSpecies, type SpeciesOption } from "@/lib/speciesSuggestions";

export default function SpeciesInput({ value, onChange, options }: {
  value: string; onChange: (value: string) => void; options: SpeciesOption[];
}) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const suggestions = suggestSpecies(options, value);
  const expanded = open && value.trim().length > 0;
  const activeId = expanded && active >= 0 && active < suggestions.length ? `${id}-option-${active}` : undefined;

  function select(option: SpeciesOption) {
    onChange(option.name); input.current?.focus(); setOpen(false); setActive(-1);
  }

  return <div className="space-y-2" onBlur={event => {
    if (!event.currentTarget.contains(event.relatedTarget)) { setOpen(false); setActive(-1); }
  }}>
    <label htmlFor={id} className="text-sm font-medium text-light-gray/70">Especie</label>
    <div className="relative">
      <Fish size={20} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-forest-green" />
      <input ref={input} id={id} type="text" name="species" required role="combobox" autoComplete="off"
        aria-autocomplete="list" aria-expanded={expanded && suggestions.length > 0} aria-controls={expanded && suggestions.length ? `${id}-list` : undefined}
        aria-activedescendant={activeId} aria-describedby={`${id}-help`}
        placeholder="Ej. Trucha arcoíris" value={value}
        className="w-full rounded-2xl border border-forest-green/20 bg-charcoal py-4 pl-12 pr-4 text-white outline-none transition-colors focus:border-lime"
        onChange={event => { onChange(event.target.value); setOpen(true); setActive(-1); }}
        onFocus={() => { setOpen(true); setActive(-1); }}
        onKeyDown={event => {
          if (event.nativeEvent.isComposing) return;
          if (event.key === "Escape") { event.preventDefault(); setOpen(false); setActive(-1); }
          if ((event.key === "ArrowDown" || event.key === "ArrowUp") && suggestions.length) {
            event.preventDefault(); setOpen(true);
            setActive(event.key === "ArrowDown" ? (active + 1) % suggestions.length : active <= 0 ? suggestions.length - 1 : active - 1);
          }
          if (event.key === "Enter" && activeId && suggestions[active]) { event.preventDefault(); select(suggestions[active]); }
        }} />
    </div>
    {expanded && (suggestions.length ? <div className="overflow-hidden rounded-2xl border border-forest-green/40 bg-charcoal shadow-lg">
      <p className="border-b border-white/5 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-light-gray/45">De la enciclopedia</p>
      <ul id={`${id}-list`} role="listbox" aria-label="Especies sugeridas" className="divide-y divide-white/5">
        {suggestions.map((option, index) => <li key={option.id} role="presentation">
          <button type="button" role="option" id={`${id}-option-${index}`} aria-selected={active === index} tabIndex={-1}
            onMouseDown={event => event.preventDefault()} onClick={() => select(option)}
            className={`flex min-h-14 w-full items-center gap-3 px-3 py-2.5 text-left transition-colors ${active === index ? "bg-lime/10" : "hover:bg-white/5"}`}>
            <Fish size={18} aria-hidden="true" className="shrink-0 text-lime/70" />
            <span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-white">{option.name}</span><span className="block text-xs italic text-light-gray/50">{option.scientificName}</span></span>
            <ArrowUpLeft size={16} aria-hidden="true" className="shrink-0 text-light-gray/40" />
          </button>
        </li>)}
      </ul>
    </div> : <p className="rounded-xl border border-white/5 bg-charcoal px-3 py-2 text-xs text-light-gray/60">No hay coincidencias. Puedes guardar el nombre que escribiste.</p>)}
    <p id={`${id}-help`} className="text-xs leading-relaxed text-light-gray/50">Elige una sugerencia o escribe otra especie.</p>
    <span role="status" className="sr-only">{expanded ? suggestions.length ? `${suggestions.length} sugerencias disponibles.` : "Sin sugerencias. Puedes usar tu propio nombre." : ""}</span>
  </div>;
}
