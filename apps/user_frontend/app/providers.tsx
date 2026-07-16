// app/providers.tsx
"use client";

import React, { useMemo } from "react";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { ApolloProvider } from "@apollo/client/react";
import { Toaster } from "sonner";
import { createClient } from "./client";

export default function Providers({ children }: { children: React.ReactNode }) {
  const client = useMemo(() => createClient(), []);

  return (
    <ApolloProvider client={client}>
      <Toaster position="bottom-right" richColors />
      <ProgressBar
        height="3px"
        color="rgb(33,76,123)"
        options={{ showSpinner: false }}
        shallowRouting
      />
      {children}
    </ApolloProvider>
  );
}
