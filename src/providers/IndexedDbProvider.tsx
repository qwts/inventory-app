"use client";
import React, { createContext, useContext, useCallback } from "react";
import { Album, AlbumProps } from "@/app/Album";

let _totalCount = 0;

const dispatchDbEvent = (eventType: string) => {
  window.dispatchEvent(
    new CustomEvent("indexedDBUpdate", { detail: eventType })
  );
};

// ------------------------------------------------------
// 1) Create a context type interface
// ------------------------------------------------------
interface IndexedDBContextType {
  addItem: (item: Album) => Promise<Album | null>;
  getItem: (id: string) => Promise<unknown>;
  removeItem: (id: number) => Promise<void>;
  getAllItems: () => Promise<Album[]>;
  removeAllItems: () => Promise<void>;
  totalCount: () => number;
}

// ------------------------------------------------------
// 2) Create context
// ------------------------------------------------------
const IndexedDBContext = createContext<IndexedDBContextType | null>(null);

// ------------------------------------------------------
// 3) Create a provider component
// ------------------------------------------------------
interface IndexedDBProviderProps {
  dbName?: string;
  storeName?: string;
  children: React.ReactNode;
}

function totalCount(): number {
  return _totalCount;
}

// Utility function for opening DB
async function openDB(dbName: string, storeName: string, version = 1) {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(dbName, version);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: "id", autoIncrement: true });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Utility function for retrieving store transaction
async function getTransaction(
  dbName: string,
  storeName: string,
  mode: IDBTransactionMode
) {
  const db = await openDB(dbName, storeName);
  return db.transaction(storeName, mode).objectStore(storeName);
}

export const IndexedDBProvider: React.FC<IndexedDBProviderProps> = ({
  dbName = "inventory",
  storeName = "albums",
  children,
}) => {
  // Define your CRUD operations as callbacks
  const addItem = useCallback(
    async (item: Album): Promise<Album | null> => {
      if (
        !item.artistName &&
        !item.albumName &&
        !item.barcode &&
        !item.country &&
        !item.genre &&
        !item.year &&
        !item.variant &&
        !item.image
      ) {
        // Nothing to store. Resolve (with null) rather than hang: callers
        // await this inside Promise.all, so an unsettled promise stalls
        // the whole batch forever.
        return null;
      }
      const store = await getTransaction(dbName, storeName, "readwrite");
      return new Promise<Album>((resolve, reject) => {
        const request = item.id
          ? store.put(item.toJSON())
          : store.add(item.toJSON());
        request.onsuccess = () => {
          dispatchDbEvent("albumAdded"); // Notify listeners
          resolve(
            new Album({
              ...item.album,
              id: Number(request.result),
            } as AlbumProps)
          );
        };
        request.onerror = () => reject(request.error);
      });
    },
    [dbName, storeName]
  );

  const getItem = useCallback(
    async (id: string) => {
      const store = await getTransaction(dbName, storeName, "readonly");
      return new Promise<unknown>((resolve, reject) => {
        const request = store.get(id);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    },
    [dbName, storeName]
  );

  const removeItem = useCallback(
    async (id: number): Promise<void> => {
      const store = await getTransaction(dbName, storeName, "readwrite");
      return new Promise<void>((resolve, reject) => {
        const request = store.delete(id);
        dispatchDbEvent("albumRemoved"); // Notify listeners
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    },
    [dbName, storeName]
  );

  const getAllItems = useCallback(async (): Promise<Album[]> => {
    const store = await getTransaction(dbName, storeName, "readwrite");
    return new Promise((resolve, reject) => {
      const request = store.getAll(); // Fetch all albums

      request.onsuccess = () => {
        _totalCount = request.result.length;
        return resolve(request.result.map((item) => new Album(item)));
      };
      request.onerror = () => reject(request.error);
    });
  }, [dbName, storeName]);

  // remove all items from index db
  const removeAllItems = useCallback(async (): Promise<void> => {
    const store = await getTransaction(dbName, storeName, "readwrite");
    return new Promise<void>((resolve, reject) => {
      const request = store.clear();
      dispatchDbEvent("allAlbumsRemoved"); // Notify listeners
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }, [dbName, storeName]);

  return (
    <IndexedDBContext.Provider
      value={{
        addItem,
        getItem,
        removeItem,
        getAllItems,
        removeAllItems,
        totalCount,
      }}
    >
      {children}
    </IndexedDBContext.Provider>
  );
};

// ------------------------------------------------------
// 4) Create a hook to use that context
// ------------------------------------------------------
export function useIndexedDB() {
  const context = useContext(IndexedDBContext);
  if (!context) {
    throw new Error("useIndexedDB must be used within an IndexedDBProvider");
  }
  return context;
}
