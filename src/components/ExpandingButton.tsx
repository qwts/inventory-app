"use client";
import { ButtonHTMLAttributes } from "react";
import "./ExpandingButton.css";

interface ExpandingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode | null;
}

export default function ExpandingButton({
  ...props
}: ExpandingButtonProps): React.ReactNode {
  // The theme attribute only exists client-side; guard so prerender never
  // touches document, and read during render so the label tracks toggles.
  const isDark =
    typeof document !== "undefined" &&
    document.documentElement.getAttribute("data-theme") === "dark";

  return (
    <button
      {...props}
      className={`expanding-button${
        props?.className?.length ? " " + props.className : ""
      }`}
    >
      <span>{isDark ? "Light Toggle" : "Dark Toggle"}</span>
    </button>
  );
}
