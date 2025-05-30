import { configureStore } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";
import storage from "redux-persist/lib/storage"; // sử dụng localStorage
import { persistReducer, persistStore } from "redux-persist";
import rootReducer from "../reducers/index"; // reducer tổng hợp

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const configStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: true,
        serializableCheck: false,
      }).concat(thunk),
    devTools: process.env.NODE_ENV !== "production",
  });

  return store;
};

export const persistor = persistStore(configStore());
export default configStore;
