"use client";
import { ThemeProvider } from "next-themes";
import { MotionConfig } from "motion/react";
import { useEffect } from "react";
import { useShop } from "@/lib/store";
export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    void useShop.persist.rehydrate();
  }, []);
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </ThemeProvider>
  );
}
