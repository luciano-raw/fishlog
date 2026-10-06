export default function FishLoader() {
  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      <svg 
        className="w-12 h-12 text-lime animate-bounce"
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        viewBox="0 0 24 24"
        style={{ animationDuration: '1.5s' }}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.5c-4.665 0-9.28-2.678-10.278-8.156a.75.75 0 0 1 .19-.66C3.415 11.162 6.55 10 9 10c1.782 0 3.328.736 4.772 1.637l.454.283c1.378.859 2.825 1.58 4.774 1.58 1.405 0 2.585-.5 3.344-1.393a.75.75 0 0 1 1.156.974C22.378 14.475 20.67 16 19 16c-2.45 0-4.304-.98-6.104-2.102l-.454-.283C11.127 12.795 9.871 12 9 12c-2.228 0-4.664 1.12-5.717 2.052C3.896 17.518 7.42 19.5 12 19.5a.75.75 0 0 0 0-1.5Z" />
        {/* Cuerpo del pez (Icono custom) */}
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 9c0 1.956-1.503 4.25-3.82 5.568-2.316 1.319-5.118 1.488-7.447.452L4 13.5l1.5-4 4-1.5c2.33-1.036 5.13-.867 7.446.452C17.997 9.75 19.5 12.044 19.5 14Z" className="hidden" />
        {/* Vamos a usar un icono de lucide adaptado si es necesario, pero un path simple funciona bien. */}
        <path d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z" className="opacity-20" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 9.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2 12s3-4 10-4 10 4 10 4-3 4-10 4-10-4-10-4z" />
        {/* Cola del pez */}
        <path strokeLinecap="round" strokeLinejoin="round" d="M22 12l-4-4v8l4-4z" />
      </svg>
      <span className="text-lime font-medium text-sm tracking-widest uppercase animate-pulse">Cargando...</span>
    </div>
  );
}
