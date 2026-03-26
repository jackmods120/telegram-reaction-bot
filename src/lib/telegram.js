export async function callTelegram(token, method, body = {}) {
  const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

export const getBotInfo    = (token)       => callTelegram(token, "getMe");
export const setWebhook    = (token, url)  => callTelegram(token, "setWebhook", { url, allowed_updates: ["message","callback_query","message_reaction"] });
export const deleteWebhook = (token)       => callTelegram(token, "deleteWebhook");
export const sendMessage   = (token, chatId, text, extra = {}) => callTelegram(token, "sendMessage", { chat_id: chatId, text, ...extra });
export const answerCB      = (token, id, text = "") => callTelegram(token, "answerCallbackQuery", { callback_query_id: id, text });

export const ALL_EMOJIS = [
  "👍","👎","❤️","🔥","🥰","👏","😁","🤔","🤯","😱",
  "🤬","😢","🎉","🤩","🤮","💩","🙏","👌","🕊️","🤡",
  "🥱","🥴","😍","🐳","❤️‍🔥","🌚","🌭","💯","🤣","⚡",
  "🍌","🏆","💔","🤨","😐","🍓","🍾","💋","😈","😴",
  "😭","🤓","👻","👀","🎃","🙈","😇","😨","🤝","✍️",
  "🤗","🫡","🎅","🎄","☃️","💅","🤪","🗿","🆒","💘",
  "😎","👾","😡","🦄","😘","💊","🥳","🤩","🫶","🌟",
];
