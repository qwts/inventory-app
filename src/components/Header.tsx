"use client";
import { useEffect, useState, useSyncExternalStore } from "react";
import ExpandingButton from "./ExpandingButton";

// The OS color scheme is an external store. useSyncExternalStore renders the
// stable server snapshot during SSR and hydration, then re-renders with the
// real client value after mount - so the toggle label never carries a
// suppressed hydration mismatch.
const subscribeToColorScheme = (callback: () => void) => {
  const mediaQueryList = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQueryList.addEventListener("change", callback);
  return () => mediaQueryList.removeEventListener("change", callback);
};
// 1 = Light Mode, 0 = Dark Mode
const getOsMode = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? 0 : 1;
const getServerMode = () => 1;

export default function Header() {
  const osMode = useSyncExternalStore(
    subscribeToColorScheme,
    getOsMode,
    getServerMode
  );
  // A manual toggle overrides the OS preference until the page reloads.
  const [override, setOverride] = useState<number | null>(null);
  const mode = override ?? osMode;

  function applyTheme(newMode: number) {
    document.documentElement.setAttribute(
      "data-theme",
      newMode ? "light" : "dark"
    );
  }

  useEffect(() => {
    applyTheme(mode);
  }, [mode]);

  function toggleDarkMode() {
    setOverride(mode === 0 ? 1 : 0);
  }

  return (
    <header>
      <div className="flex flex-wrap w-full px-5 justify-between">
        {" "}
        {/* aprent */}
        <div className="hidden md:block w-[118px]"></div>
        <div className="flex flex-grow mr-5 justify-center">
          <input
            type="text"
            className="w-full my-10 text-center"
            id="search"
            placeholder="Search Home Inventory..."
          />
        </div>
        <div className="flex l:w-[124px] justify-end xl:justify-start">
          <ExpandingButton
            isDark={mode === 0}
            onClick={toggleDarkMode}
            className="self-center"
          />
        </div>
      </div>
      <hr />
    </header>
  );
}
