"use client";
import React, { createContext, useContext, useCallback } from "react";
import { Album, AlbumProps } from "@/app/Album";

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
  removeItem: (id: number) => Promise<void>;
  getAllItems: () => Promise<Album[]>;
  removeAllItems: () => Promise<void>;
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

// Run one request against the store and settle the connection afterwards.
// Without the close, every operation leaks an open connection.
async function runRequest<T>(
  dbName: string,
  storeName: string,
  mode: IDBTransactionMode,
  issue: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T> {
  const db = await openDB(dbName, storeName);
  return new Promise<T>((resolve, reject) => {
    const transaction = db.transaction(storeName, mode);
    const request = issue(transaction.objectStore(storeName));
    transaction.oncomplete = () => db.close();
    transaction.onabort = () => db.close();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
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
      const id = await runRequest(dbName, storeName, "readwrite", (store) =>
        item.id ? store.put(item.toJSON()) : store.add(item.toJSON())
      );
      dispatchDbEvent("albumAdded"); // Notify listeners
      return new Album({
        ...item.album,
        id: Number(id),
      } as AlbumProps);
    },
    [dbName, storeName]
  );

  const removeItem = useCallback(
    async (id: number): Promise<void> => {
      await runRequest(dbName, storeName, "readwrite", (store) =>
        store.delete(id)
      );
      dispatchDbEvent("albumRemoved"); // Notify listeners
    },
    [dbName, storeName]
  );

  const getAllItems = useCallback(async (): Promise<Album[]> => {
    const items = await runRequest<AlbumProps[]>(
      dbName,
      storeName,
      "readonly",
      (store) => store.getAll()
    );
    return items.map((item) => new Album(item));
  }, [dbName, storeName]);

  // remove all items from index db
  const removeAllItems = useCallback(async (): Promise<void> => {
    await runRequest(dbName, storeName, "readwrite", (store) => store.clear());
    dispatchDbEvent("allAlbumsRemoved"); // Notify listeners
  }, [dbName, storeName]);

  return (
    <IndexedDBContext.Provider
      value={{
        addItem,
        removeItem,
        getAllItems,
        removeAllItems,
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
