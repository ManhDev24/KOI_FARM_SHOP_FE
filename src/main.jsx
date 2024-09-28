import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import { Provider } from "react-redux";
import Store from "./Redux/Store.js";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
    mutations: {},
  },
});

createRoot(document.getElementById("root")).render(
  <Provider store={Store}>
    <Router>
      <QueryClientProvider client={queryClient}>
        <GoogleOAuthProvider clientId="1097391559765-mlqeb37es5jof3736qagniim3aj8ivsh.apps.googleusercontent.com">
          <App />
          <ToastContainer />
        </GoogleOAuthProvider>
        <ReactQueryDevtools initialIsOpen={true} />
      </QueryClientProvider>
    </Router>
  </Provider>
);
