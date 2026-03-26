"use client";
import { useState, useEffect } from "react";
import { Search, Settings, Bot, User } from "lucide-react";
import ManageBot from "./ManageBot";

export default function MyBotsScreen({ tgUser }) {
  const [tab, setTab] = useState("mybots");
  const [bots, setBots] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [managing, setManaging] = useState(null);

  useEffect(() => {
    if (!tgUser?.id) return;
    fetch(`/api/bots/my?telegramId=${tgUser.id}`)
      .then(r => r.json())
      .then(d => { setBots(d.bots||[]); setLoading(false); })
      .catch(() => setLoading(false));
  }, [tgUser]);

  if (managing) return <ManageBot bot={managing} tgUser={tgUser} onBack={() => setManaging(null)} onUpdate={updated => setBots(prev => prev.map(b => b.id===updated.id ? updated : b))} />;

  const filtered = bots.filter(b =>
    (b.botName||"").toLowerCase().includes(search.toLowerCase()) ||
    (b.username||"").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-2">
        {[
          ["گشتی", bots.length, "text-blue-400 glass-blue"],
          ["کاردەکات", bots.filter(b=>b.status==="working").length, "text-green-400 glass-green"],
          ["وەستاوە", bots.filter(b=>b.status==="stopped").length, "text-red-400 glass-red"],
        ].map(([label, val, cls]) => (
          <div key={label} className={`${cls} rounded-xl p-3 text-center`}>
            <p className="text-2xl font-bold">{val}</p>
            <p className="text-[10px] text-white/40 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="flex border-b border-white/5">
          {[["mybots","بۆتەکانم",<Bot size={13}/>],["profile","پرۆفایل",<User size={13}/>]].map(([id,label,icon])=>(
            <button key={id} onClick={()=>setTab(id)}
              className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors ${tab===id?"text-blue-400 border-b-2 border-blue-500":"text-white/30"}`}>
              {icon}{label}
            </button>
          ))}
        </div>

        <div className="p-4">
          {tab==="mybots" ? (
            <div className="space-y-3">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="گەڕان بۆ بۆتەکان..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/15 focus:outline-none focus:border-blue-500/50" />
              </div>

              {loading ? (
                [1,2,3].map(i=><div key={i} className="h-16 glass rounded-xl animate-pulse" />)
              ) : filtered.length===0 ? (
                <div className="text-center py-10">
                  <Bot size={44} className="mx-auto text-white/10 mb-3" />
                  <p className="text-sm text-white/25">هیچ بۆتێکت نییە</p>
                  <p className="text-xs text-white/15 mt-1">لە تابی دروستکردن بۆتت دروست بکە</p>
                </div>
              ) : filtered.map(bot=>(
                <div key={bot.id} className="glass rounded-xl p-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold shrink-0">
                    {(bot.botName||"B")[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{bot.botName||"بۆت"}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${bot.status==="working"?"bg-green-500/20 text-green-400":"bg-red-500/20 text-red-400"}`}>
                        {bot.status==="working"?"✅ کاردەکات":"❌ وەستاوە"}
                      </span>
                      {bot.username && <span className="text-[10px] text-white/25">@{bot.username}</span>}
                    </div>
                  </div>
                  <button onClick={()=>setManaging(bot)} className="glass-blue rounded-xl px-3 py-2 text-xs text-blue-400 font-semibold flex items-center gap-1 shrink-0">
                    <Settings size={13}/><span>بەڕێوەبردن</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <ProfileTab tgUser={tgUser} />
          )}
        </div>
      </div>
    </div>
  );
}

function ProfileTab({ tgUser }) {
  const now = new Date();
  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl font-bold mx-auto mb-3 shadow-lg shadow-blue-500/30">
          {tgUser?.first_name?.[0]||"?"}
        </div>
        <h3 className="text-lg font-bold">{tgUser?.first_name} {tgUser?.last_name||""}</h3>
        {tgUser?.username && <p className="text-sm text-white/30">@{tgUser.username}</p>}
      </div>
      <div className="space-y-2">
        {[
          ["🆔 تیلیگرام ID", tgUser?.id||"—"],
          ["🌍 وڵات", "IQ"],
          ["📅 ڕێکەوت", now.toLocaleDateString()],
          ["🕐 کات", now.toLocaleTimeString()],
        ].map(([k,v])=>(
          <div key={k} className="glass rounded-xl p-3 flex justify-between items-center">
            <span className="text-sm text-white/40">{k}</span>
            <span className="text-sm font-semibold">{v}</span>
          </div>
        ))}
      </div>
      <div className="glass-purple rounded-2xl p-4 text-center">
        <p className="text-2xl mb-1">🌟</p>
        <p className="text-sm font-bold text-purple-400">بیرخۆشی!</p>
        <p className="text-xs text-white/40 mt-1">سوپاس بە بەکارهێنانت لە Reaction Bot Maker</p>
      </div>
    </div>
  );
}
