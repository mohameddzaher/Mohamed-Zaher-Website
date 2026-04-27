"use client";

import { useEffect } from "react";

export function ConsoleSignature() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if ((window as Window & { __mz_logged?: boolean }).__mz_logged) return;
    (window as Window & { __mz_logged?: boolean }).__mz_logged = true;

    const big = "color:#22d3ee;font-size:48px;font-weight:800;text-shadow:0 0 20px #22d3ee;line-height:1.1";
    const sub = "color:#a78bfa;font-size:14px;font-weight:600";
    const mono = "color:#7a7a95;font-family:monospace;font-size:11px";

    console.log("%cMohamed Zaher", big);
    console.log("%cSoftware Engineer · Entrepreneur · CTO", sub);
    console.log("%c→ Curious about how this site is built? Let's talk: mohamedzaher.dev@gmail.com", mono);
    console.log("%c→ Try Cmd/Ctrl + K to open the command palette.", mono);
  }, []);
  return null;
}
