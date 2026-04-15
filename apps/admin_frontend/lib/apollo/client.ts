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

const client = new ApolloClient({
  link: ApolloLink.from([errorLink, uploadLink as unknown as ApolloLink]),
  cache: new InMemoryCache(),

  // 🔥🔥 THIS IS THE REAL FIX (GLOBAL)
  defaultOptions: {
    watchQuery: {
      errorPolicy: "all",
    },
    query: {
      errorPolicy: "all",
    },
    mutate: {
      errorPolicy: "all", // ✅ applies to ALL mutations automatically
    },
  },
});

export default client;
