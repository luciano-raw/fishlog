"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function AccordionItem({ title, content }: { title: string, content: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-charcoal rounded-2xl border border-forest-green/20 overflow-hidden transition-all duration-300">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between text-left focus:outline-none"
      >
        <span className={`font-bold text-lg transition-colors ${isOpen ? 'text-lime' : 'text-white'}`}>
          {title}
        </span>
        <ChevronDown 
          className={`text-forest-green transition-transform duration-300 ${isOpen ? 'rotate-180 text-lime' : ''}`} 
          size={20} 
        />
      </button>
      
      <div 
        className={`px-4 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-4 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="pt-2 border-t border-forest-green/10">
          <p className="text-light-gray/80 text-sm leading-relaxed whitespace-pre-line">
            {content}
          </p>
        </div>
      </div>
    </div>
  );
}
