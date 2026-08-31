"use client";

import { useState, useEffect } from "react";
import { X, Download } from "lucide-react";
import { Button } from "./ui/Button";

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Only show once per session or use localStorage for longer dismissal
    if (localStorage.getItem("pwa-prompt-dismissed")) {
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("pwa-prompt-dismissed", "true");
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-8 md:bottom-8 z-50 bg-white border border-border shadow-xl rounded-2xl p-4 flex flex-col space-y-3 animate-in slide-in-from-bottom-5">
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-foreground">Install PressWork</h3>
        <button onClick={handleDismiss} className="text-muted hover:text-foreground">
          <X className="w-5 h-5" />
        </button>
      </div>
      <p className="text-sm text-muted">Install for quicker access and a better app experience.</p>
      <div className="flex space-x-3 pt-1">
        <Button variant="outline" size="sm" className="flex-1" onClick={handleDismiss}>
          Not now
        </Button>
        <Button size="sm" className="flex-1" onClick={handleInstall}>
          <Download className="w-4 h-4 mr-2" />
          Install
        </Button>
      </div>
    </div>
  );
}
