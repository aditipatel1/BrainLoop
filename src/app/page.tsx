"use client";
import React from "react";
import GameScreen from "@/components/GameScreen";
import { AppProvider } from "./context/AppContext";
import PageManager from "./components/PageManager";
import Background3D from "./components/Background3D";

export default function Home() {
  return (
    <main className="app-container">
      <Background3D />
      <AppProvider>
        <PageManager />
      </AppProvider>
    </main>
  );
}