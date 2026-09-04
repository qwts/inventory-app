"use client";

import { useState, useEffect, ReactNode } from "react";
import ReactDOM from "react-dom";

// Custom Hook: usePopup
export interface PopupContent {
  leftBlock: ReactNode;
  content: ReactNode;
}

export function usePopup() {
  const [popupContent, setPopupContent] = useState<PopupContent | null>(null);
  const showPopup = (content: PopupContent) => setPopupContent(content);
  const closePopup = () => setPopupContent(null);

  // Cleanup effect when unmounting
  useEffect(() => {
    return () => setPopupContent(null);
  }, []);

  const popupElement = popupContent
    ? ReactDOM.createPortal(
        <div
          className="fixed inset-0 flex flex-col items-center justify-center bg-blue-950 bg-opacity-95 p-10"
          onClick={(e) => {
            e.stopPropagation();
            closePopup();
          }}
        >
          <div className="flex self-stretch justify-between px-5 mb-5">
            <div className="w-[142px]">{popupContent.leftBlock}</div>
            <div className="w-[42px]">
              <button className="modal-close px-3 py-1">✖</button>
            </div>
          </div>
          <div
            className="self-stretch h-[90%] mx-5 bg-white rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {popupContent.content}
          </div>
        </div>,
        document.querySelector("#modal-root") as Element
      )
    : null;

  return { showPopup, closePopup, popupElement };
}
