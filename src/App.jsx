import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import { publicRoutes } from "./routes/routes";
import React from "react";
import DefaultLayout from "./layouts/DefautLayout/DefaultLayout";
import { getLocalStorage } from "./utils/LocalStorage";

function App() {
  const isAuth = () => {
    return !!getLocalStorage("user");
  };
  return (
    <div className="">
      <Routes>
        {publicRoutes.map((route, index) => {
          const Layout = route.layout || React.Fragment;
          const Component = route.component;
          if (
            (isAuth() &&
              (route.path === "/login" ||
                route.path === "/register" ||
                route.path === "/otp")) ||
            route.path === "/forgotPassword" ||
            route.path === "/changePassword"
          ) {
            return (
              <Route
                key={index}
                path={route.path}
                element={<Navigate to="/" />}
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
