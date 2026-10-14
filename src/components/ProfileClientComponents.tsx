"use client";

import { useState, useEffect } from "react";
import { Share2, Copy, Check, Settings, Trash2, Bell, BellOff, Loader2, Fish, MapPin } from "lucide-react";
import { UserProfile } from "@clerk/nextjs";
import { removeFriend } from "@/app/actions/friends";
import { savePushSubscription, removePushSubscription } from "@/app/actions/pushSubscription";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

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

export function FriendItemRow({
  friend,
}: {
  friend: {
    id: string;
    username: string | null;
    avatarUrl: string | null;
    _count: { catches: number; spots: number };
  };
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const friendName = friend.username || "este amigo";
    const confirmed = window.confirm(
      `¿Deseas eliminar a ${friendName} de tu lista de amigos? Dejarán de ver sus capturas y spots en el mapa.`
    );
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await removeFriend(friend.id);
    } catch (err: any) {
      alert(err?.message || "No se pudo eliminar el amigo");
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-charcoal rounded-2xl border border-forest-green/20 shadow-md">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-11 h-11 rounded-full overflow-hidden bg-deep-black border border-forest-green/40 flex items-center justify-center shrink-0">
          {friend.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={friend.avatarUrl} alt={friend.username || "Amigo"} className="w-full h-full object-cover" />
          ) : (
            <span className="text-sm font-bold text-forest-green">
              {(friend.username || "A").charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-white font-bold text-sm truncate">{friend.username || "Amigo"}</p>
          <div className="flex items-center gap-3 text-[11px] text-light-gray/60 mt-0.5">
            <span className="flex items-center gap-1">
              <Fish size={12} className="text-lime" /> {friend._count.catches} capturas
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={12} className="text-[#3b82f6]" /> {friend._count.spots} spots
            </span>
          </div>
        </div>
      </div>

      <button
        type="button"
        disabled={isDeleting}
        onClick={handleDelete}
        title="Eliminar amigo"
        className="p-2.5 text-light-gray/40 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-colors disabled:opacity-50 shrink-0 ml-2"
      >
        {isDeleting ? <Loader2 size={16} className="animate-spin text-red-400" /> : <Trash2 size={16} />}
      </button>
    </div>
  );
}

export function PushNotificationManager() {
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">("default");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window) || !("serviceWorker" in navigator)) {
      setPermission("unsupported");
      return;
    }
    setPermission(Notification.permission);

    // Comprobar suscripción existente
    navigator.serviceWorker.ready.then((reg) => {
      reg.pushManager.getSubscription().then((sub) => {
        setIsSubscribed(!!sub);
      });
    });
  }, []);

  const handleToggle = async () => {
    if (permission === "unsupported") {
      alert("Tu navegador no soporta notificaciones push. En iPhone, debes agregar la app a tu pantalla de inicio.");
      return;
    }

    setIsLoading(true);
    try {
      const reg = await navigator.serviceWorker.ready;

      if (isSubscribed) {
        // Desuscribir
        const sub = await reg.pushManager.getSubscription();
        if (sub) {
          await sub.unsubscribe();
          await removePushSubscription(sub.endpoint);
        }
        setIsSubscribed(false);
      } else {
        // Solicitar permiso si aún no fue otorgado
        const result = await Notification.requestPermission();
        setPermission(result);

        if (result !== "granted") {
          alert("Debes permitir las notificaciones en tu navegador o ajustes del teléfono.");
          setIsLoading(false);
          return;
        }

        const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
        if (!vapidPublicKey) {
          throw new Error("Clave VAPID pública no configurada.");
        }

        const convertedKey = urlBase64ToUint8Array(vapidPublicKey);
        const newSub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedKey,
        });

        const subJson = newSub.toJSON();
        if (!subJson.endpoint || !subJson.keys?.p256dh || !subJson.keys?.auth) {
          throw new Error("Error obteniendo claves de suscripción.");
        }

        await savePushSubscription({
          endpoint: subJson.endpoint,
          keys: {
            p256dh: subJson.keys.p256dh,
            auth: subJson.keys.auth,
          },
        });

        setIsSubscribed(true);
      }
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "No se pudo cambiar la configuración de notificaciones.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-charcoal p-5 rounded-3xl border border-forest-green/20 space-y-3 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isSubscribed ? <Bell size={18} className="text-lime" /> : <BellOff size={18} className="text-forest-green" />}
          <h2 className="text-white font-bold text-base">Alertas en tu Teléfono (Push)</h2>
        </div>
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
            isSubscribed ? "bg-lime/20 text-lime border border-lime/40" : "bg-white/5 text-light-gray/50 border border-white/10"
          }`}
        >
          {isSubscribed ? "Activas" : "Inactivas"}
        </span>
      </div>

      <p className="text-xs text-light-gray/70 leading-relaxed">
        Recibe avisos directos en tu pantalla de bloqueo cuando tus amigos registren una captura, un spot o alerten de un peligro.
      </p>

      {permission === "denied" && (
        <p className="text-xs text-amber-400 bg-amber-400/10 p-2.5 rounded-xl border border-amber-400/20">
          ⚠️ Notificaciones bloqueadas en los ajustes del navegador. Habilítalas en el candado de la barra de direcciones para recibirlas.
        </p>
      )}

      <button
        type="button"
        disabled={isLoading || permission === "denied"}
        onClick={handleToggle}
        className={`w-full py-3 px-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all text-sm disabled:opacity-50 ${
          isSubscribed
            ? "bg-deep-black text-light-gray/80 border border-forest-green/40 hover:text-red-400 hover:border-red-400/40"
            : "bg-lime text-deep-black shadow-lg shadow-lime/20 hover:brightness-105 active:scale-[0.98]"
        }`}
      >
        {isLoading ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Configurando...
          </>
        ) : isSubscribed ? (
          <>
            <BellOff size={16} /> Desactivar Alertas en este equipo
          </>
        ) : (
          <>
            <Bell size={16} /> Activar Alertas en este equipo
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
