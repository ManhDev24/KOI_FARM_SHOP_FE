import { createSlice } from "@reduxjs/toolkit";

// Khởi tạo state ban đầu
const initialState = {
  typePayment: false, // Lưu trữ typePayment (boolean)
};

const typeSlice = createSlice({
  name: "type",  // Đặt tên slice là 'type'
  initialState,
  reducers: {
    // Hàm để lưu giá trị typePayment
    saveTypePayment: (state, action) => {
      state.typePayment = action.payload; // Cập nhật typePayment trong state
    },
  },
});

// Export action để sử dụng trong component
export const { saveTypePayment } = typeSlice.actions;
// Export reducer để thêm vào store
export default typeSlice.reducer;
