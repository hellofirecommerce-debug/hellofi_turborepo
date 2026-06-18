import { GraphQLProvider } from "@repo/graphql";
import { Toaster } from "sonner";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GraphQLProvider
      graphqlUrl={
        process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:8000/graphql"
      }
      silentOperations={["Me"]}
    >
      <Toaster position="bottom-right" richColors />
      {children}
    </GraphQLProvider>
  );
}
