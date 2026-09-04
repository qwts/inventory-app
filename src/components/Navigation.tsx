"use client";
import { useIndexedDB } from "@/providers/IndexedDbProvider";
import { usePopupContext } from "../providers/PopupProvider";
import { useRef } from "react";
import BulkEdit from "./BulkEdit";
import UploadInventory from "./UploadInventory";
import { Album } from "@/app/Album";
interface NavigationProps {
  lastAlbumId?: number;
  albumCount: number;
}

export default function Navigation({
  lastAlbumId,
  albumCount,
}: NavigationProps) {
  const { addItem, removeItem, removeAllItems } = useIndexedDB();
  const { showPopup } = usePopupContext();
  const uploadForm = useRef(<UploadInventory />);
  return (
    <nav>
      <div className="flex flex-wrap gap-y-10 my-10 px-5 justify-between">
        <div className="flex flex-grow flex-wrap space-x-4 justify-center lg:justify-start lg:pl-[118px]">
          {["Total Inventory", "Viewing"].map((item) => (
            <div key={item}>
              <span>
                <strong>{item}:</strong>
                <span className="pl-4">{albumCount}</span>
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
            onClick={() => removeAllItems()}
          >
            Clear
          </button>
        </div>
      </div>
      <hr />
    </nav>
  );
}
