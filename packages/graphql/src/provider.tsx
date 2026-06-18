"use client";
import React, { useMemo } from "react";
import { ApolloProvider } from "@apollo/client/react";
import { createApolloClient } from "./client";

interface Props {
  graphqlUrl: string;
  silentOperations?: string[];
  children: React.ReactNode;
}

export function GraphQLProvider({
  graphqlUrl,
  silentOperations = [],
  children,
}: Props) {
  const client = useMemo(
    () => createApolloClient(graphqlUrl, silentOperations),
    [graphqlUrl, silentOperations],
  );
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
