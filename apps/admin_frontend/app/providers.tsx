// app/providers.tsx
"use client";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { ApolloProvider } from "@apollo/client/react";
import { Toaster } from "sonner";
import client from "../lib/apollo/client";
import { SidebarProvider } from "../context/SidebarContext";

export default function Providers({ children }: { children: React.ReactNode }) {
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
