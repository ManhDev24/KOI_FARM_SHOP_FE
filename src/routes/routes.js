import { layouts } from "chart.js";
import HomePage from "../components/HomePage/HomePage";
import DefaultLayout from "../layouts/DefautLayout/DefaultLayout";
import AdminLayout from "../modules/Admin/AdminLayout/AdminLayout";
import BathManagement from "../modules/Admin/BathManagement/BathManagement";
import CategoryManagement from "../modules/Admin/CategoryManagement/CategoryManagement";
import ConsigmentManagement from "../modules/Admin/ConsigmentManagement/ConsigmentManagement";
import ConsigmentManagementDetail from "../modules/Admin/ConsigmentManagement/ConsigmentManagementDetail";
import DashBoard from "../modules/Admin/Dashboard/DashBoard";
import FishCareManagement from "../modules/Admin/FishCareManagement.jsx/FishCareManagement";
import FishManagement from "../modules/Admin/FishManagement/FishManagement";
import PaymentManagement from "../modules/Admin/PaymentManagement/PaymentManagement";
import PaymentManagementDetail from "../modules/Admin/PaymentManagement/PaymentManagementDetail";
import UserManagement from "../modules/Admin/UserManagement/UserManagement";

import BatchFish from "../modules/BatchFish/BatchFish";
import BatchFishDetail from "../modules/BatchFish/BatchFish-Detail";

import Blog from "../modules/Blog/Blog/Blog";
import ListBlog from "../modules/Blog/ListBlog/ListBlog";

import Cart from "../modules/Cart/Cart";
import ChangePassword from "../modules/ChangePassword/ChangePassword";
import ConsignmentHistoryDetail from "../modules/Consignment/ConsignmentHistoryDetail";
import KoiConsignmentPolicies from "../modules/Consignment/KoiConsignmentPolicies";
import RequestConsignment from "../modules/Consignment/RequestConsignment";
import ServiceFeeConsignment from "../modules/Consignment/ServiceFeeConsignment";
import StatusConsignment from "../modules/Consignment/StatusConsignment";

import Error from "../modules/ErrorPage/Error";
import FishDetail from "../modules/FishDetail/FishDetail";
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
  const dataProfile = getLocalStorage("user");
  if (dataProfile && dataProfile.email) {
    return dataProfile.email;
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
    path: `/profile`,
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
    path: "/payment-detail/:orderId",
    component: PaymentDetailPage,
    layout: DefaultLayout,
  },
  {
    path: "/fish-detail/:id",
    component: FishDetail,
    layout: DefaultLayout,
  },

  {
    path: "/batch-fish",
    component: BatchFish,
    layout: DefaultLayout,
  },
  {
    path: "/batch-detail/:id",
    component: BatchFishDetail,
    layout: DefaultLayout,
  },
  {
    path: "/request-consignment",
    component: KoiConsignmentPolicies,

    layout: DefaultLayout,
  },
  {
    path: "/Form-consignment",
    component: RequestConsignment,
    layout: DefaultLayout,
  },
  {
    path: "/list-blog",
    component: ListBlog,
    layout: DefaultLayout,
  },
  {
    path: "/blog",
    component: Blog,

    layout: DefaultLayout,
  },
  {
    path: "/status-consignment",
    component: StatusConsignment,

    layout: DefaultLayout,
  },
  {
    path: "/servicefee-consignment",
    component: ServiceFeeConsignment,

    layout: DefaultLayout,
  },
  {
    path: "/consignment-history",
    component: ConsignmentHistoryDetail,

    layout: DefaultLayout,
  },
];

export const privateRoutes = [
  {
    path: "/admin",
    component: AdminLayout,
    layout: null,
    roles: ["manager", "staff"],
    children: [
      {
        path: "dashboard",
        component: DashBoard,
        roles: ["manager"],
        layout: null,
      },
      {
        path: "user-management",
        component: UserManagement,
        roles: ["manager"],
        layout: null,
      },
      {
        path: "fish-management",
        component: FishManagement,
        roles: ["manager", "staff"],
        layout: null,
      },
      {
        path: "category-management",
        component: CategoryManagement,
        roles: ["manager", "staff"],
        layout: null,
      },
      {
        path: "batch-management",
        component: BathManagement,
        roles: ["manager", "staff"],
        layout: null,
      },
      {
        path: "consignment-management",
        component: ConsigmentManagement,
        roles: ["manager", "staff"],
        layout: null,
      },
      {
        path: "consignment-management-detail/:consignmentId",
        component: ConsigmentManagementDetail,
        roles: ["manager", "staff"],
        layout: null,
      },
      {
        path: "payment-management",
        component: PaymentManagement,
        roles: ["manager", "staff"],
        layout: null,
      },
      {
        path: "payment-management-detail/:orderId",
        component: PaymentManagementDetail,
        roles: ["manager", "staff"],
        layout: null,
      },
      {
        path: "FishCare-management",
        component: FishCareManagement,
        layouts: null,
      },
    ],
  },
];
