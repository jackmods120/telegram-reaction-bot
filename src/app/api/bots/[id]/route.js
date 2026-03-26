import { adminDB } from "@/lib/firebaseAdmin";
import { setWebhook, deleteWebhook } from "@/lib/telegram";

export async function GET(req, { params }) {
  const doc = await adminDB.collection("bots").doc(params.id).get();
  if (!doc.exists) return Response.json({ error: "بۆت نەدۆزرایەوە" }, { status: 404 });
  const data = doc.data();
  // Return token only to owner (caller must pass telegramId header)
  const callerId = req.headers.get("x-telegram-id");
  return Response.json({ ...data, token: callerId === data.ownerId ? data.token : undefined });
}

export async function PATCH(req, { params }) {
  const body = await req.json();
  const { telegramId, action, ...fields } = body;

  const docRef = adminDB.collection("bots").doc(params.id);
  const doc = await docRef.get();
  if (!doc.exists) return Response.json({ error: "بۆت نەدۆزرایەوە" }, { status: 404 });

  const bot = doc.data();
  if (bot.ownerId !== String(telegramId))
    return Response.json({ error: "مۆڵەتت نییە" }, { status: 403 });

  // Handle actions
  if (action === "stop") {
    await deleteWebhook(bot.token);
    await docRef.update({ status: "stopped", lastActive: new Date().toISOString() });
    return Response.json({ success: true, status: "stopped" });
  }

  if (action === "start") {
    const url = `${process.env.NEXT_PUBLIC_APP_URL}/api/webhook/${bot.token}`;
    await setWebhook(bot.token, url);
    await docRef.update({ status: "working", lastActive: new Date().toISOString() });
    return Response.json({ success: true, status: "working" });
  }

  if (action === "delete") {
    await deleteWebhook(bot.token);
    await docRef.delete();
    return Response.json({ success: true });
  }

  // Generic field update (reactions, settings, etc.)
  const allowed = ["channelReactions","groupReactions","welcomeMessage","welcomePhoto","forceJoin","forceJoinChannel","supportButton"];
  const update = {};
  for (const key of allowed) {
    if (key in fields) update[key] = fields[key];
  }
  if (Object.keys(update).length) {
    await docRef.update({ ...update, lastActive: new Date().toISOString() });
  }
  return Response.json({ success: true });
}
