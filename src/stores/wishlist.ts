import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WishlistItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string | null;
}

interface WishlistStore {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  toggleItem: (item: WishlistItem) => void;
  isInWishlist: (id: string) => boolean;
  getItems: () => WishlistItem[];
}

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        set((state) => {
          if (state.items.some((i) => i.id === item.id)) return state;
          return { items: [...state.items, item] };
        });
      },
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }));
      },
      toggleItem: (item) => {
        set((state) => {
          const exists = state.items.some((i) => i.id === item.id);
          if (exists) {
            return { items: state.items.filter((i) => i.id !== item.id) };
          }
          return { items: [...state.items, item] };
        });
      },
      isInWishlist: (id) => get().items.some((i) => i.id === id),
      getItems: () => get().items,
    }),
    { name: "wishlist-storage" }
  )
);
