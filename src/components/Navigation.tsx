"use client";
import { useIndexedDB } from "@/providers/IndexedDbProvider";
import { usePopupContext } from "../providers/PopupProvider";
import { useRef } from "react";
import BulkEdit from "./BulkEdit";
import UploadInventory from "./UploadInventory";
import { Album } from "@/app/Album";
interface NavigationProps {
  lastAlbumId?: number;
}

export default function Navigation({ lastAlbumId }: NavigationProps) {
  const { addItem, removeItem, removeAllItems, totalCount } = useIndexedDB();
  const { showPopup } = usePopupContext();
  const uploadForm = useRef(<UploadInventory />);
  function valueForCounter(counter: string) {
    switch (counter) {
      case "Total Inventory":
        return totalCount();
      case "Viewing":
        return totalCount();
      case "Total Pages":
        return 1;
      case "Current Page":
        return 1;
      case "Search Results":
        return 0;
      default:
        return 0;
    }
  }
  return (
    <nav>
      <div className="flex flex-wrap gap-y-10 my-10 px-5 justify-between">
        <div className="flex flex-grow flex-wrap space-x-4 justify-center lg:justify-start lg:pl-[118px]">
          {[
            "Total Inventory",
            "Viewing",
            "Total Pages",
            "Current Page",
            "Search Results",
          ].map((item, index) => (
            <div key={index}>
              <span>
                <strong>{item}:</strong>
                <span className="pl-4">{valueForCounter(item)}</span>
              </span>
            </div>
          ))}
        </div>
        <div className="flex flex-grow md:w-[340px] space-x-4 justify-center lg:justify-end">
          <button
            id="add"
            className="min-w-12"
            onClick={() =>
              addItem(
                new Album({
                  artistName: `Arist`,
                  albumName: "Album",
                  barcode: `${Math.random()}`,
                  year: "2025",
                  country: "usa",
                  genre: "rock",
                  variant: "",
                  image: "",
                })
              )
            }
          >
            <strong>+</strong>
          </button>
          <button
            id="remove"
            className={
              "min-w-12" + (lastAlbumId == 0 ? " invisible" : " visible")
            }
            onClick={() => lastAlbumId && removeItem(lastAlbumId)}
          >
            <strong>-</strong>
          </button>
          <button
            id="bulkEdit"
            className="min-w-[120px] px-4 py-1"
            onClick={() =>
              showPopup({
                content: <BulkEdit />,
                leftBlock: uploadForm.current,
              })
            }
          >
            Bulk Edit
          </button>
          <button
            id="clear"
            className="px-4 py-1"
            onClick={() => {
              if (
                window.confirm(
                  "Remove every album from the library? This cannot be undone."
                )
              ) {
                removeAllItems();
              }
            }}
          >
            Clear
          </button>
        </div>
      </div>
      <hr />
    </nav>
  );
}
