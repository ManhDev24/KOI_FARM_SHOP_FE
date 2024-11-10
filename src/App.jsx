import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import { privateRoutes, publicRoutes } from "./routes/routes";
import React from "react";
import { getLocalStorage } from "./utils/LocalStorage";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { useQuery } from "@tanstack/react-query";
import { AuthApi } from "./apis/Auth.api";

function App() {

  const isAuth = () => !!getLocalStorage("user");


  const user = getLocalStorage("user");
  const token = user?.accessToken;


  const { data: checkRoleUser, isLoading: isCheckRoleLoading, isError: isErrorCheckRole } = useQuery({
    queryKey: ['checkRole'],
    queryFn: () => AuthApi.checkRoleOfUser()
  })

  const getRoleUser = checkRoleUser?.data;

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
            [
              "/login",
              "/register",
              "/otp",
              "/forgotPassword",
              "/changePassword",
            ].includes(route.path)
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
                Layout ? (
                  <Layout>
                    <Component />
                  </Layout>
                ) : (
                  <Component />
                )
              }
            />
          );
        })}

        {privateRoutes.map((route, index) => {
          const Layout = route.layout || React.Fragment;
          const Component = route.component;

          if (!isAuth()) {
            return (
              <Route
                key={index}
                path={route.path + "/*"}
                element={<Navigate to="/" />}
              />
            );
          }

          if (["manager", "staff"].includes(getRoleUser) && isAuth()) {
            return (
              <Route
                key={index}
                path={route.path}
                element={
                  Layout ? (
                    <Layout>
                      <Component />
                    </Layout>
                  ) : (
                    <Component />
                  )
                }
              >
                {route.children &&
                  route.children.map((child, childIndex) => {
                    const ChildLayout = child.layout || React.Fragment;
                    const ChildComponent = child.component;

                    return (
                      <Route
                        key={childIndex}
                        path={child.path}
                        element={
                          ChildLayout ? (
                            <ChildLayout>
                              <ChildComponent />
                            </ChildLayout>
                          ) : (
                            <ChildComponent />
                          )
                        }
                      />
                    );
                  })}
              </Route>
            );
          } else {
            return (
              <Route
                key={index}
                path={route.path + "/*"}
                element={<Navigate to="/" />}
              />
            );
          }
        })}

        <Route path="*" element={<Navigate to="/error" />} />
      </Routes>
    </div>
  );
}

export default App;
