import { ApolloClient, InMemoryCache, ApolloLink } from "@apollo/client";
import UploadHttpLink from "apollo-upload-client/UploadHttpLink.mjs";
import { errorLink } from "./errorLink";

const uploadLink = new UploadHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:8000/graphql",
  credentials: "include",
  headers: {
    "Apollo-Require-Preflight": "true",
  },
});

const clientOptions = {
  link: ApolloLink.from([errorLink, uploadLink as unknown as ApolloLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: "all",
    },
    query: {
      errorPolicy: "all",
    },
    mutate: {
      errorPolicy: "all",
    },
  },
} as unknown as ConstructorParameters<typeof ApolloClient>[0];

const client = new ApolloClient(clientOptions);

export default client;
