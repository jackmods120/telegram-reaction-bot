import { adminDB } from "@/lib/firebaseAdmin";
import { callTelegram, sendMessage } from "@/lib/telegram";

// In-memory reaction store per process (resets on cold start — use Firestore for persistence)
const reactionStore = {}; // { "botId_msgId": { emoji: Set(userId) } }

function getKey(botId, msgId) { return `${botId}_${msgId}`; }

function toggleReaction(botId, msgId, emoji, userId) {
  const key = getKey(botId, msgId);
  if (!reactionStore[key]) reactionStore[key] = {};
  if (!reactionStore[key][emoji]) reactionStore[key][emoji] = new Set();
  const s = reactionStore[key][emoji];
  if (s.has(userId)) { s.delete(userId); return false; }
  s.add(userId); return true;
}

function buildKeyboard(botId, msgId, reactions) {
  const rows = [];
  const key = getKey(botId, msgId);
  const store = reactionStore[key] || {};
  for (let i = 0; i < reactions.length; i += 4) {
    rows.push(
      reactions.slice(i, i + 4).map(emoji => ({
        text: `${emoji}${store[emoji]?.size ? " " + store[emoji].size : ""}`,
        callback_data: `r:${msgId}:${emoji}`,
      }))
    );
  }
  return { inline_keyboard: rows };
}

export async function POST(req, { params }) {
  const token = params.token;
  const update = await req.json();

  // Load bot from Firestore
  const snap = await adminDB.collection("bots").where("token", "==", token).limit(1).get();
  if (snap.empty) return Response.json({ ok: false });
  const botDoc = snap.docs[0];
  const bot = botDoc.data();

  // ── /start command ────────────────────────────────────────────
  if (update.message?.text === "/start") {
    const user = update.message.from;
    const name = user.first_name || "کاربەر";
    const welcome = (bot.welcomeMessage || "سڵاو {user_first_name}! 👋").replace("{user_first_name}", name);

    await sendMessage(token, update.message.chat.id, welcome, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[
          { text: "📢 زیادکردن بۆ کانال", url: `https://t.me/${bot.username}?startchannel=true` },
          { text: "👥 زیادکردن بۆ گروپ",  url: `https://t.me/${bot.username}?startgroup=true` },
        ]],
      },
    });

    // Track user
    await adminDB.collection("botUsers").doc(`${bot.botId}_${user.id}`).set({
      botId: bot.botId, userId: String(user.id),
      firstName: user.first_name || "", username: user.username || "",
      language: user.language_code || "ku",
      joinedAt: new Date().toISOString(), lastSeen: new Date().toISOString(),
    }, { merge: true });

    await botDoc.ref.update({ members: (bot.members || 0) + 1 });
    return Response.json({ ok: true });
  }

  // ── /post command (owner only) ────────────────────────────────
  if (update.message?.text?.startsWith("/post") && String(update.message.from.id) === bot.ownerId) {
    const content = update.message.text.replace(/^\/post[\s\n]?/, "").trim();
    if (!content) {
      await sendMessage(token, update.message.chat.id, "⚠️ دەقی پۆستەکەت بنووسە.\nنموونە: /post سڵاو دنیا!");
      return Response.json({ ok: true });
    }

    // Detect if it's a channel post
    const target = bot.channelId || update.message.chat.id;
    const reactions = bot.channelReactions?.length ? bot.channelReactions : ["👍","❤️","🔥"];

    const sent = await callTelegram(token, "sendMessage", {
      chat_id: target, text: content, parse_mode: "HTML",
      reply_markup: buildKeyboard(bot.botId, "tmp", reactions),
    });

    if (sent.ok) {
      const msgId = sent.result.message_id;
      await callTelegram(token, "editMessageReplyMarkup", {
        chat_id: target, message_id: msgId,
        reply_markup: buildKeyboard(bot.botId, msgId, reactions),
      });
      await sendMessage(token, update.message.chat.id, "✅ پۆستەکە نێردرا!");
    } else {
      await sendMessage(token, update.message.chat.id, `❌ هەڵە: ${sent.description}`);
    }
    return Response.json({ ok: true });
  }

  // ── Callback query (reaction button press) ────────────────────
  if (update.callback_query) {
    const cq = update.callback_query;
    const data = cq.data;

    if (data?.startsWith("r:")) {
      const parts = data.split(":");
      const msgId = parts[1];
      const emoji = parts.slice(2).join(":");
      const userId = cq.from.id;

      // Determine reactions list
      const chatType = cq.message.chat.type;
      const reactions = chatType === "channel" ? bot.channelReactions : bot.groupReactions;

      const added = toggleReaction(bot.botId, msgId, emoji, userId);

      await callTelegram(token, "editMessageReplyMarkup", {
        chat_id: cq.message.chat.id,
        message_id: cq.message.message_id,
        reply_markup: buildKeyboard(bot.botId, msgId, reactions),
      });

      await callTelegram(token, "answerCallbackQuery", {
        callback_query_id: cq.id,
        text: added ? `${emoji} زیادکرا!` : `${emoji} لابرا`,
      });

      // Update lastActive
      await botDoc.ref.update({ lastActive: new Date().toISOString() });
    }
    return Response.json({ ok: true });
  }

  return Response.json({ ok: true });
}
