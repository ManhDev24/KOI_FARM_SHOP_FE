import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  total: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      
      state.items.push(newItem);
      state.total += newItem.price; // Assuming `price` is a property of newItem
    },
    removeFromCart: (state, action) => {
      const itemToRemove = action.payload; // The item to remove

      const index = state.items.findIndex(item => item.id === itemToRemove.id);

      if (index !== -1) {
        const itemPrice = state.items[index].price;
        state.items.splice(index, 1);
        state.total -= itemPrice; 
      }
    },
  },
});

export const { addToCart, removeFromCart } = cartSlice.actions;
export default cartSlice.reducer;
