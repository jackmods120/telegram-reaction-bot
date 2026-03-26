"use client";
import { useState } from "react";
import { ArrowLeft, Eye, EyeOff, Copy, Trash2, Settings, Smile, Check, Loader } from "lucide-react";
import EmojiPicker from "./EmojiPicker";

export default function ManageBot({ bot, tgUser, onBack, onUpdate }) {
  const [data, setData] = useState(bot);
  const [showToken, setShowToken] = useState(false);
  const [copied, setCopied] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [screen, setScreen] = useState("main"); // main | emoji | settings
  const [updateModal, setUpdateModal] = useState(false);
  const [updateStep, setUpdateStep] = useState(0); // 0 confirm | 1 loading | 2 done
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function doAction(action) {
    setActionLoading(true);
    const res = await fetch(`/api/bots/${data.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telegramId: String(tgUser?.id), action }),
    });
    const json = await res.json();
    if (json.success) {
      if (action === "delete") { onBack(); return; }
      const updated = { ...data, status: json.status ?? data.status };
      setData(updated);
      onUpdate?.(updated);
    }
    setActionLoading(false);
  }

  function copyToken() {
    navigator.clipboard.writeText(data.token || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const uptime = () => {
    const ms = Date.now() - new Date(data.createdAt).getTime();
    const d = Math.floor(ms/86400000), h = Math.floor((ms%86400000)/3600000), m = Math.floor((ms%3600000)/60000);
    return `${d}ڕۆژ ${h}کاتژمێر ${m}خولەک`;
  };

  if (screen === "emoji") return (
    <EmojiPicker bot={data} tgUser={tgUser} onBack={() => setScreen("main")}
      onSave={async (channelReactions, groupReactions) => {
        await fetch(`/api/bots/${data.id}`, {
          method:"PATCH", headers:{"Content-Type":"application/json"},
          body: JSON.stringify({ telegramId: String(tgUser?.id), channelReactions, groupReactions }),
        });
        setData(prev => ({ ...prev, channelReactions, groupReactions }));
        setScreen("main");
      }} />
  );

  return (
    <div className="p-4 space-y-4">
      {/* Back header */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="glass rounded-xl p-2"><ArrowLeft size={18} /></button>
        <div>
          <h2 className="text-base font-bold">{data.botName}</h2>
          <p className="text-xs text-white/30">@{data.username}</p>
        </div>
      </div>

      {/* Status card */}
      <div className={`rounded-2xl p-4 ${data.status==="working"?"glass-green":"glass-red"}`}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className={`text-base font-bold ${data.status==="working"?"text-green-400":"text-red-400"}`}>
              {data.status==="working" ? "✅ بۆتەکە ئێستا ئەنلاینە" : "❌ بۆتەکە ئۆفلاینە"}
            </p>
            <p className="text-xs text-white/40 mt-0.5">دوایین چالاکی: {new Date(data.lastActive||data.createdAt).toLocaleString()}</p>
          </div>
          <div className="text-right text-xs text-white/40">
            <p>Ping: <span className="text-green-400">{data.ping||"—"}ms</span></p>
            <p>Version: {data.version||"v2.0.0"}</p>
          </div>
        </div>

        {/* Start / Stop */}
        <button onClick={() => doAction(data.status==="working"?"stop":"start")}
          disabled={actionLoading}
          className={`w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all ${
            data.status==="working"
              ? "bg-red-600 hover:bg-red-500 shadow-lg shadow-red-500/30 text-white"
              : "bg-green-600 hover:bg-green-500 shadow-lg shadow-green-500/30 text-white"
          } disabled:opacity-50`}>
          {actionLoading
            ? <Loader size={20} className="animate-spin" />
            : data.status==="working" ? "⏹ بۆتەکە وەستێنە" : "▶️ بۆتەکە بکەرەوە"
          }
        </button>
      </div>

      {/* Info card */}
      <div className="glass rounded-2xl p-4 grid grid-cols-2 gap-3 text-sm">
        {[
          ["بۆت ID", data.botId],
          ["Uptime", uptime()],
          ["ئەندام", (data.members||0).toLocaleString()],
          ["بەکارهێنەر/ڕۆژ", (data.dailyUsers||0).toLocaleString()],
        ].map(([k,v])=>(
          <div key={k} className="bg-white/3 rounded-xl p-3">
            <p className="text-[10px] text-white/30 mb-1">{k}</p>
            <p className="text-xs font-semibold truncate">{v}</p>
          </div>
        ))}
      </div>

      {/* Update bot */}
      <button onClick={()=>{setUpdateModal(true);setUpdateStep(0);}}
        className="w-full glass rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🔄</span>
          <div className="text-left">
            <p className="text-sm font-semibold">نوێکردنەوەی بۆت</p>
            <p className="text-xs text-white/30">کۆتا نوێکاری: v2.0.0</p>
          </div>
        </div>
        <span className="text-xs text-blue-400 font-semibold">نوێبکەرەوە</span>
      </button>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => setScreen("emoji")}
          className="glass-purple rounded-2xl p-4 flex flex-col items-center gap-2 text-purple-400">
          <Smile size={24} />
          <span className="text-xs font-semibold">ریاکشن دیاریبکە</span>
        </button>
        <button onClick={() => setScreen("settings")}
          className="glass-blue rounded-2xl p-4 flex flex-col items-center gap-2 text-blue-400">
          <Settings size={24} />
          <span className="text-xs font-semibold">ڕێکخستنەکان</span>
        </button>
      </div>

      {/* Token */}
      <div className="glass rounded-2xl p-4 space-y-2">
        <p className="text-xs text-white/40 font-semibold">BOT TOKEN</p>
        <div className="flex items-center gap-2 bg-white/3 rounded-xl px-3 py-2">
          <code className="flex-1 text-xs text-white/60 truncate font-mono">
            {showToken ? (data.token||"—") : "•".repeat(36)}
          </code>
          <button onClick={() => setShowToken(!showToken)} className="text-white/30 hover:text-white/60 p-1">
            {showToken ? <EyeOff size={14}/> : <Eye size={14}/>}
          </button>
          <button onClick={copyToken} className={`p-1 transition-colors ${copied?"text-green-400":"text-white/30 hover:text-white/60"}`}>
            {copied ? <Check size={14}/> : <Copy size={14}/>}
          </button>
        </div>
      </div>

      {/* Danger zone */}
      <div className="space-y-2">
        <button onClick={() => setConfirmDelete(true)}
          className="w-full glass-red rounded-2xl py-4 text-red-400 font-semibold flex items-center justify-center gap-2">
          <Trash2 size={18}/><span>سڕینەوەی بۆت</span>
        </button>
      </div>

      {/* Update modal */}
      {updateModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={()=>{if(updateStep===0||updateStep===2)setUpdateModal(false);}}>
          <div className="glass rounded-3xl p-6 w-full max-w-sm space-y-4" onClick={e=>e.stopPropagation()}>
            {updateStep===0 && <>
              <h3 className="text-lg font-bold text-center">🔄 نوێکردنەوەی بۆت</h3>
              <div className="space-y-2 text-sm text-white/60">
                {["⚡ باشترکردنی کارایی","🎉 ریاکشنی نوێ زیادکرا","🐛 هەڵەکانی پێشوو چاکسرا","🚀 خێرایی زیاتر"].map(s=>(
                  <div key={s} className="flex items-center gap-2"><span className="text-green-400">✓</span><span>{s}</span></div>
                ))}
              </div>
              <button onClick={async()=>{
                setUpdateStep(1);
                await new Promise(r=>setTimeout(r,2500));
                setUpdateStep(2);
              }} className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 font-bold text-sm">
                پشتڕاستکردنەوە
              </button>
            </>}
            {updateStep===1 && (
              <div className="text-center py-6">
                <div className="text-5xl mb-4 animate-bounce">👨‍💻</div>
                <p className="text-sm text-white/60">نوێکردنەوە جێبەجێ دەکرێت...</p>
                <div className="mt-4 w-full bg-white/10 rounded-full h-1.5">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-1.5 rounded-full w-3/4 animate-pulse" />
                </div>
              </div>
            )}
            {updateStep===2 && (
              <div className="text-center py-6">
                <div className="text-5xl mb-3">✅</div>
                <p className="text-lg font-bold text-green-400">تەواو بوو!</p>
                <p className="text-sm text-white/40 mt-1">بۆتەکەت نوێکرایەوە</p>
                <button onClick={()=>setUpdateModal(false)} className="mt-4 w-full py-3 rounded-xl glass font-semibold text-sm">باشە</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="glass rounded-3xl p-6 w-full max-w-sm space-y-4">
            <div className="text-center">
              <span className="text-4xl">⚠️</span>
              <h3 className="text-lg font-bold mt-3">دڵنیایت؟</h3>
              <p className="text-sm text-white/40 mt-1">بۆتەکە بەتەواوی دەسڕێتەوە</p>
            </div>
            <div className="flex gap-3">
              <button onClick={()=>setConfirmDelete(false)} className="flex-1 glass rounded-xl py-3 text-sm font-semibold">نەخێر</button>
              <button onClick={()=>{setConfirmDelete(false);doAction("delete");}}
                className="flex-1 bg-red-600 hover:bg-red-500 rounded-xl py-3 text-sm font-bold transition-colors">
                بەڵێ، بیسڕەوە
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
