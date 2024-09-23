import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import { publicRoutes } from "./routes/routes";
import React from "react";
import DefaultLayout from "./layouts/DefautLayout/DefaultLayout";
import { getLocalStorage } from "./utils/LocalStorage";
import { useSelector } from "react-redux";

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
          // Use the layout specified in the route, or fallback to React.Fragment
          const Layout = route.layout || React.Fragment;
          const Component = route.component;

          // Redirect authenticated users away from login, register, or OTP routes
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
      </Routes>
    </div>
  );
}

export default App;
