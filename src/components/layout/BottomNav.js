"use client";
import { Bot, Globe, User, Bell } from "lucide-react";

const TABS = [
  { id:"create",  label:"دروستکردن", Icon:Bot },
  { id:"bots",    label:"هەموو",     Icon:Globe },
  { id:"mybots",  label:"بۆتەکانم",  Icon:User },
  { id:"updates", label:"نوێکاری",   Icon:Bell },
];

export default function BottomNav({ active, onChange }) {
  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm">
      <div className="glass border border-white/10 rounded-2xl p-1.5 flex shadow-2xl shadow-black/60">
        {TABS.map(({ id, label, Icon }) => {
          const on = active === id;
          return (
            <button key={id} onClick={() => onChange(id)}
              className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-xl transition-all duration-200 ${on ? "bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg shadow-blue-500/30" : "hover:bg-white/5"}`}>
              <Icon size={18} className={on ? "text-white" : "text-white/30"} />
              <span className={`text-[9px] font-semibold ${on ? "text-white" : "text-white/25"}`}>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
