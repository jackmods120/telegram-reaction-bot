import { adminDB } from "@/lib/firebaseAdmin";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const telegramId = searchParams.get("telegramId");
  if (!telegramId) return Response.json({ bots: [] });

  const snap = await adminDB.collection("bots").where("ownerId", "==", telegramId).get();
  const bots = snap.docs.map(d => ({ id: d.id, ...d.data(), token: undefined })); // never expose token
  return Response.json({ bots });
}
