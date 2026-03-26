"use client";
import { useState } from "react";
import { Zap, ChevronDown, X } from "lucide-react";

const NEWS = ["🔥 نوێکاری v2: ریاکشنی گروپ زیادکرا!", "⚡ Uptime 99.99٪", "🎉 زیاتر لە ١٠٠٠ بۆت تۆمارکراون!", "🚀 بنووسە /help بۆ یارمەتی"];

export default function Header({ tgUser }) {
  const [menu, setMenu] = useState(false);

  return (
    <div className="sticky top-0 z-50">
      <div className="glass border-b border-white/5 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold leading-none">Reaction Bot Maker</p>
            <p className="text-[10px] text-white/30">by RBM</p>
          </div>
        </div>

        <button onClick={() => setMenu(!menu)} className="flex items-center gap-2 glass rounded-full px-3 py-1.5">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-xs font-bold">
            {tgUser?.first_name?.[0] || "?"}
          </div>
          <span className="text-xs max-w-[70px] truncate text-white/80">{tgUser?.first_name || "..."}</span>
          <ChevronDown size={12} className={`text-white/40 transition-transform ${menu ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Ticker */}
      <div className="bg-blue-600/10 border-b border-blue-500/20 py-1 overflow-hidden flex items-center gap-2 px-3">
        <span className="text-[10px] text-blue-400 font-bold shrink-0 bg-blue-500/20 px-2 py-0.5 rounded-full">📢</span>
        <div className="overflow-hidden flex-1">
          <span className="animate-ticker text-[11px] text-blue-300/70">{NEWS.join("   •   ")}</span>
        </div>
      </div>

      {/* Dropdown */}
      {menu && (
        <div className="absolute top-full right-4 mt-1 w-44 glass rounded-2xl p-2 shadow-2xl z-50">
          <button onClick={() => setMenu(false)} className="absolute top-2 right-2 glass rounded-full p-1"><X size={12} /></button>
          {[["👤","پرۆفایلەکەم"],["📖","ڕێنمایی"],["💬","پشتگیری"]].map(([icon,label]) => (
            <button key={label} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-sm text-white/70">
              <span>{icon}</span><span>{label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
