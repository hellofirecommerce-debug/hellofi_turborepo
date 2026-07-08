// app/providers.tsx
"use client";
import React, { useMemo } from "react";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { ApolloProvider } from "@apollo/client/react";
import { Toaster } from "sonner";
import { SidebarProvider } from "../context/SidebarContext";

import { createClient } from "./client";

export default function Providers({ children }: { children: React.ReactNode }) {
  const client = useMemo(() => createClient(), []);

  return (
    <ApolloProvider client={client}>
      <SidebarProvider>
        <Toaster position="bottom-right" richColors />
        <ProgressBar
          height="3px"
          color="rgb(33,76,123)"
          options={{ showSpinner: false }}
          shallowRouting
        />
        {children}
      </SidebarProvider>
    </ApolloProvider>
  );
}
