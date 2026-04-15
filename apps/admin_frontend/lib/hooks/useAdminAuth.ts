// apps/admin_frontend/lib/hooks/useAdminAuth.ts
"use client";

import { useQuery } from "@apollo/client/react";
import { ADMIN_ME } from "../graphql/queries/auth.queries";
import { useEffect } from "react";
import { useNavigate } from "./useNavigate";

interface AdminMeResponse {
  adminMe: {
    id: string;
    fName: string;
    lName: string;
    email: string;
    userType: string;
    status: string;
  } | null;
}

// ← use on login page → redirect to /home if already logged in
export function useRedirectIfLoggedIn() {
  const { navigate } = useNavigate();
  const { data, loading } = useQuery<AdminMeResponse>(ADMIN_ME, {
    errorPolicy: "ignore",
  });

  useEffect(() => {
    if (!loading && data?.adminMe) {
      navigate("/home");
    }
  }, [data, loading, navigate]);

  return { loading };
}

// ← use on dashboard pages → redirect to / if not logged in
export function useRequireAuth() {
  const { navigate } = useNavigate();
  const { data, loading } = useQuery<AdminMeResponse>(ADMIN_ME, {
    errorPolicy: "ignore",
    fetchPolicy: "network-only", // ← always fetch fresh from server
  });

  useEffect(() => {
    if (!loading && !data?.adminMe) {
      navigate("/");
    }
  }, [data, loading, navigate]);

  return { admin: data?.adminMe, loading };
}
