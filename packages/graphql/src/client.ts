import { ApolloClient, InMemoryCache, ApolloLink } from "@apollo/client";
import UploadHttpLink from "apollo-upload-client/UploadHttpLink.mjs";
import { createErrorLink } from "./errorLink";

export function createApolloClient(
  graphqlUrl: string,
  silentOperations: string[] = [],
) {
  const uploadLink = new UploadHttpLink({
    uri: graphqlUrl,
    credentials: "include",
    headers: {
      "Apollo-Require-Preflight": "true",
    },
  });

  const clientOptions = {
    link: ApolloLink.from([
      createErrorLink(silentOperations),
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
