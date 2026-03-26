# 🤖 Reaction Bot Maker

Telegram Mini App بۆ دروستکردنی بۆتی ریاکشن — بەبێ کۆد نووسین.

## 📁 پرۆژەکە

```
src/
├── app/
│   ├── api/
│   │   ├── bots/
│   │   │   ├── create/route.js     ← دروستکردنی بۆتی نوێ
│   │   │   ├── my/route.js         ← بۆتەکانی بەکارهێنەر
│   │   │   ├── stats/route.js      ← ئامارەکانی گشتی
│   │   │   └── [id]/route.js       ← بەڕێوەبردنی بۆت
│   │   └── webhook/
│   │       └── [token]/route.js    ← webhook سەرەکی
│   ├── layout.js
│   ├── page.js
│   └── globals.css
├── components/
│   ├── MiniApp.js
│   ├── layout/
│   │   ├── Header.js
│   │   └── BottomNav.js
│   └── screens/
│       ├── CreateScreen.js
│       ├── AllBotsScreen.js
│       ├── MyBotsScreen.js
│       ├── ManageBot.js
│       ├── EmojiPicker.js
│       └── UpdatesScreen.js
└── lib/
    ├── firebase.js       ← Firebase Client
    ├── firebaseAdmin.js  ← Firebase Admin (API)
    └── telegram.js       ← Telegram API helpers
```

---

## 🚀 هەنگاوەکانی Deploy

### ١. Firebase دروست بکە

1. بچۆ [console.firebase.google.com](https://console.firebase.google.com)
2. پرۆژەی نوێ دروست بکە
3. **Firestore Database** کردەرەوە (لە Production mode)
4. بچۆ **Project Settings → Service accounts → Generate new private key**
5. JSON فایلەکەت دابەزێنە — بەهاکانی دەخەیتە `.env`

### ٢. Environment Variables

لە Vercel، ئەمانە زیاد بکە:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."

NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

> ⚠️ `FIREBASE_PRIVATE_KEY` دەبێت لای گێڕان (`"..."`) بێت

### ٣. GitHub → Vercel

فایلەکان Push بکە بۆ هەمان Repo ی پێشووەت، Vercel خۆکارانە دووبارە Deploy دەکات.

### ٤. Telegram Mini App تۆمار بکە

1. بچۆ `@BotFather`
2. بنووسە `/newapp`
3. بۆتی سەرەکیت هەڵبژێرە
4. URL دابنێ: `https://your-app.vercel.app`

---

## 💬 چۆن کار دەکات

| کام | چی دەکات |
|-----|----------|
| Create Tab | Token ی بۆتت بخە، سیستەم webhook دادەنێت |
| All Bots | داشبۆردی گشتی + لیدەربۆرد |
| My Bots | بۆتەکانت بەڕێوەببە |
| Manage | وەستاندن/کردنەوە، ریاکشن دیاریکردن، سڕینەوە |

---

## Firestore Collections

| Collection | وەسف |
|------------|-------|
| `bots` | هەموو بۆتەکان |
| `users` | بەکارهێنەرانی سیستەم |
| `botUsers` | بەکارهێنەرانی هەر بۆتێک |
