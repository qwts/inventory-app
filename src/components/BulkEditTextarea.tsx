import { useEffect, useState } from "react";
import { useIndexedDB } from "../providers/IndexedDbProvider";
import { useDebounce } from "@/hooks/Debounce";
import { Album } from "@/app/Album";

export default function BulkEditTextarea() {
  const { getAllItems, addItem } = useIndexedDB();
  const [textItems, setTextItems] = useState<string>("");
  const debounce = useDebounce();
  // initial load
  useEffect(() => {
    const getAllItemsAndUpdateText = debounce("initalLoadItems", async () => {
      try {
        const getItemsResult = await getAllItems();
        const textItems = getItemsResult.map((item) => item.toString());
        setTextItems(textItems.join("\n"));
      } catch (error) {
        console.error("Failed to fetch items: ", error);
      }
    });
    getAllItemsAndUpdateText();
  }, [getAllItems, debounce]);

  // file upload
  useEffect(() => {
    const updateAlbums = debounce("fileLoadUpdate", async () => {
      const getItemsResult = await getAllItems();
      const textItems = getItemsResult.map((item) => item.toString());
      setTextItems(textItems.join("\n"));
    });
    window.addEventListener("fileUpload", updateAlbums);
    return () => {
      window.removeEventListener("fileUpload", updateAlbums);
    };
  });

  useEffect(() => {
    const afterChangeUpdateItems = debounce(
      "onChangeUpdateItems",
      async (updatedTextItems: string | null) => {
        if (!updatedTextItems) return;
        const previousTexItems = textItems
          .split("\n")
          .filter((item) => item.length > 0);

        const updatedLines = updatedTextItems
          .split("\n")
          .filter((item) => item);
        await Promise.all(
          updatedLines
            .filter((item) => item.match(/\|[0-9]*$/))
            .filter(
              (item, index) =>
                index > previousTexItems.length - 1 ||
                item.replace(/\s/g, "") !==
                  previousTexItems[index].replace(/\s/g, "")
            )
            .map((item) => addItem(Album.fromString(item)))
        );

        await Promise.all(
          updatedLines
            .filter((item) => !item.match(/\|[0-9]*$/))
            .map(async (item) => {
              const a = Album.fromString(item);
              console.log(a);
              return addItem(a);
            })
        );
      }
    );
    afterChangeUpdateItems(textItems);
    window.addEventListener("closeBulkEditView", afterChangeUpdateItems);
    return () =>
      window.removeEventListener("closeBulkEditView", afterChangeUpdateItems);
  }, [textItems, addItem, debounce]);

  function getTitle(title: string) {
    switch (title) {
      case "Artist Name":
        return "Artist Name".padEnd(70);
      case "Album Name":
        return "Album Name".padEnd(70);
      case "Barcode":
        return "Barcode".padEnd(37);
      case "Country":
        return "Country".padEnd(18);
      case "Year":
        return "Year".padEnd(19);
      case "Genre":
        return "Genre".padEnd(18);
      case "Variant":
        return "Variant".padEnd(18);
      case "Image":
        return "Image".padEnd(436);
      case "Id":
        return "Id".padEnd(10);
      default:
        return title;
    }
  }

  return (
    <div className="h-full w-full overflow-scroll">
      <div className="h-[96%] flex w-max flex-wrap">
        <div className="flex text-black py-2 bg-gray-200 flex-grow p-4">
          {Album.keys().map((title) => (
            <span
              key={title}
              className="whitespace-pre text-[15px] font-mono font-semibold"
            >
              {getTitle(title)}
            </span>
          ))}
        </div>
        <textarea
          className="min-h-[100%] flex-grow resize-none w-full overflow-x-hidden p-4 whitespace-pre font-mono text-[13px]"
          placeholder={`arist                                                                           | album                                                                          | barcode                                  | coutry             | year               | genre              | variant            | ${"image".padEnd(
            500
          )} | id          `}
          value={textItems}
          onChange={(e) => {
            setTextItems(e.target.value);
          }}
        />
      </div>
    </div>
  );
}
