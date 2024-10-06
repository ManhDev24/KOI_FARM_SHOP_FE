import { createSlice } from "@reduxjs/toolkit";
import {
  setLocalStorage,
  getLocalStorage,
  removeLocalStorage,
} from "../../utils/LocalStorage.js";

const initialState = {
  items: getLocalStorage("cartItems") || [],
  total: 0,
  discountRate: 0,
};

const calculateTotalPrice = (items) => {
  return items.reduce(
    (total, item) => total + item.price * (item.quantity || 1),
    0
  );
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    ...initialState,
    total: calculateTotalPrice(initialState.items),
  },
  reducers: {
    addToCart: (state, action) => {
      const itemToAdd = action.payload;
      const existingItem = state.items.find((item) => item.id === itemToAdd.id);

      if (!existingItem) {
        state.items.push(itemToAdd);
        state.total += itemToAdd.price;
        setLocalStorage("cartItems", state.items);
      }
    },
    removeFromCart: (state, action) => {
      const itemToRemove = action.payload;
      const index = state.items.findIndex(
        (item) => item.id === itemToRemove.id
      );

      if (index !== -1) {
        state.items.splice(index, 1);
        state.total -= itemToRemove.price;

        if (state.items.length > 0) {
          setLocalStorage("cartItems", state.items);
        } else {
          removeLocalStorage("cartItems");
        }
      }
    },
    removeAllFromCart: (state, action) => {
      state.items = [];
      state.total = 0;
    },
    saveDiscountRate: (state, action) => {
      state.discountRate = action.payload;
    },
  },
});

// Export actions and reducer
export const { addToCart, removeFromCart,saveDiscountRate } = cartSlice.actions;
export default cartSlice.reducer;
