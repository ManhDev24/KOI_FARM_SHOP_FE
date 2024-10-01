import HomePage from "../components/HomePage/HomePage";
import DefaultLayout from "../layouts/DefautLayout/DefaultLayout";
import Cart from "../modules/Cart/Cart";
import ChangePassword from "../modules/ChangePassword/ChangePassword";
import Error from "../modules/ErrorPage/Error";
import ForgotPassword from "../modules/ForgotPassword/ForgotPassword";
import ListFish from "../modules/ListFish/ListFish";
import Login from "../modules/LoginPage/Login";
import ComparisonModal from "../modules/Modal/ComparisonModal";
import Otp from "../modules/OTP/Otp";
import PaymentHistoryPage from "../modules/PaymentHistory/PaymentHistoryPage/PaymentHistoryPage";
import PaymentDetailPage from "../modules/PaymentPage/PaymentDetailPage/PaymentDetailPage";
import PaymentFailPage from "../modules/PaymentPage/PaymentFailPage/PaymentFailPage";
import ThankPage from "../modules/PaymentPage/ThankPage/ThankPage";
import Profile from "../modules/Profile/Profile";
import Register from "../modules/RegisterPage/Register";
import { getLocalStorage } from "../utils/LocalStorage";
const fetchEmail = () => {
  const dataProfile = getLocalStorage("user"); // Get 'user' from localStorage
  if (dataProfile && dataProfile.email) {
    return dataProfile.email; // Return email if found
  } else {
    console.error("No user profile found in localStorage");
    return null;
  }
};

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
    path: `/profile/${fetchEmail()}`,
    component: Profile,
    layout: DefaultLayout,
  },
  {
    path: "/compare",
    component: ComparisonModal,
    layout: DefaultLayout,
  },
  {
    path: "/thank-you",
    component: ThankPage,
    layout: DefaultLayout,
  },
  {
    path: "/payment-fail",
    component: PaymentFailPage,
    layout: DefaultLayout,
  },
  {
    path: "/payment-history",
    component: PaymentHistoryPage,
    layout: DefaultLayout,
  },
  {
    path: "/payment-detail",
    component: PaymentDetailPage,
    layout: DefaultLayout,
  },
];

export const privateRoutes = [];
