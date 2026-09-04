"use client";
import { ButtonHTMLAttributes } from "react";
import "./ExpandingButton.css";

interface ExpandingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode | null;
  isDark: boolean;
}

export default function ExpandingButton({
  isDark,
  ...props
}: ExpandingButtonProps): React.ReactNode {
  return (
    <button
      {...props}
      className={`expanding-button${
        props?.className?.length ? " " + props.className : ""
      }`}
    >
      {/* mode comes from Header's state; the theme also initializes from
          prefers-color-scheme, which the server cannot know, so the first
          paint may legitimately differ from the server HTML */}
      <span suppressHydrationWarning>
        {isDark ? "Light Toggle" : "Dark Toggle"}
      </span>
    </button>
  );
}
