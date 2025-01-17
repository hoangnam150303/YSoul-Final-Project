// store/configStore.ts
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "../reducers/index";

// configuration store using Redux Toolkit
const configStore = () => {
  const store = configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== "production",
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: true,
      }),
  });

  return store;
};

export default configStore;
