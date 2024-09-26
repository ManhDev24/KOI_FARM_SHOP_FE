import { createSlice } from "@reduxjs/toolkit";
import {
  setLocalStorage,
  getLocalStorage,
  removeLocalStorage,
} from "../../utils/LocalStorage.js";

const initialState = {
  items: getLocalStorage("cartItems") || [],
  total: 0,
};

// Calculate total based on the initial items if available
initialState.total = initialState.items.reduce(
  (acc, item) => acc + item.price * item.quantity,
  0
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      // Your logic for adding to cart
      const itemToAdd = action.payload;
      const existingItem = state.items.find((item) => item.id === itemToAdd.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...itemToAdd, quantity: 1 });
      }

      state.total += itemToAdd.price;
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
          existingItem.quantity -= 1;
        } else {
          state.items.splice(index, 1);
        }

        state.total -= itemToRemove.price;
        if (state.items.length > 0) {
          setLocalStorage("cartItems", state.items);
        } else {
          removeLocalStorage("cartItems");
        }
      }
    },
  },
});

// Export actions and reducer
export const { addToCart, removeFromCart } = cartSlice.actions;
export default cartSlice.reducer;
