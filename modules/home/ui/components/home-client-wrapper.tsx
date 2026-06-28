"use client";

// import { useState } from "react";
// import PlanetBackground from "@/components/3js-background";
import { ThemeToggle } from "@/components/theme-toggle";

export default function HomeClientWrapper({ children }: { children: React.ReactNode }) {
  // const [bgLoaded, setBgLoaded] = useState(false);

  return (
    <>
      {/* <PlanetBackground onLoaded={() => setBgLoaded(true)} /> */}
      
      <div>
        {/* {bgLoaded && <ThemeToggle />} */}
        {children}
      </div>
    </>
  );
}
