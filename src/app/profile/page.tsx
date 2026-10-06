"use client";

import { useUser, UserProfile } from "@clerk/nextjs";
import { Share2, Users } from "lucide-react";

export default function ProfilePage() {
  const { user } = useUser();

  const handleInvite = () => {
    if (!user) return;
    const inviteLink = `${window.location.origin}/invite/${user.id}`;
    const text = `¡Únete a mi red de pesca en Fishlog para compartir nuestros mejores spots y capturas! 🎣\n\nEntra aquí: ${inviteLink}`;
    
    // Si soporta Web Share API (celulares)
    if (navigator.share) {
      navigator.share({
        title: 'Invitación a Fishlog',
        text: text,
      }).catch(console.error);
    } else {
      // Fallback a copiar al portapapeles
      navigator.clipboard.writeText(text);
      alert("Enlace copiado al portapapeles. ¡Pégalo en WhatsApp!");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-deep-black pb-24">
      {/* Cabecera */}
      <div className="p-6 bg-charcoal border-b border-forest-green/20">
        <h1 className="text-2xl font-bold text-white mb-4">Tu Perfil</h1>
        
        {/* Botón de Invitar */}
        <button 
          onClick={handleInvite}
          className="w-full bg-[#25D366]/20 border border-[#25D366]/50 text-[#25D366] font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-3 hover:bg-[#25D366]/30 transition-colors"
        >
          <Share2 size={20} />
          Invitar amigos por WhatsApp
        </button>
        <p className="text-xs text-light-gray/50 mt-2 text-center">Tus amigos podrán ver tus capturas en su mapa.</p>
      </div>

      {/* Perfil de Clerk Integrado */}
      <div className="flex-1 flex justify-center p-4">
        {/* Clerk Inyecta su interfaz aquí */}
        <UserProfile 
          appearance={{
            elements: {
              cardBox: "shadow-none border border-forest-green/20 rounded-2xl",
              navbar: "hidden", // Ocultamos barra lateral para que sea móvil
              pageScrollBox: "p-4",
            }
          }}
        />
      </div>
    </div>
  );
}
