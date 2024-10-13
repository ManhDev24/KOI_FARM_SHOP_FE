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
        state.total += itemToAdd.price * (itemToAdd.quantity || 1);
        setLocalStorage("cartItems", state.items);
      } else {
        existingItem.quantity += itemToAdd.quantity || 1;
        state.total += itemToAdd.price * (itemToAdd.quantity || 1);
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
    addToCartBatch: (state, action) => {
      const itemsToAdd = action.payload; // payload là mảng chứa các sản phẩm cần thêm

      itemsToAdd.forEach((itemToAdd) => {
        const existingItem = state.items.find(
          (item) => item.id === itemToAdd.id
        );

        if (!existingItem) {
          // Nếu sản phẩm chưa có trong giỏ hàng, thêm mới sản phẩm
          state.items.push({
            ...itemToAdd,
            quantity: itemToAdd.quantity || 1, // Đảm bảo quantity luôn có giá trị
          });
          state.total += itemToAdd.price * (itemToAdd.quantity || 1);
        } else {
          // Nếu sản phẩm đã tồn tại, cập nhật số lượng
          if (itemToAdd.isBatch) {
            existingItem.quantity += itemToAdd.quantity || 1;
          } else {
            existingItem.quantity += 1; // Nếu mua theo cá thể, tăng thêm 1
          }
          state.total += itemToAdd.price * (itemToAdd.quantity || 1);
        }
      });

      // Sau khi cập nhật xong giỏ hàng, lưu toàn bộ vào localStorage
      setLocalStorage("cartItems", state.items);
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
