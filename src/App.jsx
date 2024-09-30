import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import { publicRoutes } from "./routes/routes";
import React from "react"; // Import useState to manage modal state
import DefaultLayout from "./layouts/DefautLayout/DefaultLayout";
import { getLocalStorage } from "./utils/LocalStorage";
import { useSelector } from "react-redux";
import ComparisonModal from "./modules/Modal/ComparisonModal";

function App() {
  // Check if user is authenticated by checking local storage
  const isAuth = () => {
    return !!getLocalStorage("user");
  };

  const isAllowedToAccessForgotPassword = useSelector(
    (state) => state.auth.isAllowedToAccessForgotPassword
  );

  return (
    <div className="">
      <Routes>
        {publicRoutes.map((route, index) => {
          const Layout = route.layout || React.Fragment;
          const Component = route.component;

          if (
            isAuth() &&
            (route.path === "/login" ||
              route.path === "/register" ||
              route.path === "/otp" ||
              route.path === "/forgotPassword" ||
              route.path === "/changePassword")
          ) {
            return (
              <Route
                key={index}
                path={route.path}
                element={<Navigate to="/" />}
              />
            );
          }

          if (
            route.path === "/changePassword" &&
            !isAllowedToAccessForgotPassword
          ) {
            return (
              <Route
                key={index}
                path={route.path}
                element={<Navigate to="/login" />}
              />
            );
          }

          return (
            <Route
              key={index}
              path={route.path}
              element={
                <Layout>
                  <Component />
                </Layout>
              }
            />
          );
        })}

        

        <Route path="*" element={<Navigate to="/404" />} />
      </Routes>
    </div>
  );
}

export default App;
