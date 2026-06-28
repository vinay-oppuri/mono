"use client";

import { useEffect, useState } from "react";

export default function Preloader() {
  const [loadingState, setLoadingState] = useState<"loading" | "fading" | "done">("loading");

  useEffect(() => {
    // Start fading out after 2 seconds
    const fadeTimer = setTimeout(() => {
      setLoadingState("fading");
    }, 2000);

    // Completely unmount after 3 seconds (1s for the fade animation)
    const doneTimer = setTimeout(() => {
      setLoadingState("done");
    }, 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  if (loadingState === "done") return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black transition-opacity duration-1000 ease-in-out ${
        loadingState === "fading" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <h1 className="text-4xl sm:text-5xl font-extralight tracking-[0.4em] text-white mb-8 uppercase ml-2">
        The Mono
      </h1>
      <div className="w-12 h-px bg-white/20 mb-8"></div>
      <p className="text-[10px] sm:text-xs text-white/50 tracking-[0.3em] font-light uppercase">
        Initializing
      </p>
    </div>
  );
}
