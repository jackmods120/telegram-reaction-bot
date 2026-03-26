const TOKEN = process.env.BOT_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID; // e.g. @mychannel or -100xxxxxxxxx
const API = `https://api.telegram.org/bot${TOKEN}`;

// Reaction buttons shown under each post
const REACTIONS = [
  { emoji: "❤️", label: "خۆشم دەوێت" },
  { emoji: "🔥", label: "ئاگر" },
  { emoji: "👏", label: "چەپڵە" },
  { emoji: "😮", label: "سەرسام" },
  { emoji: "😂", label: "پێکەنین" },
  { emoji: "💯", label: "١٠٠" },
];

async function sendTelegramRequest(method, body) {
  const res = await fetch(`${API}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

function buildReactionKeyboard(postId, counts = {}) {
  const buttons = REACTIONS.map((r) => {
    const count = counts[r.emoji] || 0;
    return {
      text: `${r.emoji} ${count > 0 ? count : ""}`.trim(),
      callback_data: `react:${postId}:${r.emoji}`,
    };
  });

  // 3 buttons per row
  const rows = [];
  for (let i = 0; i < buttons.length; i += 3) {
    rows.push(buttons.slice(i, i + 3));
  }
  return { inline_keyboard: rows };
}

// In-memory store for reactions (resets on cold start)
// For persistence use a DB like Upstash Redis
const reactionStore = {}; // { postId: { emoji: Set(userId) } }

function getReactionCounts(postId) {
  const counts = {};
  const store = reactionStore[postId] || {};
  for (const [emoji, users] of Object.entries(store)) {
    counts[emoji] = users.size;
  }
  return counts;
}

function toggleReaction(postId, emoji, userId) {
  if (!reactionStore[postId]) reactionStore[postId] = {};
  if (!reactionStore[postId][emoji]) reactionStore[postId][emoji] = new Set();

  const users = reactionStore[postId][emoji];
  if (users.has(userId)) {
    users.delete(userId);
    return false; // removed
  } else {
    users.add(userId);
    return true; // added
  }
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).send("✅ بۆتەکە کار دەکات!");
  }

  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const update = req.body;

  // ── Handle /post command from admin ──────────────────────────────────────
  if (update.message) {
    const msg = update.message;
    const chatId = msg.chat.id;
    const text = msg.text || "";
    const userId = msg.from.id;

    // Only allow the admin to post
    const adminId = parseInt(process.env.ADMIN_ID || "0");
    if (adminId && userId !== adminId) {
      await sendTelegramRequest("sendMessage", {
        chat_id: chatId,
        text: "⛔ تەنها ئادمین دەتوانێت بە بۆتەکە پۆست بنێرێت.",
      });
      return res.status(200).send("ok");
    }

    if (text === "/start") {
      await sendTelegramRequest("sendMessage", {
        chat_id: chatId,
        text:
          "👋 سڵاو!\n\n" +
          "بۆ ناردنی پۆست بۆ کانالەکە، پەیامێک بنووسە یان وێنەیەک بنێرە.\n\n" +
          "کامندەکان:\n" +
          "/post [دەق] — پۆست بنێرە بۆ کانالەکە\n" +
          "/help — یارمەتی",
      });
      return res.status(200).send("ok");
    }

    if (text === "/help") {
      await sendTelegramRequest("sendMessage", {
        chat_id: chatId,
        text:
          "📖 چۆنیەتی بەکارهێنان:\n\n" +
          "١. `/post دەقی پۆستەکەت` بنووسە\n" +
          "٢. پۆستەکە دەچێت بۆ کانالەکە\n" +
          "٣. بەکارهێنەران دەتوانن ریاکشن بنێرن ✅",
      });
      return res.status(200).send("ok");
    }

    if (text.startsWith("/post ") || text.startsWith("/post\n")) {
      const content = text.replace(/^\/post[\s\n]?/, "").trim();
      if (!content) {
        await sendTelegramRequest("sendMessage", {
          chat_id: chatId,
          text: "⚠️ دەقی پۆستەکەت بنووسە.\nنموونە: /post سڵاو دنیا!",
        });
        return res.status(200).send("ok");
      }

      const sent = await sendTelegramRequest("sendMessage", {
        chat_id: CHANNEL_ID,
        text: content,
        parse_mode: "HTML",
        reply_markup: buildReactionKeyboard(`new_${Date.now()}`, {}),
      });

      if (sent.ok) {
        const postId = sent.result.message_id;
        // Update with correct postId in keyboard
        await sendTelegramRequest("editMessageReplyMarkup", {
          chat_id: CHANNEL_ID,
          message_id: postId,
          reply_markup: buildReactionKeyboard(postId, {}),
        });

        await sendTelegramRequest("sendMessage", {
          chat_id: chatId,
          text: "✅ پۆستەکە نێردرا بۆ کانالەکە!",
        });
      } else {
        await sendTelegramRequest("sendMessage", {
          chat_id: chatId,
          text: `❌ هەڵە روویدا: ${sent.description}\n\nدڵنیابەرەوە کە بۆتەکە ئادمینی کانالەکەیە.`,
        });
      }

      return res.status(200).send("ok");
    }

    // Forward any photo with caption as a post
    if (msg.photo && msg.caption) {
      const photoId = msg.photo[msg.photo.length - 1].file_id;
      const sent = await sendTelegramRequest("sendPhoto", {
        chat_id: CHANNEL_ID,
        photo: photoId,
        caption: msg.caption,
        parse_mode: "HTML",
        reply_markup: buildReactionKeyboard(`photo_${Date.now()}`, {}),
      });

      if (sent.ok) {
        const postId = sent.result.message_id;
        await sendTelegramRequest("editMessageReplyMarkup", {
          chat_id: CHANNEL_ID,
          message_id: postId,
          reply_markup: buildReactionKeyboard(postId, {}),
        });
        await sendTelegramRequest("sendMessage", {
          chat_id: chatId,
          text: "✅ وێنەکە نێردرا بۆ کانالەکە!",
        });
      }

      return res.status(200).send("ok");
    }

    // Unknown command
    await sendTelegramRequest("sendMessage", {
      chat_id: chatId,
      text: "❓ کامندی نەناسراو. /help بنووسە بۆ یارمەتی.",
    });
    return res.status(200).send("ok");
  }

  // ── Handle reaction button presses ───────────────────────────────────────
  if (update.callback_query) {
    const cq = update.callback_query;
    const userId = cq.from.id;
    const data = cq.data; // "react:postId:emoji"

    if (data.startsWith("react:")) {
      const parts = data.split(":");
      const postId = parts[1];
      const emoji = parts.slice(2).join(":"); // emoji may contain colons

      const added = toggleReaction(postId, emoji, userId);
      const counts = getReactionCounts(postId);

      // Update the keyboard with new counts
      await sendTelegramRequest("editMessageReplyMarkup", {
        chat_id: cq.message.chat.id,
        message_id: cq.message.message_id,
        reply_markup: buildReactionKeyboard(postId, counts),
      });

      // Answer callback to remove loading spinner
      await sendTelegramRequest("answerCallbackQuery", {
        callback_query_id: cq.id,
        text: added ? `${emoji} زیادکرا!` : `${emoji} لابرا`,
        show_alert: false,
      });
    }

    return res.status(200).send("ok");
  }

  return res.status(200).send("ok");
}
