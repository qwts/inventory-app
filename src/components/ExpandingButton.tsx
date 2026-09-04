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
      <span>{isDark ? "Light Toggle" : "Dark Toggle"}</span>
    </button>
  );
}
