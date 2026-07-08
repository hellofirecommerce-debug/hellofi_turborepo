import UploadHttpLink from "apollo-upload-client/UploadHttpLink.mjs";
import { createErrorLink } from "./errorLink";
import { ApolloClient, InMemoryCache, ApolloLink } from "@apollo/client";

export function createClient() {
  const uploadLink = new UploadHttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:8000/graphql",
    credentials: "include",
    headers: {
      "Apollo-Require-Preflight": "true",
    },
  });

  const clientOptions = {
    link: ApolloLink.from([
      createErrorLink(),
      uploadLink as unknown as ApolloLink,
    ]),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: { errorPolicy: "all" },
      query: { errorPolicy: "all" },
      mutate: { errorPolicy: "all" },
    },
  } as unknown as ConstructorParameters<typeof ApolloClient>[0];

  return new ApolloClient(clientOptions);
}
