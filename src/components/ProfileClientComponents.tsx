"use client";

import { useState } from "react";
import { Share2, Copy, Check, Settings, X } from "lucide-react";
import { UserProfile } from "@clerk/nextjs";

export function InviteButtons({ userId }: { userId: string }) {
  const [copied, setCopied] = useState(false);

  const inviteLink = typeof window !== "undefined" 
    ? `${window.location.origin}/invite/${userId}`
    : `/invite/${userId}`;

  const text = `¡Únete a mi red de pesca en Fishlog para compartir nuestros mejores spots y capturas! 🎣\n\nEntra aquí: ${inviteLink}`;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Invitación a Fishlog",
        text: text,
      }).catch(console.error);
    } else {
      handleCopy();
    }
  };

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="space-y-3">
      <button 
        type="button"
        onClick={handleShare}
        className="w-full bg-[#25D366] text-black font-bold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 hover:brightness-105 active:scale-[0.98] transition-all shadow-lg shadow-[#25D366]/20"
      >
        <Share2 size={20} />
        Invitar amigos por WhatsApp
      </button>

      <button
        type="button"
        onClick={handleCopy}
        className="w-full bg-charcoal text-white font-medium py-3 px-4 rounded-2xl border border-forest-green/40 flex items-center justify-center gap-2 hover:border-lime active:scale-[0.98] transition-all text-sm"
      >
        {copied ? (
          <>
            <Check size={18} className="text-lime" />
            <span className="text-lime font-bold">¡Enlace copiado!</span>
          </>
        ) : (
          <>
            <Copy size={18} className="text-forest-green" />
            <span>Copiar enlace de invitación</span>
          </>
        )}
      </button>
    </div>
  );
}

export function ClerkSettingsToggle() {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setShowSettings(!showSettings)}
        className="w-full bg-charcoal text-light-gray/80 hover:text-white p-4 rounded-2xl border border-forest-green/20 flex items-center justify-between transition-colors text-sm"
      >
        <span className="flex items-center gap-2 font-medium">
          <Settings size={18} className="text-forest-green" />
          Ajustes de Cuenta y Seguridad
        </span>
        <span className="text-xs text-light-gray/50">
          {showSettings ? "Ocultar" : "Editar"}
        </span>
      </button>

      {showSettings && (
        <div className="mt-4 p-2 bg-charcoal/50 rounded-3xl border border-forest-green/30">
          <UserProfile 
            appearance={{
              elements: {
                cardBox: "shadow-none border-none bg-transparent",
                navbar: "hidden",
                pageScrollBox: "p-2",
              }
            }}
          />
        </div>
      )}
    </div>
  );
}
