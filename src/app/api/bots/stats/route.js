import { adminDB } from "@/lib/firebaseAdmin";

export async function GET() {
  try {
    const snap = await adminDB.collection("bots").get();
    const bots = snap.docs.map(d => d.data());
    return Response.json({
      total:   bots.length,
      working: bots.filter(b => b.status === "working").length,
      stopped: bots.filter(b => b.status === "stopped").length,
    });
  } catch {
    return Response.json({ total: 0, working: 0, stopped: 0 });
  }
}
