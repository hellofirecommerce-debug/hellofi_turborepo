// app/client.ts
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from "@apollo/client";
import { createErrorLink } from "./errorLink";

export function createClient() {
  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000/graphql",
    credentials: "include",
  });

  const clientOptions = {
    link: ApolloLink.from([createErrorLink(), httpLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: { errorPolicy: "all" },
      query: { errorPolicy: "all" },
      mutate: { errorPolicy: "all" },
    },
  } as unknown as ConstructorParameters<typeof ApolloClient>[0];

  return new ApolloClient(clientOptions);
}
