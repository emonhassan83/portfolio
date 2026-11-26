"use client";

import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "../redux/store.js";
import { ThemeProvider } from "../lib/ThemeProvider.jsx";
import { Toaster } from "react-hot-toast";
import { usePathname } from "next/navigation";

export default function Providers({ children }) {
  const pathname = usePathname();

  return (
    <ThemeProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          {/* The public home page needs no persisted auth state: render it immediately so it is server-rendered (SEO). */}
          {(bootstrapped) =>
            bootstrapped || pathname === "/" ? (
              <>
                {children}
                <Toaster />
              </>
            ) : null
          }
        </PersistGate>
      </Provider>
    </ThemeProvider>
  );
}
