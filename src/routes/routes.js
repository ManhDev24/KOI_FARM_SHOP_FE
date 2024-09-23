import HomePage from "../components/HomePage/HomePage";
import DefaultLayout from "../layouts/DefautLayout/DefaultLayout";
import Cart from "../modules/Cart/Cart";
import ChangePassword from "../modules/ChangePassword/ChangePassword";
import Error from "../modules/ErrorPage/Error";
import ForgotPassword from "../modules/ForgotPassword/ForgotPassword";
import ListFish from "../modules/ListFish/ListFish";
import Login from "../modules/LoginPage/Login";
import Otp from "../modules/OTP/Otp";
import Profile from "../modules/Profile/Profile";
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
  {
    path: "/forgotPassword",
    component: ForgotPassword,
    layout: null,
  },
  {
    path: "/koiList",
    component: ListFish,
    layout: DefaultLayout,
  },
  {
    path: "/cart",
    component: Cart,
    layout: DefaultLayout,
  },
  {
    path: "/error",
    component: Error,
    layout: DefaultLayout,
  },
  {
    path: "/*",
    component: Error,
    layout: DefaultLayout,
  },
  {
    path: "/profile",
    component: Profile,
    layout: DefaultLayout,
  },
];

export const privateRoutes = [];
