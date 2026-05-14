"use client";
import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Provider as ReduxProvider } from "react-redux";
import { SessionProvider } from "next-auth/react";
import { Toast } from "@heroui/react";
import { store } from "@/src/redux/store";

if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const orig = console.error;
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("Encountered a script tag")
    )
      return;
    orig.apply(console, args);
  };
}

export function Providers({
  children,
  session,
  ...props
}: React.ComponentProps<typeof NextThemesProvider> & { session?: any }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="light" {...props}>
      <ReduxProvider store={store}>
        <SessionProvider session={session}>
          {children}
          <Toast.Provider />
        </SessionProvider>
      </ReduxProvider>
    </NextThemesProvider>
  );
}
