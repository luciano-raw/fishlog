"use client";

import { useState } from "react";
import { Fish, MapPin, AlertTriangle, Trash2, X, Loader2 } from "lucide-react";
import { deleteItem } from "./actions";

interface HistoryItem {
  id: string;
  type: 'catch' | 'spot' | 'hazard';
  title: string;
  subtitle: string;
  date: string;
  imageUrl?: string | null;
}

export default function HistoryClient({ items, stats }: { items: HistoryItem[], stats: any }) {
  const [activeTab, setActiveTab] = useState<'all' | 'catch' | 'spot' | 'hazard'>('all');
  const [itemToDelete, setItemToDelete] = useState<HistoryItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredItems = items.filter(i => activeTab === 'all' || i.type === activeTab);

  const handleDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    const res = await deleteItem(itemToDelete.id, itemToDelete.type);
    if (res.success) {
      setItemToDelete(null);
    } else {
      alert("Error al eliminar.");
    }
    setIsDeleting(false);
  };

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <section className="grid grid-cols-2 gap-4">
        <div className="bg-charcoal p-4 rounded-3xl border border-forest-green/20 text-center">
          <p className="text-light-gray/60 text-xs font-medium uppercase tracking-wider mb-1">Tus Capturas</p>
          <p className="text-white font-bold text-3xl leading-none">{stats.totalCatches}</p>
        </div>
        <div className="bg-charcoal p-4 rounded-3xl border border-forest-green/20 text-center">
          <p className="text-light-gray/60 text-xs font-medium uppercase tracking-wider mb-1">Récord Peso</p>
          <p className="text-white font-bold text-3xl leading-none">{stats.maxWeight ? `${stats.maxWeight}kg` : '--'}</p>
        </div>
      </section>

      {/* Tabs */}
      <div className="flex bg-charcoal rounded-full p-1 border border-forest-green/20">
        {['all', 'catch', 'spot', 'hazard'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`flex-1 text-xs font-semibold py-2 rounded-full transition-colors capitalize ${
              activeTab === tab ? 'bg-lime text-deep-black shadow-sm' : 'text-light-gray/60 hover:text-white'
            }`}
          >
            {tab === 'all' ? 'Todo' : tab === 'catch' ? 'Capturas' : tab === 'spot' ? 'Lugares' : 'Peligros'}
          </button>
        ))}
      </div>

      {/* Lista */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="text-center p-8 bg-charcoal border border-forest-green/20 rounded-3xl text-light-gray/60">
            No tienes registros aún.
          </div>
        ) : (
          filteredItems.map(item => (
            <div key={`${item.type}-${item.id}`} className="bg-charcoal border border-forest-green/20 rounded-2xl p-4 flex gap-4 items-center relative overflow-hidden group">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-2 border-deep-black shadow-lg ${
                item.type === 'catch' ? 'bg-lime text-deep-black' :
                item.type === 'spot' ? 'bg-blue-500 text-white' :
                'bg-red-500 text-white'
              }`}>
                {item.type === 'catch' ? <Fish size={20} /> : item.type === 'spot' ? <MapPin size={20} /> : <AlertTriangle size={20} />}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold text-lg truncate">{item.title}</h3>
                <p className="text-light-gray/60 text-sm truncate">{item.subtitle}</p>
                <p className="text-light-gray/40 text-xs mt-1">{item.date}</p>
              </div>

              {item.imageUrl && (
                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                </div>
              )}

              <button 
                onClick={() => setItemToDelete(item)}
                className="p-3 text-light-gray/40 hover:text-red-500 transition-colors ml-auto"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Popup de confirmación */}
      {itemToDelete && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isDeleting && setItemToDelete(null)}></div>
          <div className="bg-charcoal border border-forest-green/30 w-full max-w-sm rounded-[2rem] p-6 relative z-10 shadow-2xl">
            <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-xl font-bold text-white text-center mb-2">¿Eliminar registro?</h3>
            <p className="text-light-gray/60 text-center mb-6">
              Estás a punto de eliminar <strong>{itemToDelete.title}</strong>. Esta acción no se puede deshacer.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setItemToDelete(null)}
                disabled={isDeleting}
                className="py-3 rounded-xl bg-deep-black text-white font-medium border border-forest-green/20"
              >
                Cancelar
              </button>
              <button 
                onClick={handleDelete}
                disabled={isDeleting}
                className="py-3 rounded-xl bg-red-500 text-white font-bold flex items-center justify-center gap-2"
              >
                {isDeleting ? <Loader2 size={18} className="animate-spin" /> : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
