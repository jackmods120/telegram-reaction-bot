import { adminDB } from "@/lib/firebaseAdmin";
import { getBotInfo, setWebhook } from "@/lib/telegram";

export async function POST(req) {
  try {
    const { token, telegramId } = await req.json();

    if (!token || !telegramId)
      return Response.json({ success: false, error: "token و telegramId پێویستن" }, { status: 400 });

    // Validate token with Telegram
    const info = await getBotInfo(token);
    if (!info.ok)
      return Response.json({ success: false, error: "Token هەڵەیە یان بێ کاریە" }, { status: 400 });

    const botData = info.result;

    // Check if bot already exists
    const existing = await adminDB.collection("bots").where("botId", "==", String(botData.id)).get();
    if (!existing.empty)
      return Response.json({ success: false, error: "ئەم بۆتە پێشتر تۆمارکراوە" }, { status: 400 });

    // Set webhook
    const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/webhook/${token}`;
    await setWebhook(token, webhookUrl);

    // Save to Firestore
    const docRef = adminDB.collection("bots").doc();
    await docRef.set({
      id:               docRef.id,
      token,
      botId:            String(botData.id),
      botName:          botData.first_name,
      username:         botData.username || "",
      ownerId:          String(telegramId),
      status:           "working",
      webhookSet:       true,
      channelReactions: ["👍","❤️","🔥","👏","😁","🎉"],
      groupReactions:   ["👍","❤️","🔥","👏","😁","🎉"],
      welcomeMessage:   "سڵاو {user_first_name}! بەخێربێیت 👋",
      members:          0,
      dailyUsers:       0,
      likes:            0,
      dislikes:         0,
      createdAt:        new Date().toISOString(),
      lastActive:       new Date().toISOString(),
    });

    // Upsert owner in users collection
    await adminDB.collection("users").doc(String(telegramId)).set(
      { telegramId: String(telegramId), botCount: adminDB.FieldValue?.increment(1) ?? 1, lastSeen: new Date().toISOString() },
      { merge: true }
    );

    return Response.json({ success: true, bot: { id: docRef.id, botName: botData.first_name, username: botData.username } });
  } catch (err) {
    console.error("create bot error:", err);
    return Response.json({ success: false, error: "هەڵەی سێرڤەر" }, { status: 500 });
  }
}
