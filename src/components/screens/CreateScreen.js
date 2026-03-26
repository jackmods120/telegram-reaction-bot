"use client";
import { useState } from "react";
import { Bot, Plus, Play, AlertCircle, CheckCircle, MessageCircle } from "lucide-react";

export default function CreateScreen({ tgUser }) {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [helpTab, setHelpTab] = useState("help");

  async function handleCreate() {
    if (!token.trim()) return;
    setLoading(true); setResult(null);
    try {
      const res = await fetch("/api/bots/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: token.trim(), telegramId: String(tgUser?.id || "0") }),
      });
      const data = await res.json();
      setResult(data);
      if (data.success) setToken("");
    } catch { setResult({ success: false, error: "هەڵەیەک روویدا" }); }
    setLoading(false);
  }

  return (
    <div className="p-4 space-y-4">
      {/* Hero banner */}
      <div className="relative rounded-2xl overflow-hidden glass p-5 text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/10" />
        <div className="relative">
          <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center animate-float shadow-lg shadow-blue-500/40">
            <Bot size={32} className="text-white" />
          </div>
          <h2 className="text-xl font-bold mb-1">بۆتی ریاکشنت دروست بکە</h2>
          <p className="text-sm text-white/40">بەبێ کۆد نووسین — لە چرکەیەکدا</p>
        </div>
      </div>

      {/* Token input card */}
      <div className="glass rounded-2xl p-4 space-y-3">
        <label className="text-sm font-semibold text-white/70">Token ی بۆتەکەت</label>
        <input
          value={token}
          onChange={e => setToken(e.target.value)}
          placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/15 focus:outline-none focus:border-blue-500/60 font-mono transition-colors"
        />

        {result && (
          <div className={`flex items-center gap-2 p-3 rounded-xl text-sm ${result.success ? "glass-green text-green-400" : "glass-red text-red-400"}`}>
            {result.success ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            <span>{result.success ? `✅ بۆتت دروستکرا! — @${result.bot?.username}` : (result.error || "هەڵەیەک روویدا")}</span>
          </div>
        )}

        <button onClick={handleCreate} disabled={loading || !token.trim()}
          className="w-full py-4 rounded-xl font-bold text-base bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 transition-all">
          {loading
            ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>چاوەڕوان بە...</span></>
            : <><Plus size={20} /><span>بۆت دروست بکە</span></>}
        </button>
      </div>

      {/* Help / Support tabs */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="flex border-b border-white/5">
          {[["help","یارمەتی"],["support","پشتگیری"]].map(([id,label]) => (
            <button key={id} onClick={() => setHelpTab(id)}
              className={`flex-1 py-3 text-sm font-semibold transition-colors ${helpTab===id ? "text-blue-400 border-b-2 border-blue-500" : "text-white/30"}`}>
              {label}
            </button>
          ))}
        </div>
        <div className="p-4">
          {helpTab === "help" ? (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-white/70 mb-3">چۆن بۆتت دروست بکەیت؟</p>
              {[
                "بچۆ بۆ @BotFather لە تیلیگرام",
                "بنووسە /newbot",
                "ناوی بۆتەکە بدە",
                "یوزەرنەیمی بۆتەکە بدە (دەبێت bot کۆتابیبێت)",
                "Token ەکە کۆپی بکە و لێرە بخەرە",
              ].map((s, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold flex items-center justify-center shrink-0">{i+1}</span>
                  <p className="text-sm text-white/50 pt-0.5">{s}</p>
                </div>
              ))}
              <div className="flex gap-2 pt-2">
                <button className="flex-1 glass py-2.5 rounded-xl text-xs text-blue-400 font-semibold">ڕێنماییی تەواو</button>
                <button className="flex-1 glass py-2.5 rounded-xl text-xs text-purple-400 font-semibold">مەرج و مەرامنامە</button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-white/50">بۆ پشتگیری پەیوەندی بکە:</p>
              <a href="https://t.me/support" className="flex items-center gap-3 glass-blue rounded-xl p-3">
                <MessageCircle size={18} className="text-blue-400" />
                <span className="text-sm text-blue-400 font-semibold">@support</span>
              </a>
              <div className="aspect-video bg-black/40 rounded-xl border border-white/8 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center mx-auto mb-2 cursor-pointer hover:bg-red-500 transition-colors">
                    <Play size={20} className="text-white ml-1" />
                  </div>
                  <p className="text-xs text-white/40">ڤیدیۆی ڕێنمایی</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
