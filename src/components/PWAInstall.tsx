"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export default function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .catch(() => {});
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShow(true);
    };

    window.addEventListener("beforeinstallprompt", handler as EventListener);
    return () => window.removeEventListener("beforeinstallprompt", handler as EventListener);
  }, []);

  const install = async () => {
    if (!deferredPrompt) return;
    setShow(false);
    await deferredPrompt.prompt();
    try {
      await deferredPrompt.userChoice;
    } finally {
      setDeferredPrompt(null);
    }
  };

  const isiOS = typeof navigator !== "undefined" && /iphone|ipad|ipod/i.test(navigator.userAgent);
  const inStandalone =
    typeof window !== "undefined" &&
    (() => {
      const nav = window.navigator as unknown as Navigator & { standalone?: boolean };
      return Boolean(nav.standalone);
    })();

  if (!show && !(isiOS && !inStandalone)) return null;

  return (
    <div className="fixed inset-x-0 bottom-4 z-50 flex items-center justify-center px-4 sm:px-0">
      <div className="max-w-md w-full bg-card border border-border rounded-2xl shadow-xl p-4 flex items-center gap-3">
        <div className="flex-1">
          <p className="text-sm font-bold text-foreground">
            {isiOS && !inStandalone
              ? "Add to Home Screen: tap Share, then 'Add to Home Screen'"
              : "Install BizLaunch for a faster, app-like experience"}
          </p>
        </div>
        {!isiOS && (
          <button
            onClick={install}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Download size={16} /> Install
          </button>
        )}
      </div>
    </div>
  );
}
