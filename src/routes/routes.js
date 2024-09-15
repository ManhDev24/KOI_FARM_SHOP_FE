import HomePage from "../components/HomePage/HomePage";
import DefaultLayout from "../layouts/DefautLayout/DefaultLayout";
import ChangePassword from "../modules/ChangePassword/ChangePassword";
import Login from "../modules/LoginPage/Login";
import Otp from "../modules/OTP/OTP";
import Register from "../modules/RegisterPage/Register";

export const publicRoutes = [
  {
    path: "/",
    component: HomePage,
    layout: DefaultLayout,
  },
  {
    path: "/login",
    component: Login,
    layout: null,
  },
  {
    path: "/register",
    component: Register,
    layout: null,
  },
  {
    path: "/otp",
    component: Otp,
    layout: null,
  },
  {
    path: "/changePassword",
    component: ChangePassword,
    layout: null,
  },
];

export const privateRoutes = [];
