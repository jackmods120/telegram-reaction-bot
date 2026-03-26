"use client";

const UPDATES = [
  { v:"v2.0.0", date:"٢٦/٣/٢٠٢٦", badge:"نوێ", color:"blue", changes:["✅ Admin Panel زیادکرا","🎉 ریاکشنی گروپ زیادکرا","⚡ خێرایی زیاتر","🐛 هەڵەکانی ڕووی بوو چاکسران"] },
  { v:"v1.5.0", date:"١٥/٣/٢٠٢٦", badge:"",    color:"purple", changes:["🔥 لیدەربۆرد زیادکرا","📊 داشبۆردی گشتی","👥 پرۆفایلی بەکارهێنەر"] },
  { v:"v1.0.0", date:"١/٣/٢٠٢٦",  badge:"",    color:"green",  changes:["🚀 دەستپێکردنی پرۆژەکە","🤖 دروستکردنی بۆت","❤️ ریاکشنی کانال"] },
];

const COLOR = {
  blue:   "glass-blue text-blue-400 bg-blue-500/20",
  purple: "glass-purple text-purple-400 bg-purple-500/20",
  green:  "glass-green text-green-400 bg-green-500/20",
};

export default function UpdatesScreen() {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">🔔 نوێکاریەکان</h2>
        <span className="text-xs text-white/30">دیرۆکی گۆڕانکاری</span>
      </div>

      {/* Banner */}
      <div className="glass-blue rounded-2xl p-4 flex items-center gap-3">
        <span className="text-3xl animate-float inline-block">🚀</span>
        <div>
          <p className="text-sm font-bold text-blue-400">دوایین نوێکاری: v2.0.0</p>
          <p className="text-xs text-white/40 mt-0.5">Admin Panel و ریاکشنی گروپ زیادکرا!</p>
        </div>
      </div>

      {/* Changelog */}
      <div className="space-y-3">
        {UPDATES.map(u => (
          <div key={u.v} className={`${COLOR[u.color].split(" ").slice(0,1).join("")} rounded-2xl p-4 space-y-3`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`text-base font-bold ${COLOR[u.color].split(" ")[1]}`}>{u.v}</span>
                {u.badge && (
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${COLOR[u.color].split(" ")[2]} ${COLOR[u.color].split(" ")[1]}`}>
                    {u.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-white/25">{u.date}</span>
            </div>
            <div className="space-y-1.5">
              {u.changes.map(c => (
                <p key={c} className="text-xs text-white/60 flex items-start gap-2">
                  <span className="mt-0.5">•</span><span>{c}</span>
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Social links */}
      <div className="glass rounded-2xl p-4 space-y-2">
        <p className="text-sm font-semibold text-white/60">🔗 لینکەکان</p>
        {[["📢 کانالی فەرمی","t.me/rbmofficial"],["💬 گروپی پشتگیری","t.me/rbmsupport"],["👨‍💻 دروستکەر","t.me/developer"]].map(([label,url])=>(
          <a key={url} href={`https://${url}`} className="flex items-center justify-between glass rounded-xl p-3">
            <span className="text-sm text-white/70">{label}</span>
            <span className="text-xs text-blue-400">@{url.split("/")[1]}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
