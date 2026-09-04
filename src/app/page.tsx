"use client";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Main from "@/components/Main";
import { useState, useEffect } from "react";
import { Album } from "./Album";
import { useIndexedDB } from "@/providers/IndexedDbProvider";
import { PopupProvider } from "@/providers/PopupProvider";

export default function Home() {
  const [albums, setAlbums] = useState<Album[]>([]);

  const { getAllItems } = useIndexedDB();

  useEffect(() => {
    async function fetchAllItems() {
      const albums = await getAllItems();
      setAlbums(albums);
    }
    fetchAllItems();
  }, [getAllItems]);

  useEffect(() => {
    const updateAlbums = async () => {
      const albums = await getAllItems();
      setAlbums(albums);
    };
    window.addEventListener("indexedDBUpdate", updateAlbums);
    return () => {
      window.removeEventListener("indexedDBUpdate", updateAlbums);
    };
  });

  return (
    <PopupProvider>
      <Header />
      <Navigation
        lastAlbumId={albums.length && albums[albums.length - 1].id}
        albumCount={albums.length}
      />
      <Main albums={albums} />
    </PopupProvider>
  );
}
