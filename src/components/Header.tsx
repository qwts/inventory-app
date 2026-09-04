"use client";
import { useEffect, useState } from "react";
import ExpandingButton from "./ExpandingButton";

export default function Header() {
  // 1 = Light Mode, 0 = Dark Mode
  const [mode, setMode] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? 0
        : 1
  );

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
    setMode((prevMode) => (prevMode === 0 ? 1 : 0));
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
