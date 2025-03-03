import AppRoutes from "./routes/AppRoutes";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter} from "react-router-dom";
import "./styles/index.css";
import { Provider } from "react-redux";
import configStore from "./configs/configureStore";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "bootstrap-icons/font/bootstrap-icons.css";
import PlayerContextProvider from "./context/PlayerContext";

const store = configStore();

const clientId = import.meta.env.VITE_CLIENT_ID;

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={clientId}>
    <Provider store={store}>
      <BrowserRouter>
        <PlayerContextProvider>
          <AppRoutes />
        </PlayerContextProvider>
      </BrowserRouter>
    </Provider>
  </GoogleOAuthProvider>
);
