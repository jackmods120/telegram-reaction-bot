"use client";
import { useState } from "react";
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Eye, ThumbsUp, ThumbsDown, X } from "lucide-react";

const STATS = [
  { label:"گشتی بۆتەکان", value:"1,247", icon:"🤖", cls:"glass-blue text-blue-400" },
  { label:"دروستکەران",    value:"892",   icon:"👥", cls:"glass-purple text-purple-400" },
  { label:"کاردەکات",      value:"1,180", icon:"✅", cls:"glass-green text-green-400" },
  { label:"وەستاوە",       value:"67",    icon:"❌", cls:"glass-red text-red-400" },
  { label:"بەکارهێنەر/ڕۆژ",value:"8,432",icon:"📊", cls:"glass-blue text-blue-400" },
  { label:"فەرمان/٢٤ک",   value:"23.4K", icon:"⚡", cls:"glass-purple text-purple-400" },
  { label:"وەڵامدانەوە",  value:"27ms",  icon:"🚀", cls:"glass-green text-green-400" },
  { label:"Uptime",        value:"99.99%",icon:"💯", cls:"glass-blue text-blue-400" },
];

const TREND = Array.from({length:10},(_,i)=>({ d:`${i+1}`, v: 80+Math.floor(Math.random()*60) }));

const TOP_BOTS = [
  { rank:1, name:"SuperReact Bot", user:"superreact", users:2341, status:"working", gold:true },
  { rank:2, name:"Kurdish Bot",    user:"kurdish_bot",users:1892, status:"working" },
  { rank:3, name:"Fire Reaction",  user:"fire_react", users:1654, status:"working" },
  { rank:4, name:"Daily Bot",      user:"daily_bot",  users:1203, status:"stopped" },
  { rank:5, name:"Smart React",    user:"smart_react",users:987,  status:"working" },
];

const MEDALS = ["🥇","🥈","🥉"];

export default function AllBotsScreen() {
  const [ltab, setLtab] = useState("bots");
  const [sel, setSel] = useState(null);

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-bold">📊 داشبۆردی گشتی</h2>

      {/* Stats grid */}
      <div className="grid grid-cols-4 gap-2">
        {STATS.map(s => (
          <div key={s.label} className={`${s.cls} rounded-xl p-2.5 text-center`}>
            <div className="text-lg mb-0.5">{s.icon}</div>
            <div className="text-sm font-bold">{s.value}</div>
            <div className="text-[9px] text-white/40 mt-0.5 leading-tight">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Trend chart */}
      <div className="glass rounded-2xl p-4">
        <p className="text-sm font-semibold text-white/70 mb-3">📈 بۆتی دروستکراو — ١٠ ڕۆژی دواوە</p>
        <ResponsiveContainer width="100%" height={110}>
          <LineChart data={TREND}>
            <XAxis dataKey="d" tick={{fill:"#ffffff25",fontSize:9}} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{background:"#12121A",border:"1px solid #1E1E2E",borderRadius:10,fontSize:11}} />
            <Line type="monotone" dataKey="v" stroke="#3B82F6" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Leaderboard */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="flex border-b border-white/5">
          {[["bots","بەرزترین بۆتەکان"],["creators","بەرزترین دروستکەران"]].map(([id,label])=>(
            <button key={id} onClick={()=>setLtab(id)}
              className={`flex-1 py-3 text-sm font-semibold transition-colors ${ltab===id?"text-blue-400 border-b-2 border-blue-500":"text-white/30"}`}>
              {label}
            </button>
          ))}
        </div>
        <div className="p-3 space-y-2">
          {TOP_BOTS.map(bot=>(
            <div key={bot.rank} className={`flex items-center gap-3 p-3 rounded-xl ${bot.gold?"gold-border":"glass"}`}>
              <span className="w-6 text-center text-sm font-bold">
                {bot.rank<=3 ? MEDALS[bot.rank-1] : <span className="text-white/25">{bot.rank}</span>}
              </span>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold shrink-0">
                {bot.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{bot.name}</p>
                <p className="text-[10px] text-white/30">@{bot.user}</p>
              </div>
              <div className="text-right shrink-0">
                <div className={`text-[9px] px-2 py-0.5 rounded-full font-semibold mb-1 ${bot.status==="working"?"bg-green-500/20 text-green-400":"bg-red-500/20 text-red-400"}`}>
                  {bot.status==="working"?"✅ کاردەکات":"❌ وەستاوە"}
                </div>
                <p className="text-[10px] text-white/30">{bot.users.toLocaleString()}</p>
              </div>
              <button onClick={()=>setSel(bot)} className="glass-blue rounded-lg p-2 text-blue-400 shrink-0">
                <Eye size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Bot detail modal */}
      {sel && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-end" onClick={()=>setSel(null)}>
          <div className={`w-full p-5 pb-8 space-y-4 ${sel.gold?"gold-border":"glass"} rounded-t-3xl`} onClick={e=>e.stopPropagation()}>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl font-bold">
                  {sel.name[0]}
                </div>
                <div>
                  <p className="font-bold">{sel.name}</p>
                  <p className="text-xs text-white/40">@{sel.user}</p>
                </div>
              </div>
              <button onClick={()=>setSel(null)} className="glass rounded-full p-2"><X size={16}/></button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {[["ستاتوس",sel.status==="working"?"✅ کاردەکات":"❌ وەستاوە"],["ئامێر",MEDALS[sel.rank-1]||"#"+sel.rank],["بەکارهێنەران",sel.users.toLocaleString()],["ڕوتبە","#"+sel.rank]].map(([k,v])=>(
                <div key={k} className="glass rounded-xl p-3">
                  <p className="text-white/40 mb-1">{k}</p>
                  <p className="font-semibold">{v}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 glass-green rounded-xl py-3 text-green-400 font-semibold text-sm">
                <ThumbsUp size={16}/><span>{sel.users}</span>
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 glass-red rounded-xl py-3 text-red-400 font-semibold text-sm">
                <ThumbsDown size={16}/><span>12</span>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button className="glass-blue rounded-xl py-3 text-blue-400 text-sm font-semibold">زیادکردن بۆ کانال</button>
              <button className="glass-purple rounded-xl py-3 text-purple-400 text-sm font-semibold">زیادکردن بۆ گروپ</button>
              <button className="glass rounded-xl py-3 text-white/60 text-sm font-semibold col-span-2">کردنەوەی بۆتەکە</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
