import { createSlice } from "@reduxjs/toolkit";
import {
  getLocalStorage,
  removeLocalStorage,
  setLocalStorage,
} from "../../utils/LocalStorage";

const initialState = {
  items: [], // Each item will have { id, price, quantity }
  total: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id);

      if (existingItem) {
        // Increase quantity if item already exists in the cart
        existingItem.quantity += 1;
      } else {
        // Add new item with quantity of 1 if it doesn't exist
        state.items.push({ ...newItem, quantity: 1 });
      }

      // Update total price
      state.total += newItem.price;

      // Persist cart items in local storage
      setLocalStorage("cartItems", state.items);
    },
    removeFromCart: (state, action) => {
      const itemToRemove = action.payload;
      const index = state.items.findIndex(
        (item) => item.id === itemToRemove.id
      );

      if (index !== -1) {
        const existingItem = state.items[index];

        if (existingItem.quantity > 1) {
          // Decrease quantity if more than 1
          existingItem.quantity -= 1;
        } else {
          // Remove item if quantity is 1
          state.items.splice(index, 1);
        }

        // Update total price
        state.total -= itemToRemove.price;

        // Handle local storage update
        if (state.items.length > 0) {
          setLocalStorage("cartItems", state.items);
        } else {
          removeLocalStorage("cartItems");
        }
      }
    },
  },
});

export const { addToCart, removeFromCart } = cartSlice.actions;
export default cartSlice.reducer;
