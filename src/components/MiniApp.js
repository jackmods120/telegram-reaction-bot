"use client";
import { useState, useEffect } from "react";
import Header from "./layout/Header";
import BottomNav from "./layout/BottomNav";
import CreateScreen from "./screens/CreateScreen";
import AllBotsScreen from "./screens/AllBotsScreen";
import MyBotsScreen from "./screens/MyBotsScreen";
import UpdatesScreen from "./screens/UpdatesScreen";

export default function MiniApp() {
  const [tab, setTab] = useState("create");
  const [tgUser, setTgUser] = useState(null);

  useEffect(() => {
    const tg = window?.Telegram?.WebApp;
    if (tg) { tg.ready(); tg.expand(); }
    const user = tg?.initDataUnsafe?.user || { id: 123456789, first_name: "کاربەر", username: "testuser" };
    setTgUser(user);
  }, []);

  const screens = {
    create:  <CreateScreen tgUser={tgUser} />,
    bots:    <AllBotsScreen />,
    mybots:  <MyBotsScreen tgUser={tgUser} />,
    updates: <UpdatesScreen />,
  };

  return (
    <div className="min-h-screen bg-[#08080F] flex flex-col">
      <Header tgUser={tgUser} />
      <main className="flex-1 overflow-y-auto pb-24 scrollbar-hide">{screens[tab]}</main>
      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}
