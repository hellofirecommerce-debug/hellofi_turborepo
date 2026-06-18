// app/providers.tsx
"use client";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { GraphQLProvider } from "@repo/graphql";
import { Toaster } from "sonner";
import { SidebarProvider } from "../context/SidebarContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GraphQLProvider
      graphqlUrl={
        process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:8000/graphql"
      }
      silentOperations={["AdminMe"]}
    >
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
    </GraphQLProvider>
  );
}
