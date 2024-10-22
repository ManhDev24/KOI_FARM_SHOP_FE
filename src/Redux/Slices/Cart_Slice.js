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

      // Check if it's an individual koi fish (isBatch false or undefined)
      const existingItem = state.items.find(
        (item) => item.id === itemToAdd.id && !item.isBatch
      );

      if (!existingItem) {
        // Add the koi fish if it doesn't exist in the cart
        state.items.push({
          ...itemToAdd,
          quantity: 1, // Always set quantity to 1 for individual koi fish
        });
        state.total += itemToAdd.price;
        setLocalStorage("cartItems", state.items);
      } else {
        console.log("Cá Koi cá thể này đã có trong giỏ hàng!");
      }
    },
    addToCartBatch: (state, action) => {
      const itemToAdd = action.payload;

      // Check if the batch already exists in the cart
      const existingBatch = state.items.find(
        (item) => item.batchID === itemToAdd.batchID && item.isBatch
      );

      if (existingBatch) {
        // If the batch exists, update the quantity
        existingBatch.quantity += itemToAdd.quantity || 1;
        state.total += itemToAdd.price * (itemToAdd.quantity || 1);
      } else {
        // If the batch doesn't exist, add it as a new entry
        state.items.push({
          ...itemToAdd,
          quantity: itemToAdd.quantity || 1,
        });
        state.total += itemToAdd.price * (itemToAdd.quantity || 1);
      }

      setLocalStorage("cartItems", state.items);
    },
    removeFromCart: (state, action) => {
      const itemToRemove = action.payload;
      const index = state.items.findIndex(
        (item) => item.id === itemToRemove.id && item.batchID === itemToRemove.batchID
      );

      if (index !== -1) {
        state.items.splice(index, 1);
        state.total -= itemToRemove.price * (itemToRemove.quantity || 1);

        if (state.items.length > 0) {
          setLocalStorage("cartItems", state.items);
        } else {
          removeLocalStorage("cartItems");
        }
      }
    },
    removeAllFromCart: (state) => {
      state.items = [];
      state.total = 0;
      removeLocalStorage("cartItems");
    },
    saveDiscountRate: (state, action) => {
      state.discountRate = action.payload;
    },
  },
});

// Export actions and reducer
export const {
  addToCart,
  removeFromCart,
  removeAllFromCart,
  saveDiscountRate,
  addToCartBatch,
} = cartSlice.actions;
export default cartSlice.reducer;
