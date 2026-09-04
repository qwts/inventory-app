"use client";
import { useEffect, useState } from "react";
import { ButtonHTMLAttributes } from "react";
import "./ExpandingButton.css";

interface ExpandingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode | null;
}

export default function ExpandingButton({
  ...props
}: ExpandingButtonProps): React.ReactNode {
  // Reading data-theme happens after mount: window access during render
  // crashes prerendering, and the attribute is only set client-side.
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(
      document.documentElement.getAttribute("data-theme") === "dark"
    );
  }, []);

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
