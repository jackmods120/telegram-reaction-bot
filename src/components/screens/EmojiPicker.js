"use client";
import { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { ALL_EMOJIS } from "@/lib/telegram";

export default function EmojiPicker({ bot, onBack, onSave }) {
  const [activeTab, setActiveTab] = useState("channel");
  const [channelSel, setChannelSel] = useState(new Set(bot.channelReactions||[]));
  const [groupSel, setGroupSel]   = useState(new Set(bot.groupReactions||[]));
  const [saving, setSaving] = useState(false);

  const sel     = activeTab==="channel" ? channelSel : groupSel;
  const setSel  = activeTab==="channel" ? setChannelSel : setGroupSel;

  function toggle(emoji) {
    setSel(prev => {
      const next = new Set(prev);
      next.has(emoji) ? next.delete(emoji) : next.add(emoji);
      return next;
    });
  }

  function toggleAll() {
    if (sel.size === ALL_EMOJIS.length) setSel(new Set());
    else setSel(new Set(ALL_EMOJIS));
  }

  async function handleSave() {
    setSaving(true);
    await onSave([...channelSel], [...groupSel]);
    setSaving(false);
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 glass border-b border-white/5 flex items-center gap-3">
        <button onClick={onBack} className="glass rounded-xl p-2"><ArrowLeft size={18}/></button>
        <h2 className="text-base font-bold flex-1">هەڵبژاردنی ریاکشن</h2>
        <button onClick={toggleAll} className="glass rounded-xl px-3 py-2 text-xs text-blue-400 font-semibold">
          {sel.size===ALL_EMOJIS.length ? "هیچ" : "هەموو"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5">
        {[["channel","📢 کانال"],["group","👥 گروپ"]].map(([id,label])=>(
          <button key={id} onClick={()=>setActiveTab(id)}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${activeTab===id?"text-blue-400 border-b-2 border-blue-500":"text-white/30"}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Count */}
      <div className="px-4 pt-3 pb-1">
        <p className="text-xs text-white/30">{sel.size} ریاکشن هەڵبژێردراوە</p>
      </div>

      {/* Emoji grid */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
        <div className="grid grid-cols-7 gap-2">
          {ALL_EMOJIS.map(emoji => (
            <button key={emoji} onClick={() => toggle(emoji)}
              className={`aspect-square rounded-xl text-xl flex items-center justify-center transition-all ${
                sel.has(emoji)
                  ? "bg-blue-600/30 border-2 border-blue-500 scale-110"
                  : "glass hover:bg-white/10 border-2 border-transparent"
              }`}>
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Save button */}
      <div className="p-4 pb-6">
        <button onClick={handleSave} disabled={saving}
          className="w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/30 disabled:opacity-50 transition-all">
          {saving
            ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : <><Save size={18}/><span>ریاکشنەکان پاشەکەوت بکە</span></>
          }
        </button>
      </div>
    </div>
  );
}
