import { ActionTypes, CartType } from "@/types/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const INITIAL_STATE = {
  products: [],
  totalItems: 0,
  totalPrice: 0,
};

export const useCartStore = create(
  persist<CartType & ActionTypes>(
    (set, get) => ({
      products: INITIAL_STATE.products,
      totalItems: INITIAL_STATE.totalItems,
      totalPrice: INITIAL_STATE.totalPrice,
      addToCart(item) {
        const products = get().products;
        const productInState = products.find(
          (product) => product.id === item.id
        );

        if (productInState) {
          const updatedProducts = products.map((product) =>
            product.id === productInState.id
              ? {
                ...item,
                quantity: parseInt(item.quantity) + parseInt(product.quantity),
                price: parseInt(item.price) + parseInt(product.price),
              }
              : item
          );
          set((state) => ({
            products: updatedProducts,
            totalItems: parseInt(state.totalItems) + parseInt(item.quantity),
            totalPrice: parseInt(state.totalPrice) + parseInt(item.price),
          }));
        } else {
          set((state) => ({
            products: [...state.products, item],
            totalItems: parseInt(state.totalItems) + parseInt(item.quantity),
            totalPrice: parseInt(state.totalPrice) + parseInt(item.price),
          }));
        }
      },
      removeFromCart(item) {
        set((state) => ({
          products: state.products.filter((product) => product.id !== item.id),
          totalItems: parseInt(state.totalItems) - parseInt(item.quantity),
          totalPrice: parseInt(state.totalPrice) - parseInt(item.price),
        }));
      },
    }),
    { name: "cart", skipHydration: true }
  )
);
