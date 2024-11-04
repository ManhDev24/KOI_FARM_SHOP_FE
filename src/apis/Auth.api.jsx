import { useSelector } from "react-redux";
import fetcher from "./Fetcher";
import { getLocalStorage } from "../utils/LocalStorage";
import url from "../constant/constant";
export const AuthApi = {
  login: async (data) => {
    try {
      const response = await fetcher.post(
        `${url}/login/signin`,
        data
      );
      return response.data;
    } catch (error) {
      throw Error(error.response.data.message);
    }
  },
  register: async (data) => {
    try {
      const response = await fetcher.post(
        `${url}/account/register`,
        data
      );
      return response.data;
    } catch (error) {
      throw Error(error.response.data.message);
    }
  },
  otpVerify: async (otp, email) => {
    try {
      const response = await fetcher.post(
        `${url}/verify-otp?email=${email}&otp=${otp}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  forgotEmail: async (email) => {
    try {
      const response = await fetcher.post(
        `${url}/login/forgotPassword/${email}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  loginWithGoogle: async (data) => {
    try {
      const response = await fetcher.post(
        `${url}/login/signingoogle`,
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  changePassword: async (email, data) => {
    try {
      const token = getLocalStorage("otpToken"); // Retrieve the token
      const response = await fetcher.post(
        `${url}/login/changePassword/${email}`,

        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  resendOtp: async (email) => {
    try {
      const response = await fetcher.post(
        `${url}/resend-otp?email=${email}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  userProfile: async (email) => {
    try {
      const response = await fetcher.get(
        `${url}/account/profile/${email}`
      );

      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  // Cập nhật thông tin hồ sơ (Họ và tên, Địa chỉ, Số điện thoại)
  userProfileEdit: async (id, accessToken, updatedData) => {
    try {
      const response = await fetcher.put(
        `${url}/account/update/updateProfile/${id}`, // URL API không cần accessToken ở đây
        updatedData, // Truyền dữ liệu cần cập nhật (name, address, phone)
        {
          headers: {
            'Content-Type': 'application/json', // Xác định kiểu dữ liệu là JSON
            'Authorization': `Bearer ${accessToken}`, // Thêm accessToken vào headers để xác thực
          },
        }
      );

      const data = response.data;
      return data; // Trả về dữ liệu sau khi cập nhật thành công
    } catch (error) {
      console.error('Lỗi khi cập nhật hồ sơ:', error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || 'Lỗi khi cập nhật hồ sơ');
    }
  },

  // Cập nhật mật khẩu
  checkPassword: async (id, password) => {
    try {
      const response = await fetcher.post(
        `${url}/account/checkPassword/${id}`,
        { password } // Gửi mật khẩu trong body của yêu cầu
      );
      return response.data; // Trả về dữ liệu phản hồi từ API
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi xác thực mật khẩu');
    }
  },
  updatePassword: async (id, accessToken, password) => {
    try {
      const response = await fetcher.put(
        `${url}/account/updatePassword/${id}`,
        { password }, // Gửi mật khẩu trong body của yêu cầu
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Truyền accessToken trong headers
          },
        }
      );
      return response.data; // Trả về dữ liệu phản hồi từ API
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi cập nhật mật khẩu');
    }
  },

  uploadAvatar: async (id, file) => {
    if (!file) {
      throw new Error("Vui lòng chọn một file để upload.");
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${url}/account/profile/updateAvatar/${id}`, {
        method: 'POST',

        body: formData, // Gửi formData trực tiếp
      });

      return response.data;
    } catch (error) {

      console.error('Error uploading avatar:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Lỗi cập nhật ảnh');
    }
  },







};
