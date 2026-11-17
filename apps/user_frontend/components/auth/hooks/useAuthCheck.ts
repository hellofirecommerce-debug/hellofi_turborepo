// src/components/auth/hooks/useAuthCheck.ts
import { useQuery } from "@apollo/client/react";
import { GET_ME } from "../../../lib/graphql/queires/userAuth.queries";

export function useAuthCheck() {
  const { data, loading, refetch } = useQuery<any>(GET_ME, {
    fetchPolicy: "network-only", // Always check fresh on price evaluate
  });

  return {
    isLoggedIn: !!data?.getUserMe, // was data?.getMe → query field is getUserMe
    user: data?.getUserMe,
    loading,
    refetch,
  };
}
