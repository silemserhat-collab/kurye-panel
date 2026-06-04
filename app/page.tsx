"use client";
import { useState, useEffect } from "react";
import AppLayout from "./components/AppLayout";
import Login from "./components/Login";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("kurye_user");
    if (saved) setUser(JSON.parse(saved));
    setChecked(true);
  }, []);

  if (!checked) return null;
  if (!user) return <Login onLogin={setUser} />;
  return <AppLayout />;
}